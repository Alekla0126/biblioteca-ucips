from fastapi import APIRouter
from app.api.v1 import auth, categorias, recursos

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(categorias.router)
api_router.include_router(recursos.router)
