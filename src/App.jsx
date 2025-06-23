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

export default function App() {
  const [page, setPage] = useState("home");
  const [viewedUserId, setViewedUserId] = useState(null);
  const { user } = useAuth();

  const navigateTo = (newPage, userId = null) => {
    setPage(newPage);
    setViewedUserId(userId);
    window.history.pushState({ page: newPage }, "", newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const pathname = window.location.pathname;
      interpretPath(pathname + window.location.search);
    };

    window.addEventListener("popstate", handlePopState);

    interpretPath(window.location.pathname + window.location.search);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const interpretPath = (pathWithQuery) => {
    const url = new URL("http://dummy.com" + pathWithQuery);
    const path = url.pathname;
    const search = url.search;

    if (path.startsWith("/verify/")) {
      const token = path.split("/verify/")[1];
      setPage(`/verify/${token}`);
    } else if (path.startsWith("/reset/")) {
      const token = path.split("/reset/")[1];
      setPage(`/reset/${token}`);
    } else if (path === "/reset-password") {
      const token = new URLSearchParams(search).get("token");
      if (token) setPage(`/reset/${token}`);
      else setPage("home");
    } else if (
      ["/login", "/register", "/profile", "/admin", "/home", "/"].includes(path)
    ) {
      setPage(path === "/" ? "home" : path);
    } else {
      setPage("404");
    }
  };

  let mainContent = null;

  if (page.startsWith("/verify/")) {
    const token = page.split("/verify/")[1];
    mainContent = <VerifyEmail token={token} onNavigate={navigateTo} />;
  } else if (page.startsWith("/reset/")) {
    const token = page.split("/reset/")[1];
    mainContent = <ResetPasswordForm token={token} onNavigate={navigateTo} />;
  } else if (page === "home" || page === "/home") {
    mainContent = <Home onNavigate={navigateTo} />;
  } else if (page === "/login") {
    const params = new URLSearchParams(window.location.search);
    const reset = params.get("reset");
    const verified = params.get("verified");
    mainContent = (
      <LoginForm onNavigate={navigateTo} reset={reset} verified={verified} />
    );
  } else if (page === "/register") {
    mainContent = <RegisterForm onNavigate={navigateTo} />;
  } else if (page === "/profile") {
    mainContent =
      user || viewedUserId ? (
        <Profile
          key={viewedUserId || "me"}
          onNavigate={navigateTo}
          viewedUserId={viewedUserId}
          onBack={() => navigateTo("home")}
        />
      ) : (
        <div className="text-center mt-16 text-error">
          Veuillez vous connecter pour accéder à votre profil.
        </div>
      );
  } else if (page === "/admin") {
    mainContent =
      user?.role === "admin" ? (
        <AdminHome onNavigate={navigateTo} />
      ) : (
        <div className="text-center mt-16 text-error">Accès refusé</div>
      );
  } else {
    mainContent = <div className="text-center mt-16">Page non trouvée</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} onNavigate={navigateTo} />

      <main className="pt-16 pb-16 md:pt-16 md:pb-0 px-4 w-full flex-1 scroll-smooth max-w-screen-2xl mx-auto pl-0 md:pl-20">
        {mainContent}
      </main>

      <div className="pl-0 md:pl-20 w-full hidden md:block">
        <Footer />
      </div>

      <MobileNavBar user={user} onNavigate={navigateTo} />
    </div>
  );
}
