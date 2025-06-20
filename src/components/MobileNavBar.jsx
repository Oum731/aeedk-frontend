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
  const displayName = user?.first_name || user?.username || user?.email;

  const handleNavigate = (path) => {
    if (path.startsWith("#")) {
      const el = document.querySelector(path);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Barre du haut (Header mobile) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 h-14 flex items-center justify-between px-4 md:hidden pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-cover border border-blue-600"
          />
          <span className="font-bold text-blue-700 text-lg">AEEDK</span>
        </div>
        <div>
          {!user ? (
            <div className="flex gap-3">
              <button
                onClick={() => handleNavigate("/register")}
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                Inscription
              </button>
              <button
                onClick={() => handleNavigate("/login")}
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                Connexion
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavigate("/profile")}
              className="text-sm text-gray-700 hover:text-blue-600 flex items-center gap-2"
            >
              <User size={18} />
              {displayName.length > 12 ? "Moi" : displayName}
            </button>
          )}
        </div>
      </header>

      {/* Barre du bas (Footer mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden flex justify-around items-center h-14 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={() => handleNavigate("/")}
          className="flex flex-col items-center text-[11px] text-gray-600 hover:text-blue-600"
        >
          <Home size={20} />
          Accueil
        </button>
        <button
          onClick={() => handleNavigate("#about")}
          className="flex flex-col items-center text-[11px] text-gray-600 hover:text-blue-600"
        >
          <Info size={20} />À Propos
        </button>
        <button
          onClick={() => handleNavigate("#actu")}
          className="flex flex-col items-center text-[11px] text-gray-600 hover:text-blue-600"
        >
          <Newspaper size={20} />
          Actus
        </button>
        <button
          onClick={() => handleNavigate("#contact")}
          className="flex flex-col items-center text-[11px] text-gray-600 hover:text-blue-600"
        >
          <Mail size={20} />
          Contact
        </button>
      </nav>
    </>
  );
}
