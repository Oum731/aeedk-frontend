import React, { useState, useEffect } from "react";
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

const getCurrentPath = () => {
  const pathname = window.location.pathname;
  const search = window.location.search;
  if (pathname.startsWith("/verify/")) return pathname;
  if (pathname.startsWith("/reset/")) return pathname;
  if (pathname === "/reset-password") {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) return `/reset/${token}`;
    return pathname;
  }
  return pathname === "/" ? "/home" : pathname;
};

export default function App() {
  const [page, setPage] = useState(getCurrentPath());
  const [viewedUserId, setViewedUserId] = useState(null);
  const { user } = useAuth();

  const handleNavigate = (p, userId = null) => {
    setPage(p);
    setViewedUserId(userId);
    window.history.pushState({}, "", p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onPopState = () => {
      setPage(getCurrentPath());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const handleCustomNavigate = (e) => {
      setPage("/profile");
      setViewedUserId(e.detail ?? null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("navigateProfile", handleCustomNavigate);
    return () =>
      window.removeEventListener("navigateProfile", handleCustomNavigate);
  }, []);

  let mainContent = null;
  if (page.startsWith("/verify/")) {
    const token = page.split("/verify/")[1];
    mainContent = <VerifyEmail token={token} onNavigate={handleNavigate} />;
  } else if (page.startsWith("/reset/")) {
    const token = page.split("/reset/")[1];
    mainContent = (
      <ResetPasswordForm token={token} onNavigate={handleNavigate} />
    );
  } else if (page === "/home" || page === "home" || page === "/") {
    mainContent = <Home onNavigate={handleNavigate} />;
  } else if (page === "/login") {
    const params = new URLSearchParams(window.location.search);
    const reset = params.get("reset");
    const verified = params.get("verified");
    mainContent = (
      <LoginForm
        onNavigate={handleNavigate}
        reset={reset}
        verified={verified}
      />
    );
  } else if (page === "/register") {
    mainContent = <RegisterForm onNavigate={handleNavigate} />;
  } else if (page === "/profile") {
    if (!user && !viewedUserId) {
      mainContent = (
        <div className="text-center mt-16 text-error">
          Veuillez vous connecter pour accéder à votre profil.
        </div>
      );
    } else {
      mainContent = (
        <Profile
          key={viewedUserId || "me"}
          onNavigate={handleNavigate}
          viewedUserId={viewedUserId}
          onBack={() => handleNavigate("/home")}
        />
      );
    }
  } else if (page === "/admin") {
    if (user?.role === "admin") {
      mainContent = <AdminHome onNavigate={handleNavigate} />;
    } else {
      mainContent = (
        <div className="text-center mt-16 text-error">
          Accès refusé : réservé aux administrateurs.
        </div>
      );
    }
  } else {
    mainContent = <div className="text-center mt-16">Page non trouvée</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} onNavigate={handleNavigate} />

      <main className="pt-16 pb-16 md:pt-16 md:pb-0 px-4 w-full flex-1 scroll-smooth max-w-screen-2xl mx-auto pl-0 md:pl-20">
        {mainContent}
      </main>

      <div className="pl-0 md:pl-20 w-full hidden md:block">
        <Footer />
      </div>

      <MobileNavBar user={user} onNavigate={handleNavigate} />
    </div>
  );
}
