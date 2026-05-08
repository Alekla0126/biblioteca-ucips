import uuid
import asyncio
import magic
import aiofiles
from pathlib import Path
from fastapi import UploadFile, HTTPException
from app.core.config import get_settings

settings = get_settings()

ALLOWED_PDF_MIME = {"application/pdf"}
ALLOWED_IMAGE_MIME = {"image/jpeg", "image/png", "image/webp"}
MAX_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024


async def save_upload(file: UploadFile, subfolder: str, allowed_mime: set[str]) -> str:
    content = await file.read()

    if len(content) > MAX_BYTES:
        raise HTTPException(413, f"Archivo demasiado grande. Máximo {settings.MAX_FILE_SIZE_MB}MB")

    mime = magic.from_buffer(content[:2048], mime=True)
    if mime not in allowed_mime:
        raise HTTPException(415, f"Tipo de archivo no permitido: {mime}")

    ext = _ext_for_mime(mime)
    filename = f"{uuid.uuid4().hex}{ext}"
    dest_dir = Path(settings.UPLOAD_DIR) / subfolder
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / filename

    async with aiofiles.open(dest, "wb") as f:
        await f.write(content)

    return filename


async def delete_file(subfolder: str, filename: str) -> None:
    path = Path(settings.UPLOAD_DIR) / subfolder / filename
    if path.exists() and path.is_file():
        path.unlink()


async def generate_pdf_thumbnail(pdf_path: Path) -> str | None:
    """Render page 1 of a PDF to a PNG thumbnail. Returns filename or None on failure."""
    try:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, _sync_thumbnail, pdf_path)
    except Exception:
        return None


def _sync_thumbnail(pdf_path: Path) -> str | None:
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(str(pdf_path))
        page = doc[0]
        mat = fitz.Matrix(1.5, 1.5)
        pix = page.get_pixmap(matrix=mat)
        filename = f"{uuid.uuid4().hex}.png"
        dest = Path(settings.UPLOAD_DIR) / "portadas" / filename
        dest.parent.mkdir(parents=True, exist_ok=True)
        pix.save(str(dest))
        doc.close()
        return filename
    except Exception:
        return None


def _ext_for_mime(mime: str) -> str:
    mapping = {
        "application/pdf": ".pdf",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }
    return mapping.get(mime, "")
