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
      className={`fixed top-0 left-0 z-[89] h-screen bg-base-100 shadow-xl flex flex-col items-center py-4 gap-4 transition-width duration-300 ${
        isOpen ? "w-48" : "w-16"
      }`}
    >
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isOpen ? "Réduire le menu" : "Ouvrir le menu"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <button
        onClick={(e) => handleLinkClick("/", e)}
        className="mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded flex items-center gap-2 px-3"
        title="Accueil"
      >
        <img
          src={logo}
          alt="logo"
          className="w-9 h-9 rounded-full object-cover border-2 border-[#1D4ED8]"
        />
        {isOpen && (
          <span className="font-bold text-blue-700 text-lg">AEEDK</span>
        )}
      </button>

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

      <div className="mt-auto w-full flex flex-col items-center px-3 gap-4">
        <NotificationBell />
        {!user ? (
          <>
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
          </>
        ) : (
          <button
            onClick={(e) => handleLinkClick("/profile", e)}
            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={displayName}
            tabIndex={0}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <UserIcon size={22} />
            )}
            {isOpen && <span>{displayName}</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
