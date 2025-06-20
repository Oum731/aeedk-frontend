import React, { useState, useRef, useEffect } from "react";
import {
  User as UserIcon,
  Menu as MenuIcon,
  X as CloseIcon,
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
  { label: "Accueil", icon: <Home size={20} />, href: "/" },
  { label: "À Propos", icon: <Info size={20} />, href: "#about" },
  { label: "Actualités", icon: <Newspaper size={20} />, href: "#actu" },
  { label: "Contact", icon: <Mail size={20} />, href: "#contact" },
];

export default function Navbar({ user, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLinkClick = (href) => {
    setIsOpen(false);
    if (href?.startsWith("/")) onNavigate(href);
  };

  const displayName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name || user?.username || user?.email || "";

  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-14 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 hover:bg-blue-600 hover:text-white transition"
          aria-label="Menu"
        >
          <MenuIcon size={24} />
        </button>
        <img
          src={logo}
          alt="Logo"
          className="h-10 w-10 rounded-full object-cover mr-3"
        />
      </div>

      {/* Dropdown menu (10–15% of screen height) */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed top-14 left-0 w-full z-40 bg-white shadow-md border-t border-gray-200 animate-slide-down"
          style={{ height: "15vh", overflowY: "auto" }}
        >
          <nav className="flex flex-col w-full">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item.href)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 hover:text-white text-left w-full"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {!user ? (
              <>
                <button
                  onClick={() => handleLinkClick("/register")}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 hover:text-white text-left w-full"
                >
                  <UserPlus size={20} />
                  Inscription
                </button>
                <button
                  onClick={() => handleLinkClick("/login")}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 hover:text-white text-left w-full"
                >
                  <LogIn size={20} />
                  Connexion
                </button>
              </>
            ) : (
              <button
                onClick={() => handleLinkClick("/profile")}
                className="flex items-center gap-3 px-4 py-2 hover:bg-blue-600 hover:text-white text-left w-full"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <UserIcon size={20} />
                )}
                <span className="truncate max-w-[150px]">{displayName}</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
