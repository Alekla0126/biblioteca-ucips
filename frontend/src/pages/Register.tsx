import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { firebaseSignUp, updateFirebaseProfile } from "@/lib/firebase";
import api from "@/lib/api";
import toast from "react-hot-toast";

const schema = z.object({
  displayName: z.string().min(2, "Nombre muy corto").max(80),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Las contraseñas no coinciden", path: ["confirm"] });
type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password, displayName }: FormData) => {
    setLoading(true);
    try {
      const { user } = await firebaseSignUp(email, password);
      await updateFirebaseProfile(user, displayName);
      await api.post("auth/register");
      toast.success("Cuenta creada exitosamente");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use")) toast.error("Este correo ya está registrado");
      else toast.error("Error al crear la cuenta. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-dark-elevated border border-dark-border text-slate-100 placeholder-slate-600 px-4 py-3 rounded-xl focus:outline-none focus:border-ucips-gold/50 focus:ring-1 focus:ring-ucips-gold/30 transition";

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-ucips-gold/10 border border-ucips-gold/30 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-ucips-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="text-slate-400 mt-1 text-sm">Únete a la Biblioteca UCIPS</p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-dark-lg">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {[
              { name: "displayName" as const, label: "Nombre completo", type: "text", placeholder: "Juan Pérez", autocomplete: "name" },
              { name: "email" as const, label: "Correo electrónico", type: "email", placeholder: "correo@ucips.edu.mx", autocomplete: "email" },
              { name: "password" as const, label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres", autocomplete: "new-password" },
              { name: "confirm" as const, label: "Confirmar contraseña", type: "password", placeholder: "Repite tu contraseña", autocomplete: "new-password" },
            ].map(({ name, label, type, placeholder, autocomplete }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
                <input {...register(name)} type={type} autoComplete={autocomplete} placeholder={placeholder} className={inputClass} />
                {errors[name] && <p className="mt-1.5 text-xs text-red-400">{errors[name]?.message}</p>}
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-ucips-gold text-ucips-navy py-3 rounded-xl font-bold hover:bg-ucips-gold-light disabled:opacity-50 transition shadow-gold mt-2">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-ucips-gold hover:text-ucips-gold-light font-medium transition">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
