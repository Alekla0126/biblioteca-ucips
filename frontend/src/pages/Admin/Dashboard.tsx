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
  admin: "bg-purple-100 text-purple-700",
  profesor: "bg-blue-100 text-blue-700",
  user: "bg-gray-100 text-gray-600",
};

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("recursos");
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<AppUser[]>([]);
  const [generatingThumbs, setGeneratingThumbs] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/", { replace: true });
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    fetchRecursos();
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (tab === "usuarios" && usuarios.length === 0) fetchUsuarios();
  }, [tab]);

  const fetchRecursos = async () => {
    try {
      const res = await api.get<{ items: Recurso[] }>("recursos/?size=100");
      setRecursos(Array.isArray(res.data?.items) ? res.data.items : []);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-ucips-navy py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-blue-300 text-sm">Biblioteca Virtual UCIPS</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {(["recursos", "categorias", "usuarios"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition capitalize ${
                tab === t
                  ? "border-ucips-blue text-ucips-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recursos Tab */}
        {tab === "recursos" && (
          <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-lg font-bold text-gray-800">Recursos ({recursos.length})</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateThumbnails}
                  disabled={generatingThumbs}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
                >
                  {generatingThumbs ? "Generando..." : "🖼 Generar portadas"}
                </button>
                <a
                  href="/subir"
                  className="bg-ucips-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
                >
                  + Subir nuevo
                </a>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Título</th>
                      <th className="px-4 py-3 text-left">Autor</th>
                      <th className="px-4 py-3 text-left">Año</th>
                      <th className="px-4 py-3 text-left">Vistas</th>
                      <th className="px-4 py-3 text-left">Portada</th>
                      <th className="px-4 py-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recursos.map((r) => (
                      <tr key={r.id_recurso} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">{r.id_recurso}</td>
                        <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{r.titulo}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.autor}</td>
                        <td className="px-4 py-3 text-gray-600">{r.anio}</td>
                        <td className="px-4 py-3 text-gray-600">{r.vistas}</td>
                        <td className="px-4 py-3">
                          {r.ruta_portada ? (
                            <img
                              src={`/uploads/portadas/${r.ruta_portada}`}
                              className="w-8 h-10 object-cover rounded"
                              alt=""
                            />
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteRecurso(r.id_recurso)}
                            className="text-red-600 hover:text-red-800 font-medium text-xs"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categorias Tab */}
        {tab === "categorias" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Nueva categoría</h2>
              <form onSubmit={handleCreateCategoria} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input name="nombre" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icono (clase Font Awesome)</label>
                  <input name="icono" placeholder="fa-book" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none" />
                </div>
                <button type="submit" className="w-full bg-ucips-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition">
                  Crear categoría
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Categorías ({categorias.length})</h2>
              <div className="bg-white rounded-xl shadow-sm divide-y">
                {categorias.map((c) => (
                  <div key={c.id_categoria} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{c.nombre}</p>
                      <p className="text-xs text-gray-400">{c.total_recursos} recursos · {c.icono}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategoria(c.id_categoria)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
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
            <h2 className="text-lg font-bold text-gray-800 mb-4">Usuarios ({usuarios.length})</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Nombre</th>
                      <th className="px-4 py-3 text-left">Correo</th>
                      <th className="px-4 py-3 text-left">Rol</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                      <th className="px-4 py-3 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usuarios.map((u) => (
                      <tr key={u.uid} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {u.display_name ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                            {ROLE_LABELS[u.role]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {u.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.role !== "admin" && (
                            <div className="flex gap-2">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 outline-none"
                              >
                                <option value="user">Usuario</option>
                                <option value="profesor">Profesor</option>
                              </select>
                              <button
                                onClick={() => handleToggleActive(u.uid, u.is_active)}
                                className={`text-xs font-medium ${u.is_active ? "text-red-500 hover:text-red-700" : "text-green-600 hover:text-green-800"}`}
                              >
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
