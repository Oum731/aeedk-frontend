import React from "react";
import {
  User as UserIcon,
  Home,
  Info,
  Newspaper,
  Mail,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { getUserAvatarSrc } from "../utils/avatarUrl";
import { useAuth } from "../contexts/AuthContext";

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

  const displayName = user
    ? user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.username || user.email
    : "";

  const avatarUrl = getUserAvatarSrc(user);

  const handleLinkClick = (href, e) => {
    e?.preventDefault();

    if (href === "/" || href === "#home") {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 10);
    } else if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const section = document.getElementById(href.slice(1));
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 200);
      } else {
        const section = document.getElementById(href.slice(1));
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else {
      navigate(href);
    }
  };

  return (
    <aside className="hidden md:flex fixed top-0 left-0 z-[89] h-screen w-16 md:w-20 bg-base-100 shadow-xl flex-col items-center py-4 gap-4">
      <button
        onClick={(e) => handleLinkClick("/", e)}
        className="mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        title="Accueil"
      >
        <img
          src={logo}
          alt="logo"
          className="w-9 h-9 rounded-full object-cover border-2 border-[#1D4ED8]"
        />
      </button>
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={(e) => handleLinkClick(item.href, e)}
          className="flex items-center justify-center w-10 h-10 mx-auto hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={item.label}
          tabIndex={0}
        >
          {item.icon}
        </button>
      ))}
      {!user ? (
        <>
          <button
            onClick={(e) => handleLinkClick("/register", e)}
            className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Inscription"
            tabIndex={0}
          >
            <UserPlus size={22} />
          </button>
          <button
            onClick={(e) => handleLinkClick("/login", e)}
            className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Connexion"
            tabIndex={0}
          >
            <LogIn size={22} />
          </button>
        </>
      ) : (
        <button
          onClick={(e) => handleLinkClick("/profile", e)}
          className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </button>
      )}
    </aside>
  );
}
