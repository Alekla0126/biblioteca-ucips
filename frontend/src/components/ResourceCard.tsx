import { Link } from "react-router-dom";
import type { RecursoListItem } from "@/types";

const CATEGORY_COLORS: Record<number, string> = {};
const PALETTE = [
  "from-blue-800 to-blue-600",
  "from-indigo-800 to-indigo-600",
  "from-teal-700 to-teal-500",
  "from-emerald-800 to-emerald-600",
  "from-violet-800 to-violet-600",
  "from-slate-700 to-slate-500",
  "from-cyan-800 to-cyan-600",
  "from-sky-800 to-sky-600",
];

function gradientFor(id: number | undefined): string {
  if (!id) return PALETTE[0];
  if (!CATEGORY_COLORS[id]) {
    CATEGORY_COLORS[id] = PALETTE[id % PALETTE.length];
  }
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
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group ${className}`}
    >
      <div className="h-44 overflow-hidden relative">
        {r.ruta_portada ? (
          <img
            src={`/uploads/portadas/${r.ruta_portada}`}
            alt={r.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientFor(r.id_categoria)} flex flex-col items-center justify-center p-4 gap-2`}>
            <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-white/80 text-xs font-medium text-center leading-tight line-clamp-2">{r.titulo}</p>
          </div>
        )}
        {r.categoria_nombre && (
          <span className="absolute top-2 left-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            {r.categoria_nombre}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-gray-800 line-clamp-2 leading-snug">{r.titulo}</p>
        <p className="text-xs text-gray-500 mt-1 truncate">{r.autor}</p>
        <p className="text-xs text-gray-400">{r.anio}</p>
      </div>
    </Link>
  );
}
