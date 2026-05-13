import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { firebaseResetPassword } from "@/lib/firebase";
import toast from "react-hot-toast";

const schema = z.object({ email: z.string().email("Email inválido") });
type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }: FormData) => {
    setLoading(true);
    try {
      await firebaseResetPassword(email);
      setSent(true);
    } catch {
      toast.error("Error al enviar. Verifica el correo.");
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ink">Recuperar contraseña</h1>
          <p className="text-ink-muted mt-1 text-sm">Te enviaremos un enlace de recuperación</p>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-2xl p-8 shadow-dark-lg">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-14 h-14 bg-green-500/10 border border-green-500/30 rounded-2xl mx-auto">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-ink-soft text-sm">Correo enviado. Revisa tu bandeja de entrada.</p>
              <p className="text-ink-faint text-xs">Si no lo encuentras, revisa la carpeta de spam.</p>
              <Link to="/login"
                className="block w-full text-center bg-ucips-gold text-ucips-navy py-3 rounded-xl font-bold hover:bg-ucips-gold-light transition">
                Volver al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-1.5">Correo electrónico</label>
                <input {...register("email")} type="email" autoComplete="email" placeholder="correo@ucips.edu.mx"
                  className="w-full bg-dark-elevated border border-dark-border text-ink placeholder-ink-faint px-4 py-3 rounded-xl focus:outline-none focus:border-ucips-gold/50 focus:ring-1 focus:ring-ucips-gold/30 transition" />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-ucips-gold text-ucips-navy py-3 rounded-xl font-bold hover:bg-ucips-gold-light disabled:opacity-50 transition">
                {loading ? "Enviando..." : "Enviar correo de recuperación"}
              </button>
              <p className="text-center text-sm text-ink-faint">
                <Link to="/login" className="text-ucips-gold hover:text-ucips-gold-light transition">Volver al login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
