import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { firebaseSignIn } from "@/lib/firebase";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const from = (location.state as { from?: string })?.from ?? "/";

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }: FormData) => {
    setLoading(true);
    try {
      await firebaseSignIn(email, password);
      toast.success("Sesión iniciada");
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("configuration-not-found") || msg.includes("CONFIGURATION_NOT_FOUND")) {
        toast.error("Autenticación en configuración. Intente más tarde.");
      } else if (msg.includes("invalid-credential") || msg.includes("INVALID_LOGIN_CREDENTIALS")) {
        toast.error("Correo o contraseña incorrectos");
      } else if (msg.includes("too-many-requests")) {
        toast.error("Demasiados intentos. Espere unos minutos.");
      } else {
        toast.error("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-ucips-gold/10 border border-ucips-gold/30 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-ucips-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ink">Biblioteca UCIPS</h1>
          <p className="text-ink-muted mt-1 text-sm">Inicia sesión para continuar</p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-dark-lg">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Correo electrónico</label>
              <input {...register("email")} type="email" autoComplete="email" placeholder="correo@ucips.edu.mx"
                className="w-full bg-dark-elevated border border-dark-border text-ink placeholder-ink-faint px-4 py-3 rounded-xl focus:outline-none focus:border-ucips-gold/50 focus:ring-1 focus:ring-ucips-gold/30 transition" />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1.5">Contraseña</label>
              <input {...register("password")} type="password" autoComplete="current-password" placeholder="••••••••"
                className="w-full bg-dark-elevated border border-dark-border text-ink placeholder-ink-faint px-4 py-3 rounded-xl focus:outline-none focus:border-ucips-gold/50 focus:ring-1 focus:ring-ucips-gold/30 transition" />
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-ucips-gold hover:text-ucips-gold-light transition">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-ucips-gold text-ucips-navy py-3 rounded-xl font-bold hover:bg-ucips-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition shadow-gold">
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-faint">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-ucips-gold hover:text-ucips-gold-light font-medium transition">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
