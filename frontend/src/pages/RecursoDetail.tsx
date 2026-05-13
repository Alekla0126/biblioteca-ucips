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
  const [numPages, setNumPages] = useState(0);
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
    api.get<Recurso>(`recursos/${id}`)
      .then((res) => setRecurso(res.data))
      .catch(() => toast.error("Recurso no encontrado"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(Math.min(entry.contentRect.width - 32, 900));
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const changePage = (p: number) => {
    setCurrentPage(p);
    localStorage.setItem(storageKey, String(p));
  };

  const hasPdf = !!recurso?.ruta_pdf;
  const pdfUrl = `/api/v1/recursos/${id}/pdf`;

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-ucips-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!recurso) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-ink-muted">Recurso no encontrado</p>
          <Link to="/recursos" className="mt-4 inline-block text-ucips-gold hover:text-ucips-gold-light text-sm transition">
            ← Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-border px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Link to="/recursos" className="text-ink-faint hover:text-ink-soft transition text-sm flex-shrink-0">← Volver</Link>
            <div className="min-w-0">
              <h1 className="text-ink font-bold truncate">{recurso.titulo}</h1>
              <p className="text-ink-muted text-sm">{recurso.autor}{recurso.anio ? ` · ${recurso.anio}` : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-ink-faint text-sm flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {recurso.vistas}
          </div>
        </div>
      </div>

      {/* PDF Controls */}
      {hasPdf && (
        <div className="bg-dark-elevated border-b border-dark-border py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => changePage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1}
              className="px-3 py-1.5 bg-dark-surface border border-dark-border text-ink-soft rounded-lg disabled:opacity-30 hover:border-dark-hover transition text-sm">
              ‹ Anterior
            </button>
            <span className="text-ink-muted text-sm">Pág. {currentPage} / {numPages || "…"}</span>
            <button onClick={() => changePage(Math.min(numPages, currentPage + 1))} disabled={currentPage >= numPages}
              className="px-3 py-1.5 bg-dark-surface border border-dark-border text-ink-soft rounded-lg disabled:opacity-30 hover:border-dark-hover transition text-sm">
              Siguiente ›
            </button>
            <a href={pdfUrl} download
              className="ml-2 px-3 py-1.5 bg-ucips-gold text-ucips-navy rounded-lg text-sm font-semibold hover:bg-ucips-gold-light transition">
              ↓ Descargar
            </a>
          </div>
        </div>
      )}

      {/* Viewer */}
      <div ref={containerRef} className="max-w-5xl mx-auto px-4 py-6 flex justify-center">
        {hasPdf ? (
          <Document file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => toast.error("Error al cargar el PDF")}
            loading={
              <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-2 border-ucips-gold border-t-transparent rounded-full animate-spin" />
              </div>
            }>
            <Page pageNumber={currentPage} width={containerWidth} renderTextLayer renderAnnotationLayer />
          </Document>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-dark-surface border border-dark-border rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-ink-soft font-medium">PDF no disponible</p>
            <p className="text-ink-faint text-sm mt-1">Este documento aún no ha sido cargado.</p>
          </div>
        )}
      </div>

      {recurso.descripcion && (
        <div className="max-w-5xl mx-auto px-4 pb-10">
          <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
            <h2 className="text-ink font-bold mb-2 text-sm">Descripción</h2>
            <p className="text-ink-muted text-sm leading-relaxed">{recurso.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
