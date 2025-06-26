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
      className={`hidden md:flex fixed top-0 left-0 z-[89] h-screen bg-white shadow-xl flex-col items-center py-4 gap-4 transition-width duration-300 border-r border-gray-200 ${
        isOpen ? "w-48" : "w-16"
      }`}
      style={{ minWidth: isOpen ? 192 : 64 }}
      aria-label="Navigation principale"
    >
      <div
        className="relative flex flex-col items-center w-full px-4 mb-5"
        style={{ paddingTop: isOpen ? "0" : "12px" }}
      >
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="absolute top-0 right-0 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-label={isOpen ? "Réduire le menu" : "Ouvrir le menu"}
          tabIndex={0}
          type="button"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <button
          onClick={(e) => handleLinkClick("/", e)}
          className="relative focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full flex items-center justify-center mt-6 group"
          title="Association des élèves et étudiants du département de Kouto"
          style={{ minWidth: 48, minHeight: 48 }}
          type="button"
        >
          <img
            src={logo}
            alt="logo AEEDK"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
          />
          <span
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap
              opacity-0 pointer-events-none
              bg-gray-900 bg-opacity-95 text-white text-sm font-semibold px-4 py-2 rounded-lg
              shadow-lg
              transition-opacity duration-200
              group-hover:opacity-100"
          >
            Association des élèves et étudiants du département de Kouto
          </span>
        </button>
      </div>

      <nav
        className="flex flex-col items-center w-full gap-1 px-2"
        aria-label="Menu principal"
      >
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={(e) => handleLinkClick(item.href, e)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md 
              hover:bg-blue-600 hover:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-600
              transition-colors duration-200"
            title={item.label}
            tabIndex={0}
            type="button"
          >
            {item.icon}
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="mt-auto w-full px-4 flex flex-col items-start gap-3 relative">
        <div
          className="relative cursor-pointer group p-1 rounded-md hover:bg-blue-600 hover:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-600"
          tabIndex={0}
          aria-label="Notifications"
          role="button"
          onClick={() => {}}
        >
          <NotificationBell />
          <span
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap
              opacity-0 pointer-events-none
              bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded
              transition-opacity duration-200
              group-hover:opacity-100"
          >
            Notifications
          </span>
        </div>

        {user ? (
          <button
            onClick={(e) => handleLinkClick("/profile", e)}
            className="flex items-center gap-3  py-2 rounded-md hover:bg-blue-600 hover:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-600 justify-center w-full"
            title={displayName}
            tabIndex={0}
            style={{ minWidth: 48, minHeight: 48 }}
            type="button"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="rounded-full object-cover border-2 border-white"
                style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}
              />
            ) : (
              <UserIcon size={48} />
            )}
            {isOpen && (
              <span className="font-semibold truncate">{displayName}</span>
            )}
          </button>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={(e) => handleLinkClick("/register", e)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md
                hover:bg-blue-600 hover:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-600
                transition-colors duration-200"
              title="Inscription"
              tabIndex={0}
              type="button"
            >
              <UserPlus size={22} />
              {isOpen && <span className="font-medium">Inscription</span>}
            </button>
            <button
              onClick={(e) => handleLinkClick("/login", e)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md
                hover:bg-blue-600 hover:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-600
                transition-colors duration-200"
              title="Connexion"
              tabIndex={0}
              type="button"
            >
              <LogIn size={22} />
              {isOpen && <span className="font-medium">Connexion</span>}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
