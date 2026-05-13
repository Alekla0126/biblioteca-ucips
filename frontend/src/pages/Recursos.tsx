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

  useEffect(() => { fetchRecursos(); }, [fetchRecursos]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
    setSearchParams({ q: input, page: "1" });
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Search header */}
      <div className="bg-dark-surface border-b border-dark-border py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-ink mb-5 text-center">Explorar la biblioteca</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                name="q"
                defaultValue={q}
                type="search"
                placeholder="Buscar por título o autor..."
                className="w-full bg-dark-elevated border border-dark-border text-ink placeholder-ink-faint pl-10 pr-4 py-3 rounded-xl outline-none focus:border-ucips-gold/50 focus:ring-1 focus:ring-ucips-gold/30 transition"
              />
            </div>
            <button type="submit"
              className="bg-ucips-gold text-ucips-navy px-6 py-3 rounded-xl font-semibold hover:bg-ucips-gold-light transition">
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-dark-surface animate-pulse h-64 rounded-xl border border-dark-border" />
            ))}
          </div>
        ) : !data?.items?.length ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-ink-muted text-lg">No se encontraron recursos</p>
            {q && <p className="text-ink-faint text-sm mt-1">para "{q}"</p>}
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-faint mb-5">{data.total} resultado{data.total !== 1 ? "s" : ""}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.items.map((r: RecursoListItem) => <ResourceCard key={r.id_recurso} recurso={r} />)}
            </div>

            {data.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12 flex-wrap">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button key={p}
                    onClick={() => setSearchParams({ q, categoria: categoriaId, page: String(p) })}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      p === page
                        ? "bg-ucips-gold text-ucips-navy font-bold"
                        : "bg-dark-surface border border-dark-border text-ink-muted hover:border-ucips-gold/40 hover:text-ink"
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
