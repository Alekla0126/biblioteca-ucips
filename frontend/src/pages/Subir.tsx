import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import type { Categoria } from "@/types";
import toast from "react-hot-toast";

export default function Subir() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [portadaName, setPortadaName] = useState("");

  useEffect(() => {
    api.get<Categoria[]>("categorias/")
      .then((res) => setCategorias(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("recursos/", new FormData(e.currentTarget), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Recurso subido exitosamente");
      navigate("/recursos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";
  const inputClass = "w-full bg-dark-elevated border border-dark-border text-slate-100 placeholder-slate-600 px-4 py-3 rounded-xl focus:outline-none focus:border-ucips-gold/50 focus:ring-1 focus:ring-ucips-gold/30 transition";

  return (
    <div className="min-h-screen bg-dark py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Subir recurso</h1>
          <p className="text-slate-400 text-sm mt-1">
            La portada se genera automáticamente del PDF si no subes una imagen.
          </p>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data"
          className="bg-dark-surface border border-dark-border rounded-2xl p-6 space-y-5 shadow-dark-md">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Título *</label>
              <input name="titulo" required placeholder="Título del libro" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Autor *</label>
              <input name="autor" required placeholder="Nombre del autor" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Año *</label>
              <input name="anio" required maxLength={4} placeholder="2024" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Descripción <span className="text-slate-500 font-normal">(opcional)</span></label>
              <textarea name="descripcion" rows={3} placeholder="Breve descripción del contenido..."
                className={`${inputClass} resize-none`} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Categoría</label>
              <select name="id_categoria" className={`${inputClass} cursor-pointer`}>
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PDF upload */}
          <div>
            <label className={labelClass}>Archivo PDF *</label>
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-dark-border rounded-xl cursor-pointer hover:border-ucips-gold/40 hover:bg-dark-elevated transition group">
              <input name="pdf_file" type="file" accept="application/pdf" required className="hidden"
                onChange={(e) => setPdfName(e.target.files?.[0]?.name ?? "")} />
              {pdfName ? (
                <div className="text-center">
                  <svg className="w-6 h-6 text-ucips-gold mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-ucips-gold font-medium truncate max-w-xs">{pdfName}</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-6 h-6 text-slate-500 mx-auto mb-1 group-hover:text-ucips-gold transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm text-slate-500 group-hover:text-slate-300 transition">Haz clic para seleccionar el PDF</p>
                </div>
              )}
            </label>
          </div>

          {/* Cover upload */}
          <div>
            <label className={labelClass}>
              Portada <span className="text-slate-500 font-normal">(opcional — se genera del PDF automáticamente)</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-dark-border rounded-xl cursor-pointer hover:border-ucips-gold/40 hover:bg-dark-elevated transition group">
              <input name="portada_file" type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                onChange={(e) => setPortadaName(e.target.files?.[0]?.name ?? "")} />
              {portadaName ? (
                <p className="text-sm text-ucips-gold font-medium">{portadaName}</p>
              ) : (
                <p className="text-sm text-slate-600 group-hover:text-slate-400 transition">Imagen de portada (JPG, PNG, WebP)</p>
              )}
            </label>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-ucips-gold text-ucips-navy py-3.5 rounded-xl font-bold hover:bg-ucips-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition shadow-gold text-base">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Subiendo...
              </span>
            ) : "Subir recurso"}
          </button>
        </form>
      </div>
    </div>
  );
}
