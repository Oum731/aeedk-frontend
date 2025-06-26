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
        className="relative flex flex-col items-center w-full px-4 mb-5"
        style={{ paddingTop: isOpen ? "0" : "12px" }}
      >
        {/* Bouton toggle en absolute top right */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="absolute top-0 right-0 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isOpen ? "Réduire le menu" : "Ouvrir le menu"}
          tabIndex={0}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo centré, taille fixe, sans texte, avec tooltip */}
        <button
          onClick={(e) => handleLinkClick("/", e)}
          className="relative focus:outline-none focus:ring-2 focus:ring-blue-500 rounded flex items-center justify-center mt-6"
          title=""
          style={{ minWidth: 48, minHeight: 48 }}
        >
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 rounded-full object-cover border-2 border-[#1D4ED8]"
          />
          {/* Tooltip personnalisé */}
          <span
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap
            opacity-0 pointer-events-none
            bg-black bg-opacity-80 text-white text-xs font-semibold px-3 py-1 rounded
            transition-opacity duration-200
            group-hover:opacity-100
          "
          >
            Association des élèves et étudiants du département de Kouto
          </span>
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

      {/* Section cloche en haut, photo profil en dessous, aligné à gauche */}
      <div className="mt-auto w-full px-4 flex flex-col items-start gap-2 relative">
        <div
          className="cursor-pointer transition hover:bg-[#1D4ED8] hover:text-white rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
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
            className="flex items-center gap-3 px-3 py-2 hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500 justify-center"
            title={displayName}
            tabIndex={0}
            style={{ minWidth: 48, minHeight: 48 }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover border border-white shadow-sm"
              />
            ) : (
              <UserIcon size={22} />
            )}
            {/* Affiche le nom uniquement si sidebar ouverte */}
            {isOpen && <span>{displayName}</span>}
          </button>
        )}

        {!user && (
          <div className="mt-4 flex flex-col gap-2 w-full">
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

      {/* Style pour tooltip */}
      <style>{`
        /* Tooltip visible au hover sur le bouton logo */
        button.relative:hover span.absolute {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      `}</style>
    </aside>
  );
}
