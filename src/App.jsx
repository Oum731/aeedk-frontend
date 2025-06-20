import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RegisterForm from "./auth/RegisterForm";
import LoginForm from "./auth/LoginForm";
import Profile from "./pages/Profile";
import AdminHome from "./pages/AdminHome";
import Footer from "./components/Footer";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const [page, setPage] = useState("home");
  const [viewedUserId, setViewedUserId] = useState(null);
  const { user } = useAuth();

  const handleNavigate = (p, userId = null) => {
    setPage(p);
    setViewedUserId(userId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (page === "home" || page === "/home") {
    mainContent = <Home onNavigate={handleNavigate} />;
  } else if (page === "/login") {
    mainContent = <LoginForm onNavigate={handleNavigate} />;
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
          onBack={() => handleNavigate("home")}
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
    mainContent = <div>Page non trouvée</div>;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#ffff" }}
    >
      <Navbar user={user} onNavigate={handleNavigate} />
      <div className="pt-16 px-4 max-w-7xl mx-auto scroll-smooth flex-1 w-full">
        {mainContent}
      </div>
      <Footer />
    </div>
  );
}
