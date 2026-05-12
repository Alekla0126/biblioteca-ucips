import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { updateFirebaseProfile } from "@/lib/firebase";
import api from "@/lib/api";
import type { AppUser } from "@/types";
import toast from "react-hot-toast";

const schema = z.object({ display_name: z.string().min(2, "Mínimo 2 caracteres").max(80) });
type FormData = z.infer<typeof schema>;

const ROLE_LABELS: Record<string, string> = { admin: "Administrador", profesor: "Profesor", user: "Usuario" };
const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  profesor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  user: "bg-slate-700/50 text-slate-400 border border-slate-600/30",
};

export default function Perfil() {
  const { appUser, firebaseUser } = useAuth();
  const { setAppUser } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { display_name: appUser?.display_name ?? "" },
  });

  const onSubmit = async ({ display_name }: FormData) => {
    if (!firebaseUser) return;
    setSaving(true);
    try {
      await updateFirebaseProfile(firebaseUser, display_name);
      const res = await api.patch<AppUser>("auth/me", { display_name });
      setAppUser(res.data);
      toast.success("Perfil actualizado");
    } catch {
      toast.error("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (!appUser) return null;

  return (
    <div className="min-h-screen bg-dark">
      <div className="bg-dark-surface border-b border-dark-border py-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to="/" className="text-slate-500 hover:text-slate-300 transition text-sm">← Inicio</Link>
          <span className="text-dark-border">/</span>
          <h1 className="text-lg font-bold text-white">Mi perfil</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Avatar card */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-ucips-gold/10 border border-ucips-gold/30 rounded-2xl flex items-center justify-center text-ucips-gold font-bold text-2xl flex-shrink-0">
            {appUser.display_name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-white truncate">{appUser.display_name ?? "Sin nombre"}</p>
            <p className="text-slate-400 text-sm truncate">{appUser.email}</p>
            <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[appUser.role]}`}>
              {ROLE_LABELS[appUser.role]}
            </span>
          </div>
        </div>

        {/* Edit */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Editar información</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre completo</label>
              <input {...register("display_name")}
                className="w-full bg-dark-elevated border border-dark-border text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:border-ucips-gold/50 focus:ring-1 focus:ring-ucips-gold/30 transition" />
              {errors.display_name && <p className="mt-1.5 text-xs text-red-400">{errors.display_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Correo electrónico</label>
              <input value={appUser.email} readOnly
                className="w-full bg-dark-elevated/50 border border-dark-border text-slate-500 px-4 py-3 rounded-xl cursor-not-allowed" />
            </div>
            <button type="submit" disabled={saving || !isDirty}
              className="w-full bg-ucips-gold text-ucips-navy py-3 rounded-xl font-bold hover:bg-ucips-gold-light disabled:opacity-40 disabled:cursor-not-allowed transition">
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>

        {/* Quick actions */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(appUser.role === "admin" || appUser.role === "profesor") && (
              <Link to="/subir"
                className="flex items-center gap-3 p-4 bg-dark-elevated border border-dark-border rounded-xl hover:border-ucips-gold/40 hover:bg-dark-hover transition group">
                <div className="w-9 h-9 bg-ucips-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-ucips-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-200 text-sm group-hover:text-white">Subir libro</p>
                  <p className="text-xs text-slate-500">Agregar recurso nuevo</p>
                </div>
              </Link>
            )}
            {appUser.role === "admin" && (
              <Link to="/admin"
                className="flex items-center gap-3 p-4 bg-dark-elevated border border-dark-border rounded-xl hover:border-purple-500/40 hover:bg-dark-hover transition group">
                <div className="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-200 text-sm group-hover:text-white">Aprobar profesores</p>
                  <p className="text-xs text-slate-500">Panel de administración</p>
                </div>
              </Link>
            )}
            <Link to="/recursos"
              className="flex items-center gap-3 p-4 bg-dark-elevated border border-dark-border rounded-xl hover:border-dark-hover hover:bg-dark-hover transition group">
              <div className="w-9 h-9 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-sm group-hover:text-white">Ver biblioteca</p>
                <p className="text-xs text-slate-500">Explorar recursos</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">Información de la cuenta</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-slate-500">Estado</dt>
              <dd className={`font-medium text-xs px-2.5 py-1 rounded-full ${appUser.is_active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {appUser.is_active ? "Activa" : "Suspendida"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Miembro desde</dt>
              <dd className="text-slate-300 font-medium">
                {new Date(appUser.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
              </dd>
            </div>
            {appUser.role === "user" && (
              <div className="mt-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-400">
                  Para subir libros, solicita a un administrador que cambie tu rol a <strong>Profesor</strong>.
                </p>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
