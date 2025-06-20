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
      {/* HEADER MOBILE */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-14 flex items-center justify-between px-4 md:hidden pt-[env(safe-area-inset-top)]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-cover border border-blue-600"
          />
          <span className="font-bold text-blue-700 text-base">AEEDK</span>
        </div>

        {/* Profile or login/register */}
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

      {/* FOOTER MOBILE */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden flex justify-between items-center h-14 px-2 sm:px-4 pb-[env(safe-area-inset-bottom)]">
        {[
          { icon: Home, label: "Accueil", href: "/" },
          { icon: Info, label: "À propos", href: "#about" },
          { icon: Newspaper, label: "Actus", href: "#actu" },
          { icon: Mail, label: "Contact", href: "#contact" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigate(item.href)}
            className="flex flex-col items-center justify-center text-[11px] sm:text-xs text-gray-600 hover:text-blue-600 transition w-full"
          >
            <item.icon size={20} />
            <span className="mt-0.5">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
