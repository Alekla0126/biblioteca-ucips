import uuid
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


def _ext_for_mime(mime: str) -> str:
    mapping = {
        "application/pdf": ".pdf",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }
    return mapping.get(mime, "")
