import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import type { Categoria } from "@/types";
import toast from "react-hot-toast";

export default function Subir() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<Categoria[]>("categorias/")
      .then((res) => setCategorias(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      await api.post("recursos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Recurso subido exitosamente");
      form.reset();
      navigate("/recursos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Subir recurso</h1>
        <p className="text-gray-500 text-sm mb-6">
          La portada se genera automáticamente si no subes una imagen.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-5"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                name="titulo"
                required
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
              <input
                name="autor"
                required
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
              <input
                name="anio"
                required
                maxLength={4}
                placeholder="2024"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="id_categoria"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-ucips-blue outline-none"
              >
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Archivo PDF *</label>
              <input
                name="pdf_file"
                type="file"
                accept="application/pdf"
                required
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-ucips-blue file:text-white file:font-medium hover:file:bg-blue-800 file:cursor-pointer"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portada <span className="text-gray-400 font-normal">(opcional — se genera del PDF si no subes una)</span>
              </label>
              <input
                name="portada_file"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-200 file:text-gray-700 file:font-medium hover:file:bg-gray-300 file:cursor-pointer"
              />
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
    </div>
  );
}
