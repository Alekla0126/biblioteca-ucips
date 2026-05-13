import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useTheme";
import { firebaseSignOut } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { appUser, isAuthenticated, isAdmin, canUpload } = useAuth();
  const { reset } = useAuthStore();
  const { isDark, toggle } = useTheme();
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
    `text-sm font-medium transition ${isActive(path)
      ? "text-ucips-gold"
      : "text-ucips-cream/80 hover:text-ucips-gold"}`;

  return (
    /* Siempre navy institucional Pantone 276 C */
    <nav className="bg-ucips-navy shadow-lg sticky top-0 z-50 border-b border-ucips-navy/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-ucips-gold rounded-lg flex items-center justify-center shadow-gold">
              <svg className="w-5 h-5 text-ucips-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-base leading-none">Biblioteca</span>
              <span className="block text-ucips-gold text-xs font-semibold tracking-widest leading-none">UCIPS</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass("/")}>Inicio</Link>
            <Link to="/recursos" className={linkClass("/recursos")}>Recursos</Link>
            {canUpload && (
              <Link to="/subir" className={linkClass("/subir")}>+ Subir</Link>
            )}
            {isAdmin && (
              <Link to="/admin"
                className={`text-sm font-medium transition ${isActive("/admin")
                  ? "text-ucips-gold"
                  : "text-ucips-gold/80 hover:text-ucips-gold"}`}>
                Administrar
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* ── Botón de tema (literal) ── */}
            <button
              onClick={toggle}
              title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-ucips-cream/80 hover:text-white hover:border-ucips-gold/50 hover:bg-white/10 transition text-xs font-medium"
            >
              {isDark ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" strokeWidth={2} />
                    <path strokeLinecap="round" strokeWidth={2} d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  <span className="hidden sm:inline">Claro</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                  <span className="hidden sm:inline">Oscuro</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-white focus:outline-none"
                >
                  <div className="w-8 h-8 bg-ucips-gold rounded-full flex items-center justify-center text-ucips-navy font-bold text-sm shadow-gold">
                    {appUser?.display_name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="hidden sm:block text-sm text-ucips-cream/70 max-w-[120px] truncate">
                    {appUser?.display_name ?? appUser?.email}
                  </span>
                  <svg className="w-4 h-4 text-ucips-cream/50 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-dark-surface border border-dark-border rounded-xl shadow-dark-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-dark-border">
                        <p className="text-xs font-semibold text-ink truncate">{appUser?.display_name}</p>
                        <p className="text-xs text-ink-faint truncate">{appUser?.email}</p>
                      </div>
                      <Link to="/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink-soft hover:bg-dark-hover hover:text-ink transition"
                        onClick={() => setDropdownOpen(false)}>
                        <svg className="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi perfil
                      </Link>
                      {canUpload && (
                        <Link to="/subir"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ink-soft hover:bg-dark-hover hover:text-ink transition"
                          onClick={() => setDropdownOpen(false)}>
                          <svg className="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Subir recurso
                        </Link>
                      )}
                      {isAdmin && (
                        <Link to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ink-soft hover:bg-dark-hover hover:text-ink transition"
                          onClick={() => setDropdownOpen(false)}>
                          <svg className="w-4 h-4 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Panel admin
                        </Link>
                      )}
                      <div className="border-t border-dark-border mt-1" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-dark-hover transition">
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
                <Link to="/login" className="text-ucips-cream/80 hover:text-white text-sm font-medium transition">
                  Ingresar
                </Link>
                <Link to="/register"
                  className="bg-ucips-gold text-ucips-navy px-4 py-2 rounded-lg text-sm font-bold hover:bg-ucips-gold-light transition shadow-gold">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-ucips-cream/70 hover:text-white transition"
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
        <div className="md:hidden border-t border-white/10 bg-ucips-navy">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ucips-cream/80 hover:text-ucips-gold hover:bg-white/10 rounded-lg transition">
              Inicio
            </Link>
            <Link to="/recursos" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ucips-cream/80 hover:text-ucips-gold hover:bg-white/10 rounded-lg transition">
              Recursos
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/perfil" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-ucips-cream/80 hover:text-ucips-gold hover:bg-white/10 rounded-lg transition">
                  Mi perfil
                </Link>
                {canUpload && (
                  <Link to="/subir" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-ucips-cream/80 hover:text-ucips-gold hover:bg-white/10 rounded-lg transition">
                    + Subir recurso
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-ucips-gold hover:bg-white/10 rounded-lg transition">
                    Administrar
                  </Link>
                )}
                <div className="border-t border-white/10 pt-2">
                  <button onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-white/10 rounded-lg transition">
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-white/10 pt-2 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-ucips-cream/80 hover:text-ucips-gold hover:bg-white/10 rounded-lg transition">
                  Ingresar
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-ucips-navy bg-ucips-gold hover:bg-ucips-gold-light rounded-lg transition text-center">
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
