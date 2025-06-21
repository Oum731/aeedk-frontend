import React from "react";
import {
  Home,
  Info,
  Newspaper,
  Mail,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";
import logo from "../assets/logo.jpeg";

export default function MobileNavBar({ user, onNavigate }) {
  const displayName =
    user?.first_name || user?.username || user?.email || "Moi";

  function scrollToSmoothly(targetY, duration = 600) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let start;

    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      const percent = Math.min(time / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutQuad(percent));
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    });

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
  }

  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 60;
      scrollToSmoothly(y, 600);
    }
  };

  const handleNavigate = (path) => {
    if (path === "/" || path === "/home") {
      onNavigate("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (path.startsWith("#")) {
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/home"
      ) {
        onNavigate("home");
        setTimeout(() => scrollToSection(path), 100);
      } else {
        scrollToSection(path);
      }
    } else {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-14 flex items-center justify-between px-4 md:hidden pt-[env(safe-area-inset-top)]">
        <div
          onClick={() => handleNavigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-cover border border-blue-600"
          />
          <span className="font-bold text-blue-700 text-base">AEEDK</span>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <button
                onClick={() => handleNavigate("/register")}
                className="text-xs font-medium text-gray-700 hover:text-blue-600"
              >
                Inscription
              </button>
              <button
                onClick={() => handleNavigate("/login")}
                className="text-xs font-medium text-gray-700 hover:text-blue-600"
              >
                Connexion
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigate("/profile")}
              className="flex items-center gap-1 text-xs text-gray-700 hover:text-blue-600 font-medium"
            >
              <User size={18} />
              {displayName.length > 12 ? "Moi" : displayName}
            </button>
          )}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden flex justify-between items-center h-14 px-2 sm:px-4 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={() => handleNavigate("/")}
          className="flex flex-col items-center justify-center text-[11px] sm:text-xs text-gray-600 hover:text-blue-600 w-full"
        >
          <Home size={20} />
          Accueil
        </button>
        <button
          onClick={() => handleNavigate("#about")}
          className="flex flex-col items-center justify-center text-[11px] sm:text-xs text-gray-600 hover:text-blue-600 w-full"
        >
          <Info size={20} />À Propos
        </button>
        <button
          onClick={() => handleNavigate("#actu")}
          className="flex flex-col items-center justify-center text-[11px] sm:text-xs text-gray-600 hover:text-blue-600 w-full"
        >
          <Newspaper size={20} />
          Actus
        </button>
        <button
          onClick={() => handleNavigate("#contact")}
          className="flex flex-col items-center justify-center text-[11px] sm:text-xs text-gray-600 hover:text-blue-600 w-full"
        >
          <Mail size={20} />
          Contact
        </button>
      </nav>
    </>
  );
}
