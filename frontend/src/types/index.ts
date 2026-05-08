export interface Categoria {
  id_categoria: number;
  nombre: string;
  icono: string;
  total_recursos: number;
}

export interface Recurso {
  id_recurso: number;
  titulo: string;
  autor: string;
  anio: string;
  descripcion?: string;
  ruta_pdf: string;
  ruta_portada?: string;
  vistas: number;
  fecha_agregado: string;
  id_categoria?: number;
  categoria?: Categoria;
}

export interface RecursoListItem {
  id_recurso: number;
  titulo: string;
  autor: string;
  anio: string;
  ruta_portada?: string;
  vistas: number;
  id_categoria?: number;
  categoria_nombre?: string;
}

export interface PaginatedRecursos {
  items: RecursoListItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AppUser {
  uid: string;
  email: string;
  display_name?: string;
  role: "admin" | "profesor" | "user";
  is_active: boolean;
  created_at: string;
}
