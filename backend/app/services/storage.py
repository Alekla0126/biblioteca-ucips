import uuid
import asyncio
import magic
from fastapi import UploadFile, HTTPException
from app.core.config import get_settings

settings = get_settings()

ALLOWED_PDF_MIME = {"application/pdf"}
ALLOWED_IMAGE_MIME = {"image/jpeg", "image/png", "image/webp"}
MAX_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024


def _s3():
    import boto3
    return boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        region_name=settings.S3_REGION,
    )


def _put(key: str, body: bytes, content_type: str) -> None:
    _s3().put_object(
        Bucket=settings.S3_BUCKET,
        Key=key,
        Body=body,
        ContentType=content_type,
    )


def _delete(key: str) -> None:
    try:
        _s3().delete_object(Bucket=settings.S3_BUCKET, Key=key)
    except Exception:
        pass


def _download(key: str) -> bytes:
    resp = _s3().get_object(Bucket=settings.S3_BUCKET, Key=key)
    return resp["Body"].read()


async def save_upload(file: UploadFile, subfolder: str, allowed_mime: set[str]) -> tuple[str, bytes]:
    """Validate, upload to S3, return (filename, raw_bytes)."""
    content = await file.read()

    if len(content) > MAX_BYTES:
        raise HTTPException(413, f"Archivo demasiado grande. Máximo {settings.MAX_FILE_SIZE_MB}MB")

    mime = magic.from_buffer(content[:2048], mime=True)
    if mime not in allowed_mime:
        raise HTTPException(415, f"Tipo de archivo no permitido: {mime}")

    ext = _ext_for_mime(mime)
    filename = f"{uuid.uuid4().hex}{ext}"
    key = f"{subfolder}/{filename}"

    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _put, key, content, mime)

    return filename, content


async def delete_file(subfolder: str, filename: str) -> None:
    key = f"{subfolder}/{filename}"
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _delete, key)


async def download_file(subfolder: str, filename: str) -> bytes:
    key = f"{subfolder}/{filename}"
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _download, key)


async def generate_pdf_thumbnail(pdf_bytes: bytes) -> str | None:
    """Render page 1 of a PDF (bytes) to PNG and upload to S3. Returns filename or None."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _sync_thumbnail, pdf_bytes)


def _sync_thumbnail(pdf_bytes: bytes) -> str | None:
    try:
        import fitz
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pix = doc[0].get_pixmap(matrix=fitz.Matrix(1.5, 1.5))
        png_bytes = pix.tobytes("png")
        doc.close()

        filename = f"{uuid.uuid4().hex}.png"
        _put(f"portadas/{filename}", png_bytes, "image/png")
        return filename
    except Exception:
        return None


def _ext_for_mime(mime: str) -> str:
    return {"application/pdf": ".pdf", "image/jpeg": ".jpg",
            "image/png": ".png", "image/webp": ".webp"}.get(mime, "")


def ensure_bucket_public() -> None:
    """Set public-read policy on the bucket so portada images load in browsers."""
    import json
    policy = json.dumps({
        "Version": "2012-10-17",
        "Statement": [{
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": ["s3:GetObject"],
            "Resource": [f"arn:aws:s3:::{settings.S3_BUCKET}/*"],
        }],
    })
    try:
        _s3().put_bucket_policy(Bucket=settings.S3_BUCKET, Policy=policy)
    except Exception:
        pass
