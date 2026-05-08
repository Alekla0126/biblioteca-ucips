import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import type { PaginatedRecursos, RecursoListItem } from "@/types";
import ResourceCard from "@/components/ResourceCard";
import toast from "react-hot-toast";

export default function Recursos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<PaginatedRecursos | null>(null);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") ?? "";
  const categoriaId = searchParams.get("categoria") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");

  const fetchRecursos = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, size: 20 };
      if (q) params.q = q;
      if (categoriaId) params.categoria_id = parseInt(categoriaId);

      const res = await api.get<PaginatedRecursos>("recursos/", { params });
      setData(res.data);
    } catch {
      toast.error("Error al cargar recursos");
    } finally {
      setLoading(false);
    }
  }, [q, categoriaId, page]);

  useEffect(() => {
    fetchRecursos();
  }, [fetchRecursos]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("q") as HTMLInputElement;
    setSearchParams({ q: input.value, page: "1" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-ucips-navy py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Explorar recursos</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              type="search"
              placeholder="Buscar por título o autor..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-ucips-gold"
            />
            <button
              type="submit"
              className="bg-ucips-gold text-ucips-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-xl" />
            ))}
          </div>
        ) : !data || !data.items || data.items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-500 text-lg">No se encontraron recursos</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{data.total} resultados</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.items.map((r: RecursoListItem) => (
                <ResourceCard key={r.id_recurso} recurso={r} />
              ))}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setSearchParams({ q, categoria: categoriaId, page: String(p) })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      p === page
                        ? "bg-ucips-blue text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
