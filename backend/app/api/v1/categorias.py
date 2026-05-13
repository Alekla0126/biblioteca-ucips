from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.categoria import Categoria
from app.models.recurso import Recurso
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.api.deps import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/categorias", tags=["categorias"])


@router.get("/", response_model=list[CategoriaResponse])
async def list_categorias(db: AsyncSession = Depends(get_db)):
    # Single query with LEFT JOIN + GROUP BY — avoids N+1 selects
    stmt = (
        select(Categoria, func.count(Recurso.id_recurso).label("cnt"))
        .outerjoin(Recurso, Recurso.id_categoria == Categoria.id_categoria)
        .group_by(Categoria.id_categoria)
        .order_by(Categoria.nombre)
    )
    rows = (await db.execute(stmt)).all()
    return [
        CategoriaResponse(
            id_categoria=row.Categoria.id_categoria,
            nombre=row.Categoria.nombre,
            icono=row.Categoria.icono,
            total_recursos=row.cnt,
        )
        for row in rows
    ]


@router.get("/{categoria_id}", response_model=CategoriaResponse)
async def get_categoria(categoria_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Categoria).where(Categoria.id_categoria == categoria_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    count_result = await db.execute(
        select(func.count(Recurso.id_recurso)).where(Recurso.id_categoria == categoria_id)
    )
    total = count_result.scalar() or 0
    return CategoriaResponse(
        id_categoria=cat.id_categoria,
        nombre=cat.nombre,
        icono=cat.icono,
        total_recursos=total,
    )


@router.post("/", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
async def create_categoria(
    data: CategoriaCreate,
    _admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(Categoria).where(Categoria.nombre == data.nombre))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Ya existe una categoría con ese nombre")

    cat = Categoria(nombre=data.nombre, icono=data.icono)
    db.add(cat)
    await db.flush()
    return CategoriaResponse(id_categoria=cat.id_categoria, nombre=cat.nombre, icono=cat.icono, total_recursos=0)


@router.patch("/{categoria_id}", response_model=CategoriaResponse)
async def update_categoria(
    categoria_id: int,
    data: CategoriaUpdate,
    _admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Categoria).where(Categoria.id_categoria == categoria_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    if data.nombre is not None:
        cat.nombre = data.nombre
    if data.icono is not None:
        cat.icono = data.icono

    count_result = await db.execute(
        select(func.count(Recurso.id_recurso)).where(Recurso.id_categoria == categoria_id)
    )
    total = count_result.scalar() or 0
    return CategoriaResponse(id_categoria=cat.id_categoria, nombre=cat.nombre, icono=cat.icono, total_recursos=total)


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_categoria(
    categoria_id: int,
    _admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Categoria).where(Categoria.id_categoria == categoria_id))
    cat = result.scalar_one_or_none()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    await db.delete(cat)
