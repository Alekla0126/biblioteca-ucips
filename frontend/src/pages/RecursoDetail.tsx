import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import api from "@/lib/api";
import type { Recurso } from "@/types";
import toast from "react-hot-toast";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function RecursoDetail() {
  const { id } = useParams<{ id: string }>();
  const [recurso, setRecurso] = useState<Recurso | null>(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(700);
  const containerRef = useRef<HTMLDivElement>(null);

  const storageKey = `ucips_page_${id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setCurrentPage(parseInt(saved));
  }, [storageKey]);

  useEffect(() => {
    if (!id) return;
    api.get<Recurso>(`/recursos/${id}`)
      .then((res) => setRecurso(res.data))
      .catch(() => toast.error("Recurso no encontrado"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(Math.min(entry.contentRect.width - 32, 900));
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
    localStorage.setItem(storageKey, String(newPage));
  };

  const pdfUrl = `${import.meta.env.VITE_API_URL}/api/v1/recursos/${id}/pdf`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ucips-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!recurso) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-600">Recurso no encontrado</p>
          <Link to="/recursos" className="mt-4 inline-block text-ucips-blue hover:underline">
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-ucips-navy px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Link to="/recursos" className="text-blue-300 hover:text-white transition flex-shrink-0">
              ← Volver
            </Link>
            <div className="min-w-0">
              <h1 className="text-white font-bold truncate">{recurso.titulo}</h1>
              <p className="text-blue-300 text-sm">{recurso.autor} · {recurso.anio}</p>
            </div>
          </div>
          <div className="text-blue-300 text-sm flex-shrink-0">
            👁 {recurso.vistas} vistas
          </div>
        </div>
      </div>

      {/* PDF Controls */}
      <div className="bg-gray-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <button
            onClick={() => changePage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40 hover:bg-gray-600 transition"
          >
            ‹ Anterior
          </button>
          <span className="text-white text-sm">
            Página {currentPage} de {numPages || "..."}
          </span>
          <button
            onClick={() => changePage(Math.min(numPages, currentPage + 1))}
            disabled={currentPage >= numPages}
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40 hover:bg-gray-600 transition"
          >
            Siguiente ›
          </button>
          <a
            href={pdfUrl}
            download
            className="ml-4 px-3 py-1 bg-ucips-gold text-ucips-navy rounded text-sm font-semibold hover:bg-yellow-400 transition"
          >
            ⬇ Descargar
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div ref={containerRef} className="max-w-5xl mx-auto px-4 py-6 flex justify-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={() => toast.error("Error al cargar el PDF")}
          loading={
            <div className="flex items-center justify-center h-96">
              <div className="w-10 h-10 border-4 border-ucips-gold border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            width={containerWidth}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* Info */}
      {recurso.descripcion && (
        <div className="max-w-5xl mx-auto px-4 pb-10">
          <div className="bg-ucips-navy rounded-xl p-6">
            <h2 className="text-white font-bold mb-2">Descripción</h2>
            <p className="text-blue-200 text-sm leading-relaxed">{recurso.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
