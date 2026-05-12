import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthInit, useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Layout/Navbar";
import Home from "@/pages/Home";
import Recursos from "@/pages/Recursos";
import RecursoDetail from "@/pages/RecursoDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import AdminDashboard from "@/pages/Admin/Dashboard";
import Subir from "@/pages/Subir";
import Perfil from "@/pages/Perfil";

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: "/admin" }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function ProtectedUploader({ children }: { children: React.ReactNode }) {
  const { canUpload, loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: "/subir" }} replace />;
  if (!canUpload) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function ProtectedAuth({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: "/perfil" }} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  useAuthInit();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/*"
        element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recursos" element={<Recursos />} />
                <Route path="/recursos/:id" element={<RecursoDetail />} />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedAuth>
                      <Perfil />
                    </ProtectedAuth>
                  }
                />
                <Route
                  path="/subir"
                  element={
                    <ProtectedUploader>
                      <Subir />
                    </ProtectedUploader>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdmin>
                      <AdminDashboard />
                    </ProtectedAdmin>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </BrowserRouter>
  );
}
