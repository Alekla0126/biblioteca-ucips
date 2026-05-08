import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { firebaseResetPassword } from "@/lib/firebase";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }: FormData) => {
    setLoading(true);
    try {
      await firebaseResetPassword(email);
      setSent(true);
      toast.success("Correo de recuperación enviado");
    } catch {
      toast.error("Error al enviar el correo. Verifica el email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ucips-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ucips-gold rounded-full mb-4">
            <svg className="w-8 h-8 text-ucips-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Recuperar contraseña</h1>
          <p className="text-blue-300 mt-1">Te enviaremos un enlace de recuperación</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">
                Correo enviado. Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <p className="text-sm text-gray-500">Si no lo encuentras, revisa la carpeta de spam.</p>
              <Link
                to="/login"
                className="inline-block w-full text-center bg-ucips-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
              >
                Volver al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ucips.edu.mx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ucips-blue outline-none transition"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ucips-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 transition"
              >
                {loading ? "Enviando..." : "Enviar correo de recuperación"}
              </button>

              <p className="text-center text-sm text-gray-600">
                <Link to="/login" className="text-ucips-blue font-semibold hover:underline">
                  Volver al login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
