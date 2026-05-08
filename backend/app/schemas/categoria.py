from pydantic import BaseModel, field_validator
import re


class CategoriaBase(BaseModel):
    nombre: str
    icono: str

    @field_validator("nombre")
    @classmethod
    def nombre_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("El nombre no puede estar vacío")
        if len(v) > 100:
            raise ValueError("El nombre no puede superar 100 caracteres")
        return v

    @field_validator("icono")
    @classmethod
    def icono_valid(cls, v: str) -> str:
        v = v.strip()
        if not re.match(r'^fa-[a-z0-9-]+$', v):
            raise ValueError("Icono debe ser una clase Font Awesome válida (ej: fa-book)")
        return v


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: str | None = None
    icono: str | None = None


class CategoriaResponse(CategoriaBase):
    id_categoria: int
    total_recursos: int = 0

    model_config = {"from_attributes": True}
