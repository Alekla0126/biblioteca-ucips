import { Link } from "react-router-dom";
import type { RecursoListItem } from "@/types";

const CATEGORY_COLORS: Record<number, string> = {};
const PALETTE = [
  "from-blue-900 to-blue-700",
  "from-indigo-900 to-indigo-700",
  "from-teal-900 to-teal-700",
  "from-emerald-900 to-emerald-700",
  "from-violet-900 to-violet-700",
  "from-slate-800 to-slate-600",
  "from-cyan-900 to-cyan-700",
  "from-sky-900 to-sky-700",
];

function gradientFor(id: number | undefined): string {
  if (!id) return PALETTE[0];
  if (!CATEGORY_COLORS[id]) CATEGORY_COLORS[id] = PALETTE[id % PALETTE.length];
  return CATEGORY_COLORS[id];
}

interface Props {
  recurso: RecursoListItem;
  className?: string;
}

export default function ResourceCard({ recurso: r, className = "" }: Props) {
  return (
    <Link
      to={`/recursos/${r.id_recurso}`}
      className={`bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-ucips-gold/40 hover:-translate-y-1 hover:shadow-dark-md transition-all duration-200 group ${className}`}
    >
      <div className="h-48 overflow-hidden relative">
        {r.ruta_portada ? (
          <img
            src={`/uploads/portadas/${r.ruta_portada}`}
            alt={r.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientFor(r.id_categoria)} flex flex-col items-center justify-center p-4 gap-2`}>
            <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-white/70 text-xs font-medium text-center leading-tight line-clamp-3">{r.titulo}</p>
          </div>
        )}
        {r.categoria_nombre && (
          <span className="absolute top-2 left-2 bg-black/60 text-ucips-gold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm border border-ucips-gold/20">
            {r.categoria_nombre}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-slate-100 line-clamp-2 leading-snug group-hover:text-ucips-gold transition-colors">{r.titulo}</p>
        <p className="text-xs text-slate-400 mt-1 truncate">{r.autor}</p>
        {r.anio && <p className="text-xs text-slate-500">{r.anio}</p>}
      </div>
    </Link>
  );
}
