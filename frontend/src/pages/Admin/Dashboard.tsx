import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import type { Recurso, Categoria, AppUser } from "@/types";
import toast from "react-hot-toast";

type Tab = "recursos" | "categorias" | "usuarios";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  profesor: "Profesor",
  user: "Usuario",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  profesor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  user: "bg-dark-elevated text-ink-muted border border-dark-border",
};

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("recursos");
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [recursoTotal, setRecursoTotal] = useState(0);
  const [recursoPage, setRecursoPage] = useState(1);
  const [recursoQ, setRecursoQ] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<AppUser[]>([]);
  const [generatingThumbs, setGeneratingThumbs] = useState(false);
  const PAGE_SIZE = 50;

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/", { replace: true });
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    fetchRecursos(1, "");
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (tab === "usuarios" && usuarios.length === 0) fetchUsuarios();
  }, [tab]);

  const fetchRecursos = async (page = recursoPage, q = recursoQ) => {
    try {
      const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) });
      if (q.length >= 2) params.set("q", q);
      const res = await api.get<{ items: Recurso[]; total: number }>(`recursos/?${params}`);
      setRecursos(Array.isArray(res.data?.items) ? res.data.items : []);
      setRecursoTotal(res.data?.total ?? 0);
      setRecursoPage(page);
      setRecursoQ(q);
    } catch {
      toast.error("Error al cargar recursos");
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get<Categoria[]>("categorias/");
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Error al cargar categorías");
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await api.get<AppUser[]>("auth/users");
      setUsuarios(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Error al cargar usuarios");
    }
  };

  const handleDeleteRecurso = async (id: number) => {
    if (!confirm("¿Eliminar este recurso permanentemente?")) return;
    try {
      await api.delete(`recursos/${id}`);
      setRecursos((prev) => prev.filter((r) => r.id_recurso !== id));
      toast.success("Recurso eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.delete(`categorias/${id}`);
      setCategorias((prev) => prev.filter((c) => c.id_categoria !== id));
      toast.success("Categoría eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleCreateCategoria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await api.post<Categoria>("categorias/", data);
      setCategorias((prev) => [...prev, res.data]);
      toast.success("Categoría creada");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear categoría");
    }
  };

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      const res = await api.patch<AppUser>(`auth/users/${uid}/role`, { role: newRole });
      setUsuarios((prev) => prev.map((u) => (u.uid === uid ? res.data : u)));
      toast.success("Rol actualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cambiar rol");
    }
  };

  const handleToggleActive = async (uid: string, current: boolean) => {
    try {
      const res = await api.patch<AppUser>(`auth/users/${uid}/role`, { is_active: !current });
      setUsuarios((prev) => prev.map((u) => (u.uid === uid ? res.data : u)));
      toast.success(current ? "Cuenta desactivada" : "Cuenta activada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const handleGenerateThumbnails = async () => {
    setGeneratingThumbs(true);
    try {
      const res = await api.post<{ generated: number; total_sin_portada: number }>(
        "recursos/generate-thumbnails"
      );
      toast.success(`Generadas ${res.data.generated} portadas de ${res.data.total_sin_portada} recursos sin portada`);
      fetchRecursos();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setGeneratingThumbs(false);
    }
  };

  if (loading) return null;

  const inputClass = "w-full bg-dark-elevated border border-dark-border text-ink placeholder-ink-faint px-3 py-2.5 rounded-xl focus:outline-none focus:border-ucips-gold/50 focus:ring-1 focus:ring-ucips-gold/30 transition text-sm";
  const thClass = "px-4 py-3 text-left text-xs font-semibold text-ink-faint uppercase tracking-wider";
  const tdClass = "px-4 py-3";

  return (
    <div className="min-h-screen bg-dark">
      <div className="bg-dark-surface border-b border-dark-border py-5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink">Panel de Administración</h1>
            <p className="text-ink-faint text-xs mt-0.5">Biblioteca Virtual UCIPS</p>
          </div>
          <a href="/subir" className="bg-ucips-gold text-ucips-navy px-4 py-2 rounded-xl font-semibold text-sm hover:bg-ucips-gold-light transition">
            + Subir libro
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 flex">
          {(["recursos", "categorias", "usuarios"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-4 text-sm font-medium border-b-2 transition ${
                tab === t ? "border-ucips-gold text-ucips-gold" : "border-transparent text-ink-faint hover:text-ink-soft"
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recursos Tab */}
        {tab === "recursos" && (
          <div>
            <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
              <p className="text-ink-muted text-sm">{recursoTotal} recursos en total</p>
              <div className="flex gap-2 flex-wrap">
                <input type="search" placeholder="Buscar título o autor..." defaultValue={recursoQ}
                  onKeyDown={(e) => { if (e.key === "Enter") fetchRecursos(1, (e.target as HTMLInputElement).value); }}
                  onChange={(e) => { if (!e.target.value) fetchRecursos(1, ""); }}
                  className="bg-dark-surface border border-dark-border text-ink placeholder-ink-faint px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-ucips-gold/40 w-52" />
                <button onClick={handleGenerateThumbnails} disabled={generatingThumbs}
                  className="bg-dark-surface border border-dark-border text-ink-soft px-3 py-2 rounded-lg text-sm hover:border-dark-hover disabled:opacity-40 transition">
                  {generatingThumbs ? "Generando…" : "Generar portadas"}
                </button>
              </div>
            </div>
            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-dark-border">
                    <tr>
                      <th className={thClass}>ID</th>
                      <th className={thClass}>Título</th>
                      <th className={thClass}>Autor</th>
                      <th className={thClass}>Año</th>
                      <th className={thClass}>PDF</th>
                      <th className={thClass}>Portada</th>
                      <th className={thClass}></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {recursos.map((r) => (
                      <tr key={r.id_recurso} className="hover:bg-dark-hover transition-colors">
                        <td className={`${tdClass} text-ink-faint text-xs`}>{r.id_recurso}</td>
                        <td className={`${tdClass} font-medium text-ink-soft max-w-xs truncate`}>{r.titulo}</td>
                        <td className={`${tdClass} text-ink-muted max-w-xs truncate`}>{r.autor}</td>
                        <td className={`${tdClass} text-ink-faint`}>{r.anio || "—"}</td>
                        <td className={tdClass}>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.ruta_pdf ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {r.ruta_pdf ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className={tdClass}>
                          {r.ruta_portada
                            ? <img src={`/uploads/portadas/${r.ruta_portada}`} className="w-7 h-9 object-cover rounded" alt="" />
                            : <span className="text-ink-faint text-xs">—</span>}
                        </td>
                        <td className={tdClass}>
                          <button onClick={() => handleDeleteRecurso(r.id_recurso)}
                            className="text-red-500 hover:text-red-400 text-xs font-medium transition">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {recursoTotal > PAGE_SIZE && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-ink-faint">
                  {(recursoPage - 1) * PAGE_SIZE + 1}–{Math.min(recursoPage * PAGE_SIZE, recursoTotal)} de {recursoTotal}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => fetchRecursos(recursoPage - 1)} disabled={recursoPage <= 1}
                    className="px-3 py-1.5 text-sm bg-dark-surface border border-dark-border text-ink-muted rounded-lg disabled:opacity-30 hover:border-dark-hover transition">← Anterior</button>
                  <button onClick={() => fetchRecursos(recursoPage + 1)} disabled={recursoPage * PAGE_SIZE >= recursoTotal}
                    className="px-3 py-1.5 text-sm bg-dark-surface border border-dark-border text-ink-muted rounded-lg disabled:opacity-30 hover:border-dark-hover transition">Siguiente →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categorías Tab */}
        {tab === "categorias" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-base font-bold text-ink mb-4">Nueva categoría</h2>
              <form onSubmit={handleCreateCategoria} className="bg-dark-surface border border-dark-border rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-1.5">Nombre</label>
                  <input name="nombre" required placeholder="Ej: Derecho Penal" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-1.5">Icono (Font Awesome)</label>
                  <input name="icono" placeholder="fa-book" required className={inputClass} />
                </div>
                <button type="submit" className="w-full bg-ucips-gold text-ucips-navy py-2.5 rounded-xl font-bold hover:bg-ucips-gold-light transition text-sm">
                  Crear categoría
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-base font-bold text-ink mb-4">Categorías ({categorias.length})</h2>
              <div className="bg-dark-surface border border-dark-border rounded-xl divide-y divide-dark-border overflow-hidden">
                {categorias.map((c) => (
                  <div key={c.id_categoria} className="flex items-center justify-between px-4 py-3 hover:bg-dark-hover transition-colors">
                    <div>
                      <p className="font-medium text-ink-soft text-sm">{c.nombre}</p>
                      <p className="text-xs text-ink-faint">{c.total_recursos} recursos · {c.icono}</p>
                    </div>
                    <button onClick={() => handleDeleteCategoria(c.id_categoria)}
                      className="text-red-500 hover:text-red-400 text-xs font-medium transition">
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Usuarios Tab */}
        {tab === "usuarios" && (
          <div>
            <h2 className="text-base font-bold text-ink mb-4">Usuarios ({usuarios.length})</h2>
            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-dark-border">
                    <tr>
                      <th className={thClass}>Nombre</th>
                      <th className={thClass}>Correo</th>
                      <th className={thClass}>Rol</th>
                      <th className={thClass}>Estado</th>
                      <th className={thClass}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {usuarios.map((u) => (
                      <tr key={u.uid} className="hover:bg-dark-hover transition-colors">
                        <td className={`${tdClass} font-medium text-ink-soft`}>{u.display_name ?? "—"}</td>
                        <td className={`${tdClass} text-ink-muted`}>{u.email}</td>
                        <td className={tdClass}>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                            {ROLE_LABELS[u.role]}
                          </span>
                        </td>
                        <td className={tdClass}>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.is_active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                            {u.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className={tdClass}>
                          {u.role !== "admin" && (
                            <div className="flex gap-2 items-center">
                              <select value={u.role} onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                                className="text-xs bg-dark-elevated border border-dark-border text-ink-soft rounded-lg px-2 py-1 outline-none focus:border-ucips-gold/40">
                                <option value="user">Usuario</option>
                                <option value="profesor">Profesor</option>
                              </select>
                              <button onClick={() => handleToggleActive(u.uid, u.is_active)}
                                className={`text-xs font-medium transition ${u.is_active ? "text-red-500 hover:text-red-400" : "text-green-500 hover:text-green-400"}`}>
                                {u.is_active ? "Desactivar" : "Activar"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
