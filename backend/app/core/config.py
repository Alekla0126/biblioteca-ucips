from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str
    FIREBASE_PROJECT_ID: str
    FIREBASE_SERVICE_ACCOUNT_PATH: str = "/app/firebase-service-account.json"
    SECRET_KEY: str = "dev-secret"
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    ALLOWED_HOSTS: str = "localhost,127.0.0.1"
    MAX_FILE_SIZE_MB: int = 50

    # Contabo S3 / Object Storage
    S3_ENDPOINT: str = "https://eu2.contabostorage.com"
    S3_BUCKET: str = "biblioteca"
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_REGION: str = "EU"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    @property
    def allowed_hosts_list(self) -> list[str]:
        return [h.strip() for h in self.ALLOWED_HOSTS.split(",")]

    @property
    def s3_public_base(self) -> str:
        return f"{self.S3_ENDPOINT}/{self.S3_BUCKET}"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
