from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import logging

from app.core.config import get_settings
from app.core.firebase import init_firebase
from app.core.database import engine, Base
from app.core.limiter import limiter
from app.api.v1.router import api_router
from app.models import user, categoria, recurso  # noqa: F401
from app.services.storage import ensure_bucket_public

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
settings = get_settings()


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        if settings.ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_firebase()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    ensure_bucket_public()
    logger.info("Application started")
    yield
    await engine.dispose()
    logger.info("Application shutdown")


app = FastAPI(
    title="Biblioteca UCIPS API",
    version="2.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

if settings.ENVIRONMENT == "production":
    # Only enforce trusted hosts in production; Caddy handles external validation.
    # Include the internal proxy hostname so health checks from Caddy work.
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.allowed_hosts_list,
    )


@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.0.0"}


@app.get("/uploads/{subfolder}/{filename}")
async def serve_upload(subfolder: str, filename: str):
    """Redirect image requests to the public S3 bucket URL."""
    return RedirectResponse(
        url=f"{settings.s3_public_base}/{subfolder}/{filename}",
        status_code=302,
    )


app.include_router(api_router)
