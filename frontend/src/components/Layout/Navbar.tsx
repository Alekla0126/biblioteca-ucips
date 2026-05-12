import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { firebaseSignOut } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { appUser, isAuthenticated, isAdmin, canUpload } = useAuth();
  const { reset } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await firebaseSignOut();
    reset();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition ${isActive(path) ? "text-white" : "text-blue-200 hover:text-white"}`;

  return (
    <nav className="bg-ucips-navy shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-ucips-gold rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-ucips-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">Biblioteca UCIPS</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass("/")}>Inicio</Link>
            <Link to="/recursos" className={linkClass("/recursos")}>Recursos</Link>
            {canUpload && (
              <Link to="/subir" className={linkClass("/subir")}>+ Subir</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className={`text-sm font-medium transition ${isActive("/admin") ? "text-yellow-300" : "text-ucips-gold hover:text-yellow-300"}`}>
                Administrar
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-white focus:outline-none"
                >
                  <div className="w-8 h-8 bg-ucips-gold rounded-full flex items-center justify-center text-ucips-navy font-bold text-sm">
                    {appUser?.display_name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden sm:block text-sm text-blue-200 max-w-[120px] truncate">
                    {appUser?.display_name ?? appUser?.email}
                  </span>
                  <svg className="w-4 h-4 text-blue-300 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-800 truncate">{appUser?.display_name}</p>
                        <p className="text-xs text-gray-400 truncate">{appUser?.email}</p>
                      </div>
                      <Link
                        to="/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi perfil
                      </Link>
                      {canUpload && (
                        <Link
                          to="/subir"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Subir recurso
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Panel admin
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-blue-200 hover:text-white text-sm font-medium transition">
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

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-blue-200 hover:text-white transition"
              aria-label="Menú"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-blue-800 bg-ucips-navy">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition" onClick={() => setMobileOpen(false)}>
              Inicio
            </Link>
            <Link to="/recursos" className="block px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition" onClick={() => setMobileOpen(false)}>
              Recursos
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/perfil" className="block px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition" onClick={() => setMobileOpen(false)}>
                  Mi perfil
                </Link>
                {canUpload && (
                  <Link to="/subir" className="block px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition" onClick={() => setMobileOpen(false)}>
                    + Subir recurso
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="block px-3 py-2 text-sm font-medium text-ucips-gold hover:text-yellow-300 hover:bg-blue-800 rounded-lg transition" onClick={() => setMobileOpen(false)}>
                    Administrar
                  </Link>
                )}
                <div className="border-t border-blue-800 pt-2">
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-blue-800 rounded-lg transition">
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-blue-800 pt-2 flex flex-col gap-2">
                <Link to="/login" className="block px-3 py-2 text-sm font-medium text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition" onClick={() => setMobileOpen(false)}>
                  Ingresar
                </Link>
                <Link to="/register" className="block px-3 py-2 text-sm font-medium text-ucips-navy bg-ucips-gold hover:bg-yellow-400 rounded-lg transition text-center" onClick={() => setMobileOpen(false)}>
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
