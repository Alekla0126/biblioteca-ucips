from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from app.schemas.categoria import CategoriaResponse


class RecursoBase(BaseModel):
    titulo: str
    autor: str
    anio: str
    descripcion: Optional[str] = None
    id_categoria: Optional[int] = None

    @field_validator("titulo", "autor")
    @classmethod
    def not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("El campo no puede estar vacío")
        return v

    @field_validator("anio")
    @classmethod
    def valid_year(cls, v: str) -> str:
        if not v.isdigit() or not (1900 <= int(v) <= 2100):
            raise ValueError("Año inválido")
        return v


class RecursoCreate(RecursoBase):
    pass


class RecursoUpdate(BaseModel):
    titulo: Optional[str] = None
    autor: Optional[str] = None
    anio: Optional[str] = None
    descripcion: Optional[str] = None
    id_categoria: Optional[int] = None


class RecursoResponse(BaseModel):
    id_recurso: int
    titulo: str
    autor: str
    anio: str
    descripcion: Optional[str] = None
    id_categoria: Optional[int] = None
    ruta_pdf: Optional[str]
    ruta_portada: Optional[str]
    vistas: int
    fecha_agregado: datetime
    categoria: Optional[CategoriaResponse] = None

    model_config = {"from_attributes": True}


class RecursoListResponse(BaseModel):
    id_recurso: int
    titulo: str
    autor: str
    anio: str
    ruta_portada: Optional[str]
    vistas: int
    id_categoria: Optional[int]
    categoria_nombre: Optional[str] = None

    model_config = {"from_attributes": True}


class PaginatedRecursos(BaseModel):
    items: list[RecursoListResponse]
    total: int
    page: int
    size: int
    pages: int
