import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

_firebase_app = None


def init_firebase():
    global _firebase_app
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
            _firebase_app = firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Firebase initialization failed: {e}")
            raise


def verify_firebase_token(token: str) -> dict:
    try:
        decoded = auth.verify_id_token(token, check_revoked=True)
        return decoded
    except auth.RevokedIdTokenError:
        raise ValueError("Token has been revoked")
    except auth.InvalidIdTokenError:
        raise ValueError("Invalid token")
    except Exception as e:
        raise ValueError(f"Token verification failed: {e}")


def set_admin_claim(uid: str, is_admin: bool = True):
    auth.set_custom_user_claims(uid, {"admin": is_admin})
