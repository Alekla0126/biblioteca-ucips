from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from pathlib import Path
from typing import Optional
from app.core.database import get_db
from app.core.config import get_settings
from app.models.recurso import Recurso
from app.schemas.recurso import RecursoResponse, RecursoListResponse, PaginatedRecursos
from app.api.deps import get_current_admin
from app.services.storage import save_upload, delete_file, ALLOWED_PDF_MIME, ALLOWED_IMAGE_MIME
from app.models.user import User

router = APIRouter(prefix="/recursos", tags=["recursos"])
settings = get_settings()


def _to_list_response(r: Recurso) -> RecursoListResponse:
    return RecursoListResponse(
        id_recurso=r.id_recurso,
        titulo=r.titulo,
        autor=r.autor,
        anio=r.anio,
        ruta_portada=r.ruta_portada,
        vistas=r.vistas,
        id_categoria=r.id_categoria,
        categoria_nombre=r.categoria.nombre if r.categoria else None,
    )


@router.get("/", response_model=PaginatedRecursos)
async def list_recursos(
    q: Optional[str] = Query(None, min_length=2),
    categoria_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Recurso).options(selectinload(Recurso.categoria))

    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(or_(Recurso.titulo.ilike(pattern), Recurso.autor.ilike(pattern)))
    if categoria_id:
        stmt = stmt.where(Recurso.id_categoria == categoria_id)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar() or 0

    stmt = stmt.offset((page - 1) * size).limit(size).order_by(Recurso.fecha_agregado.desc())
    result = await db.execute(stmt)
    items = result.scalars().all()

    return PaginatedRecursos(
        items=[_to_list_response(r) for r in items],
        total=total,
        page=page,
        size=size,
        pages=-(-total // size),
    )


@router.get("/recientes", response_model=list[RecursoListResponse])
async def get_recientes(limit: int = Query(12, ge=1, le=50), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Recurso).options(selectinload(Recurso.categoria))
        .order_by(Recurso.fecha_agregado.desc()).limit(limit)
    )
    return [_to_list_response(r) for r in result.scalars().all()]


@router.get("/populares", response_model=list[RecursoListResponse])
async def get_populares(limit: int = Query(12, ge=1, le=50), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Recurso).options(selectinload(Recurso.categoria))
        .order_by(Recurso.vistas.desc()).limit(limit)
    )
    return [_to_list_response(r) for r in result.scalars().all()]


@router.get("/{recurso_id}", response_model=RecursoResponse)
async def get_recurso(recurso_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Recurso).options(selectinload(Recurso.categoria))
        .where(Recurso.id_recurso == recurso_id)
    )
    recurso = result.scalar_one_or_none()
    if not recurso:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")
    recurso.vistas += 1
    return recurso


@router.get("/{recurso_id}/pdf")
async def stream_pdf(recurso_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recurso).where(Recurso.id_recurso == recurso_id))
    recurso = result.scalar_one_or_none()
    if not recurso:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")

    pdf_path = Path(settings.UPLOAD_DIR) / "pdfs" / recurso.ruta_pdf
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="Archivo PDF no encontrado")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=recurso.ruta_pdf,
        headers={"Content-Disposition": "inline"},
    )


@router.post("/", response_model=RecursoResponse, status_code=status.HTTP_201_CREATED)
async def create_recurso(
    titulo: str = Form(...),
    autor: str = Form(...),
    anio: str = Form(...),
    descripcion: Optional[str] = Form(None),
    id_categoria: Optional[int] = Form(None),
    pdf_file: UploadFile = File(...),
    portada_file: Optional[UploadFile] = File(None),
    _admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    pdf_name = await save_upload(pdf_file, "pdfs", ALLOWED_PDF_MIME)
    portada_name = None
    if portada_file and portada_file.filename:
        portada_name = await save_upload(portada_file, "portadas", ALLOWED_IMAGE_MIME)

    recurso = Recurso(
        titulo=titulo.strip(),
        autor=autor.strip(),
        anio=anio.strip(),
        descripcion=descripcion,
        id_categoria=id_categoria,
        ruta_pdf=pdf_name,
        ruta_portada=portada_name,
    )
    db.add(recurso)
    await db.flush()
    await db.refresh(recurso)
    return recurso


@router.patch("/{recurso_id}", response_model=RecursoResponse)
async def update_recurso(
    recurso_id: int,
    titulo: Optional[str] = Form(None),
    autor: Optional[str] = Form(None),
    anio: Optional[str] = Form(None),
    descripcion: Optional[str] = Form(None),
    id_categoria: Optional[int] = Form(None),
    portada_file: Optional[UploadFile] = File(None),
    _admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Recurso).where(Recurso.id_recurso == recurso_id))
    recurso = result.scalar_one_or_none()
    if not recurso:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")

    if titulo:
        recurso.titulo = titulo.strip()
    if autor:
        recurso.autor = autor.strip()
    if anio:
        recurso.anio = anio.strip()
    if descripcion is not None:
        recurso.descripcion = descripcion
    if id_categoria is not None:
        recurso.id_categoria = id_categoria

    if portada_file and portada_file.filename:
        if recurso.ruta_portada:
            await delete_file("portadas", recurso.ruta_portada)
        recurso.ruta_portada = await save_upload(portada_file, "portadas", ALLOWED_IMAGE_MIME)

    await db.refresh(recurso)
    return recurso


@router.delete("/{recurso_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recurso(
    recurso_id: int,
    _admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Recurso).where(Recurso.id_recurso == recurso_id))
    recurso = result.scalar_one_or_none()
    if not recurso:
        raise HTTPException(status_code=404, detail="Recurso no encontrado")

    await delete_file("pdfs", recurso.ruta_pdf)
    if recurso.ruta_portada:
        await delete_file("portadas", recurso.ruta_portada)
    await db.delete(recurso)
