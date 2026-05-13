import { useState } from "react";
import { Link } from "react-router-dom";
import type { RecursoListItem } from "@/types";

/* Portadas genéricas — paleta UCIPS Gama Cromática Autorizada */
const COVERS = [
  { from: "#1a1535", to: "#242236" },  // Pantone 276 C navy
  { from: "#5f1b2d", to: "#861e34" },  // borgoña → carmesí
  { from: "#0c312d", to: "#246257" },  // teal oscuro → teal
  { from: "#861e34", to: "#af1731" },  // carmesí → carmesí vivo
  { from: "#0c312d", to: "#3d9b84" },  // teal oscuro → teal claro
  { from: "#242236", to: "#5f1b2d" },  // navy → borgoña
  { from: "#246257", to: "#3d9b84" },  // teal → teal claro
  { from: "#2e2c40", to: "#484747" },  // navy suave → charcoal
];

function coverFor(id: number | undefined) {
  return COVERS[(id ?? 0) % COVERS.length];
}

interface Props {
  recurso: RecursoListItem;
  className?: string;
}

export default function ResourceCard({ recurso: r, className = "" }: Props) {
  const cover = coverFor(r.id_categoria);
  const [imgFailed, setImgFailed] = useState(false);
  const showPlaceholder = !r.ruta_portada || imgFailed;

  return (
    <Link
      to={`/recursos/${r.id_recurso}`}
      className={`bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-ucips-gold/40 hover:-translate-y-1 hover:shadow-dark-md transition-all duration-200 group ${className}`}
    >
      <div className="h-48 overflow-hidden relative">
        {!showPlaceholder ? (
          <img
            src={`/uploads/portadas/${r.ruta_portada}`}
            alt={r.titulo}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col relative overflow-hidden"
            style={{ background: `linear-gradient(145deg, ${cover.from}, ${cover.to})` }}
          >
            {/* Book spine */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/30" />
            {/* Subtle texture */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(255,255,255,1) 18px,rgba(255,255,255,1) 19px)" }} />
            {/* Content */}
            <div className="relative flex-1 flex flex-col items-center justify-center px-5 py-3 gap-1">
              <span className="text-6xl font-black text-white/15 leading-none select-none -mb-1">
                {r.titulo[0]?.toUpperCase() ?? "?"}
              </span>
              <p className="text-white text-[13px] font-bold text-center leading-snug line-clamp-4 drop-shadow">
                {r.titulo}
              </p>
              {r.autor && (
                <p className="text-white/75 text-[11px] text-center truncate max-w-full mt-0.5">
                  {r.autor}
                </p>
              )}
            </div>
            {/* Footer bar */}
            <div className="h-5 bg-black/25 flex items-center justify-center gap-1.5 flex-shrink-0">
              <span className="w-6 h-px bg-white/30" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-6 h-px bg-white/30" />
            </div>
          </div>
        )}
        {r.categoria_nombre && (
          <span className="absolute top-2 left-3 bg-black/60 text-ucips-gold text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm border border-ucips-gold/20">
            {r.categoria_nombre}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-ink line-clamp-2 leading-snug group-hover:text-ucips-gold transition-colors">{r.titulo}</p>
        <p className="text-xs text-ink-muted mt-1 truncate">{r.autor}</p>
        {r.anio && <p className="text-xs text-ink-faint">{r.anio}</p>}
      </div>
    </Link>
  );
}
