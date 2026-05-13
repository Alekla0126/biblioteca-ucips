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

      {/* ── Hero — navy institucional Pantone 276 C ── */}
      <section className="relative overflow-hidden py-24 px-4" style={{ backgroundColor: "#242236" }}>
        {/* Gradientes institucionales: dorado + carmesí */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage:
            "radial-gradient(ellipse at 15% 60%, #5f1b2d 0%, transparent 45%)," +
            "radial-gradient(ellipse at 85% 20%, #e79b4233 0%, transparent 45%)," +
            "radial-gradient(ellipse at 50% 100%, #0c312d55 0%, transparent 50%)",
        }} />

        {/* Línea de acento carmesí en la parte inferior del hero */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #5f1b2d, #e79b42, #246257)" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-ucips-gold/30 px-4 py-1.5 rounded-full text-sm mb-6" style={{ color: "#e2be96" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#e79b42" }} />
            {totalRecursos} recursos disponibles
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight text-white">
            Biblioteca Virtual<br />
            <span className="text-ucips-gold">UCIPS</span>
          </h1>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#e2be96" }}>
            Recursos académicos en ciencias policiales, seguridad pública y derecho — acceso libre las 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/recursos"
              className="bg-ucips-gold text-ucips-navy px-8 py-3.5 rounded-xl font-bold text-base hover:bg-ucips-gold-light transition shadow-gold">
              Explorar recursos
            </Link>
            <Link to="/register"
              className="bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-xl font-medium text-base hover:bg-white/20 transition">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar — carmesí institucional ── */}
      <section style={{ backgroundColor: "#861e34" }}>
        <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: totalRecursos, label: "Recursos" },
            { val: categorias.length, label: "Categorías" },
            { val: "100%", label: "Gratuito" },
            { val: "24/7", label: "Disponible" },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-ucips-gold">{val}</p>
              <p className="text-xs mt-0.5" style={{ color: "#e2be96" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categorías ── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-ucips-gold" />
          <h2 className="text-xl font-bold text-ink">Explorar por categoría</h2>
        </div>
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
                className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center hover:border-ucips-gold/50 hover:bg-dark-hover hover:-translate-y-1 transition-all group">
                <div className="text-2xl mb-2">{iconEmoji(cat.icono)}</div>
                <p className="text-xs font-semibold text-ink-soft group-hover:text-ucips-gold leading-tight transition-colors">
                  {cat.nombre}
                </p>
                <p className="text-[11px] text-ink-faint mt-1">{cat.total_recursos}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Recientes ── */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "#861e34" }} />
            <h2 className="text-xl font-bold text-ink">Agregados recientemente</h2>
          </div>
          <Link to="/recursos" className="text-sm text-ucips-gold hover:text-ucips-gold-light transition font-medium">
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
