import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

_firebase_ready = False


def init_firebase():
    global _firebase_ready
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
            firebase_admin.initialize_app(cred)
            _firebase_ready = True
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.warning(
                f"Firebase not configured — auth endpoints will return 503. Error: {e}"
            )
            _firebase_ready = False


def _require_firebase():
    if not _firebase_ready:
        raise ValueError(
            "Firebase no está configurado en el servidor. "
            "Contacte al administrador para activar la autenticación."
        )


def verify_firebase_token(token: str) -> dict:
    _require_firebase()
    try:
        decoded = auth.verify_id_token(token, check_revoked=True)
        return decoded
    except auth.RevokedIdTokenError:
        raise ValueError("Token revocado")
    except auth.InvalidIdTokenError:
        raise ValueError("Token inválido")
    except Exception as e:
        raise ValueError(f"Error verificando token: {e}")


def set_admin_claim(uid: str, is_admin: bool = True):
    _require_firebase()
    auth.set_custom_user_claims(uid, {"admin": is_admin})
