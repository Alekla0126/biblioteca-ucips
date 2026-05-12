from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Recurso(Base):
    __tablename__ = "recursos"

    id_recurso = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(255), nullable=False, index=True)
    autor = Column(String(255), nullable=False)
    anio = Column(String(4), nullable=False)
    descripcion = Column(Text, nullable=True)
    ruta_pdf = Column(String(255), nullable=True)
    ruta_portada = Column(String(255), nullable=True)
    id_categoria = Column(Integer, ForeignKey("categorias.id_categoria", ondelete="SET NULL"), nullable=True)
    vistas = Column(Integer, default=0, nullable=False)
    fecha_agregado = Column(DateTime(timezone=True), server_default=func.now())

    categoria = relationship("Categoria", back_populates="recursos")
