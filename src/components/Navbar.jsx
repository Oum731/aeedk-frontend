import React, { useState } from "react";
import {
  User as UserIcon,
  Home,
  Info,
  Newspaper,
  Mail,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { getUserAvatarSrc } from "../utils/avatarUrl";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "../components/NotificationBell";

const menuItems = [
  { label: "Accueil", icon: <Home size={22} />, href: "/" },
  { label: "Actualités", icon: <Newspaper size={22} />, href: "#actu" },
  { label: "Contact", icon: <Mail size={22} />, href: "#contact" },
  { label: "À Propos", icon: <Info size={22} />, href: "#about" },
];

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(true);

  const displayName = user
    ? user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.username || user.email
    : "";

  const avatarUrl = getUserAvatarSrc(user);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.focus?.();
    }
  };

  const handleLinkClick = (href, e) => {
    e?.preventDefault();
    if (href === "/" || href === "#home") {
      if (location.pathname !== "/") navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10);
    } else if (href.startsWith("#")) {
      const sectionId = href.slice(1);
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => scrollToSection(sectionId), 350);
      } else {
        scrollToSection(sectionId);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <aside
      className={`hidden md:flex fixed top-0 left-0 z-[89] h-screen bg-base-100 shadow-xl flex-col items-center py-4 gap-4 transition-width duration-300 ${
        isOpen ? "w-48" : "w-16"
      }`}
      style={{ minWidth: isOpen ? 192 : 64 }}
    >
      {/* Conteneur logo + toggle bouton */}
      <div
        className="flex items-center w-full px-4 mb-5"
        style={{ paddingTop: isOpen ? "0" : "12px" }}
      >
        <button
          onClick={(e) => handleLinkClick("/", e)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded flex items-center gap-2"
          title="Accueil"
        >
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-cover border-2 border-[#1D4ED8]"
            style={{ display: "block" }}
          />
          {isOpen && (
            <span className="font-bold text-blue-700 text-lg select-none">
              AEEDK
            </span>
          )}
        </button>

        {/* Bouton toggle aligné à droite */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="ml-auto p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isOpen ? "Réduire le menu" : "Ouvrir le menu"}
          tabIndex={0}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={(e) => handleLinkClick(item.href, e)}
          className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={item.label}
          tabIndex={0}
        >
          {item.icon}
          {isOpen && <span>{item.label}</span>}
        </button>
      ))}

      {/* Section profil + cloche alignés en bas à gauche */}
      <div className="mt-auto w-full px-6">
        <div className="flex items-center gap-2 justify-start">
          <div
            className="cursor-pointer transition hover:bg-[#1D4ED8] hover:text-white rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            tabIndex={0}
            aria-label="Notifications"
            role="button"
            onClick={() => {
              // navigation ou toggle notifications si besoin
            }}
          >
            <NotificationBell />
          </div>

          {!user ? null : (
            <button
              onClick={(e) => handleLinkClick("/profile", e)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={displayName}
              tabIndex={0}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                  style={{ minWidth: 40, minHeight: 40 }}
                />
              ) : (
                <UserIcon size={22} />
              )}
              {isOpen && <span>{displayName}</span>}
            </button>
          )}
        </div>

        {!user && (
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={(e) => handleLinkClick("/register", e)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Inscription"
              tabIndex={0}
            >
              <UserPlus size={22} />
              {isOpen && <span>Inscription</span>}
            </button>
            <button
              onClick={(e) => handleLinkClick("/login", e)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Connexion"
              tabIndex={0}
            >
              <LogIn size={22} />
              {isOpen && <span>Connexion</span>}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
