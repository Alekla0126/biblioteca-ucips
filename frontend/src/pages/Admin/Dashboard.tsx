import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import type { Recurso, Categoria } from "@/types";
import toast from "react-hot-toast";

type Tab = "recursos" | "categorias" | "upload";

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("recursos");
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/", { replace: true });
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    fetchRecursos();
    fetchCategorias();
  }, []);

  const fetchRecursos = async () => {
    try {
      const res = await api.get<{ items: Recurso[] }>("/recursos/?size=100");
      setRecursos(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch {
      toast.error("Error al cargar recursos");
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get<Categoria[]>("/categorias/");
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Error al cargar categorías");
    }
  };

  const handleDeleteRecurso = async (id: number) => {
    if (!confirm("¿Eliminar este recurso permanentemente?")) return;
    try {
      await api.delete(`/recursos/${id}`);
      setRecursos((prev) => prev.filter((r) => r.id_recurso !== id));
      toast.success("Recurso eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.delete(`/categorias/${id}`);
      setCategorias((prev) => prev.filter((c) => c.id_categoria !== id));
      toast.success("Categoría eliminada");
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await api.post("/recursos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Recurso subido exitosamente");
      form.reset();
      fetchRecursos();
      setTab("recursos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCategoria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await api.post<Categoria>("/categorias/", data);
      setCategorias((prev) => [...prev, res.data]);
      toast.success("Categoría creada");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear categoría");
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
          {(["recursos", "categorias", "upload"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition capitalize ${
                tab === t
                  ? "border-ucips-blue text-ucips-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "upload" ? "Subir recurso" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recursos Tab */}
        {tab === "recursos" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recursos ({recursos.length})</h2>
              <button
                onClick={() => setTab("upload")}
                className="bg-ucips-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
              >
                + Subir nuevo
              </button>
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

        {/* Upload Tab */}
        {tab === "upload" && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Subir nuevo recurso</h2>
            <form onSubmit={handleUpload} className="bg-white rounded-xl shadow-sm p-6 space-y-4" encType="multipart/form-data">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input name="titulo" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
                  <input name="autor" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
                  <input name="anio" required maxLength={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea name="descripcion" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select name="id_categoria" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none">
                    <option value="">Sin categoría</option>
                    {categorias.map((c) => (
                      <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Archivo PDF *</label>
                  <input name="pdf_file" type="file" accept="application/pdf" required className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ucips-blue file:text-white file:font-medium hover:file:bg-blue-800 file:cursor-pointer" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portada (imagen)</label>
                  <input name="portada_file" type="file" accept="image/png,image/jpeg,image/webp" className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 file:text-gray-700 file:font-medium hover:file:bg-gray-300 file:cursor-pointer" />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ucips-blue text-white py-3 rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50 transition"
              >
                {submitting ? "Subiendo..." : "Subir recurso"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
