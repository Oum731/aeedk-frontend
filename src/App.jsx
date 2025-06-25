import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RegisterForm from "./auth/RegisterForm";
import LoginForm from "./auth/LoginForm";
import Profile from "./pages/Profile";
import AdminHome from "./pages/AdminHome";
import Footer from "./components/Footer";
import MobileNavBar from "./components/MobileNavBar";
import { useAuth } from "./contexts/AuthContext";
import VerifyEmail from "./auth/VerifyEmail";
import ResetPasswordForm from "./auth/ResetPassword";
import { Toaster } from "react-hot-toast";

// Optional: Guards
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return (
      <div className="text-center mt-16 text-error">
        Accès refusé : réservé aux administrateurs.
      </div>
    );
  }
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Navbar user={user} />
      <main className="pt-16 pb-16 md:pt-16 md:pb-0 px-4 w-full flex-1 scroll-smooth max-w-screen-2xl mx-auto pl-0 md:pl-20">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/reset/:token" element={<ResetPasswordForm />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminHome />
              </RequireAdmin>
            }
          />
          <Route
            path="*"
            element={<div className="text-center mt-16">Page non trouvée</div>}
          />
        </Routes>
      </main>
      <div className="pl-0 md:pl-20 w-full hidden md:block">
        <Footer />
      </div>
      <MobileNavBar user={user} />
    </div>
  );
}
