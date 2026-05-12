import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import type { Categoria, RecursoListItem } from "@/types";
import ResourceCard from "@/components/ResourceCard";
import toast from "react-hot-toast";

const ICONS: Record<string, string> = {
  "fa-shield-halved": "🛡️", "fa-gavel": "⚖️", "fa-book": "📚",
  "fa-lock": "🔒", "fa-users": "👥", "fa-briefcase": "💼",
  "fa-gun": "🔫", "fa-car": "🚗", "fa-hospital": "🏥", "fa-landmark": "🏛️",
};
const iconEmoji = (icono: string) => ICONS[icono] ?? "📖";

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [recientes, setRecientes] = useState<RecursoListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Categoria[]>("categorias/"),
      api.get<RecursoListItem[]>("recursos/recientes?limit=8"),
    ]).then(([catsRes, recRes]) => {
      setCategorias(Array.isArray(catsRes.data) ? catsRes.data : []);
      setRecientes(Array.isArray(recRes.data) ? recRes.data : []);
    }).catch(() => toast.error("Error al cargar los datos"))
      .finally(() => setLoading(false));
  }, []);

  const totalRecursos = categorias.reduce((s, c) => s + c.total_recursos, 0);

  return (
    <div className="min-h-screen bg-dark">

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-ucips-navy via-dark to-dark" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #1a4a7a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c9a84c22 0%, transparent 40%)" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-dark-elevated border border-dark-border px-4 py-1.5 rounded-full text-sm text-slate-400 mb-6">
            <span className="w-2 h-2 bg-ucips-gold rounded-full animate-pulse" />
            {totalRecursos} recursos disponibles
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
            Biblioteca Virtual<br />
            <span className="text-ucips-gold">UCIPS</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Recursos académicos en ciencias policiales, seguridad pública y derecho — acceso libre las 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/recursos"
              className="bg-ucips-gold text-ucips-navy px-8 py-3.5 rounded-xl font-bold text-base hover:bg-ucips-gold-light transition shadow-gold">
              Explorar recursos
            </Link>
            <Link to="/register"
              className="bg-dark-elevated border border-dark-border text-slate-300 px-8 py-3.5 rounded-xl font-medium text-base hover:border-ucips-gold/50 hover:text-white transition">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-dark-border bg-dark-surface">
        <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: totalRecursos, label: "Recursos" },
            { val: categorias.length, label: "Categorías" },
            { val: "100%", label: "Gratuito" },
            { val: "24/7", label: "Disponible" },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-ucips-gold">{val}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-xl font-bold text-slate-200 mb-6">Explorar por categoría</h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-dark-surface animate-pulse h-24 rounded-xl border border-dark-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categorias.map((cat) => (
              <Link key={cat.id_categoria} to={`/recursos?categoria=${cat.id_categoria}`}
                className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center hover:border-ucips-gold/40 hover:bg-dark-hover hover:-translate-y-1 transition-all group">
                <div className="text-2xl mb-2">{iconEmoji(cat.icono)}</div>
                <p className="text-xs font-semibold text-slate-300 group-hover:text-ucips-gold leading-tight transition-colors">
                  {cat.nombre}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">{cat.total_recursos}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-200">Agregados recientemente</h2>
          <Link to="/recursos" className="text-sm text-ucips-gold hover:text-ucips-gold-light transition">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recientes.map((r) => <ResourceCard key={r.id_recurso} recurso={r} />)}
        </div>
      </section>
    </div>
  );
}
