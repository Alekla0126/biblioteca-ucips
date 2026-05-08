import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { firebaseSignOut } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { appUser, isAuthenticated, isAdmin } = useAuth();
  const { reset } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await firebaseSignOut();
    reset();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  return (
    <nav className="bg-ucips-navy shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ucips-gold rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-ucips-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">Biblioteca UCIPS</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-blue-200 hover:text-white transition text-sm font-medium">Inicio</Link>
            <Link to="/recursos" className="text-blue-200 hover:text-white transition text-sm font-medium">Recursos</Link>
            {isAdmin && (
              <Link to="/admin" className="text-ucips-gold hover:text-yellow-300 transition text-sm font-medium">
                Administrar
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-white"
                >
                  <div className="w-8 h-8 bg-ucips-gold rounded-full flex items-center justify-center text-ucips-navy font-bold text-sm">
                    {appUser?.display_name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden sm:block text-sm text-blue-200">{appUser?.display_name}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        Panel admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-blue-200 hover:text-white text-sm font-medium transition"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="bg-ucips-gold text-ucips-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
