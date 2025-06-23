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
import logo from "../assets/logo.jpeg";
import { getAvatarUrl } from "../utils/avatarUrl";

const menuItems = [
  { label: "Accueil", icon: <Home size={22} />, href: "/" },
  { label: "Actualités", icon: <Newspaper size={22} />, href: "#actu" },
  { label: "Contact", icon: <Mail size={22} />, href: "#contact" },
  { label: "À Propos", icon: <Info size={22} />, href: "#about" },
];

export default function Navbar({ user, onNavigate }) {
  const handleLinkClick = (href, e) => {
    e?.preventDefault();

    if (href === "/" || href === "#home") {
      onNavigate("/home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href.startsWith("#")) {
      if (
        window.location.pathname !== "#home" &&
        window.location.pathname !== "/"
      ) {
        onNavigate("/home");
        setTimeout(() => {
          const section = document.querySelector(href);
          if (section) {
            const offset = 70;
            const y =
              section.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 50);
      } else {
        const section = document.querySelector(href);
        if (section) {
          const offset = 70;
          const y =
            section.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    } else {
      onNavigate(href);
    }
  };

  const displayName = user
    ? user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.username || user.email
    : "";
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar_url) : null;

  return (
    <aside className="hidden md:flex fixed top-0 left-0 z-[89] h-screen w-16 md:w-20 bg-base-100 shadow-xl flex-col items-center py-4 gap-4">
      <button onClick={(e) => handleLinkClick("/", e)} className="mb-5">
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
          className="flex items-center justify-center w-10 h-10 mx-auto hover:bg-[#1D4ED8] hover:text-white rounded transition"
          title={item.label}
        >
          {item.icon}
        </button>
      ))}

      {!user ? (
        <>
          <button
            onClick={(e) => handleLinkClick("/register", e)}
            className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white rounded transition"
            title="Inscription"
          >
            <UserPlus size={22} />
          </button>
          <button
            onClick={(e) => handleLinkClick("/login", e)}
            className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white rounded transition"
            title="Connexion"
          >
            <LogIn size={22} />
          </button>
        </>
      ) : (
        <button
          onClick={(e) => handleLinkClick("/profile", e)}
          className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white rounded transition"
          title={displayName}
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
