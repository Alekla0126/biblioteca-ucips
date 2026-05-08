import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import type { Categoria, RecursoListItem } from "@/types";
import toast from "react-hot-toast";

const ICONS: Record<string, string> = {
  "fa-shield-halved": "🛡️",
  "fa-gavel": "⚖️",
  "fa-book": "📚",
  "fa-lock": "🔒",
  "fa-users": "👥",
  "fa-briefcase": "💼",
  "fa-gun": "🔫",
  "fa-car": "🚗",
  "fa-hospital": "🏥",
  "fa-landmark": "🏛️",
};

function iconEmoji(icono: string): string {
  return ICONS[icono] ?? "📖";
}

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [recientes, setRecientes] = useState<RecursoListItem[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, recRes] = await Promise.all([
          api.get<Categoria[]>("/categorias/"),
          api.get<RecursoListItem[]>("/recursos/recientes?limit=8"),
        ]);
        setCategorias(Array.isArray(catsRes.data) ? catsRes.data : []);
        setRecientes(Array.isArray(recRes.data) ? recRes.data : []);
      } catch {
        toast.error("Error al cargar los datos");
      } finally {
        setLoadingCats(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-ucips-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Biblioteca Virtual <span className="text-ucips-gold">UCIPS</span>
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Accede a más de {Array.isArray(categorias) ? categorias.reduce((s, c) => s + c.total_recursos, 0) : 0} recursos académicos en ciencias policiales y seguridad
          </p>
          <Link
            to="/recursos"
            className="inline-block bg-ucips-gold text-ucips-navy px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition"
          >
            Explorar recursos
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ucips-blue py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
          <div>
            <p className="text-3xl font-bold text-ucips-gold">{Array.isArray(categorias) ? categorias.reduce((s, c) => s + c.total_recursos, 0) : 0}</p>
            <p className="text-sm text-blue-200">Recursos</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-ucips-gold">{categorias.length}</p>
            <p className="text-sm text-blue-200">Categorías</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-ucips-gold">100%</p>
            <p className="text-sm text-blue-200">Gratuito</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-ucips-gold">24/7</p>
            <p className="text-sm text-blue-200">Disponible</p>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categorías</h2>
        {loadingCats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.id_categoria}
                to={`/recursos?categoria=${cat.id_categoria}`}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="text-3xl mb-2">{iconEmoji(cat.icono)}</div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-ucips-blue leading-tight">
                  {cat.nombre}
                </p>
                <p className="text-xs text-gray-400 mt-1">{cat.total_recursos} recursos</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recientes */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregados recientemente</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recientes.map((r) => (
            <Link
              key={r.id_recurso}
              to={`/recursos/${r.id_recurso}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="h-40 bg-ucips-navy flex items-center justify-center overflow-hidden">
                {r.ruta_portada ? (
                  <img
                    src={`/uploads/portadas/${r.ruta_portada}`}
                    alt={r.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-5xl">📖</span>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-800 line-clamp-2">{r.titulo}</p>
                <p className="text-xs text-gray-500 mt-1">{r.autor}</p>
                <p className="text-xs text-gray-400">{r.anio}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
