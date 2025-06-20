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
      {/* Top bar with hamburger */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow px-4 py-3 flex items-center justify-between md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md hover:bg-blue-600 hover:text-white transition"
          aria-label="Menu"
        >
          <MenuIcon size={24} />
        </button>
        <img
          src={logo}
          alt="Logo"
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer sidebar */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-[70vw] max-w-xs z-50 bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover border border-blue-600"
            />
            <span className="text-lg font-bold text-blue-600">AEEDK</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-blue-600 hover:text-white transition"
            aria-label="Fermer"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-4 py-4">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-600 hover:text-white transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}

          <hr className="my-2" />

          {!user ? (
            <>
              <button
                onClick={() => handleLinkClick("/register")}
                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-600 hover:text-white transition w-full text-left"
              >
                <UserPlus size={20} />
                Inscription
              </button>
              <button
                onClick={() => handleLinkClick("/login")}
                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-600 hover:text-white transition w-full text-left"
              >
                <LogIn size={20} />
                Connexion
              </button>
            </>
          ) : (
            <button
              onClick={() => handleLinkClick("/profile")}
              className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-600 hover:text-white transition w-full text-left"
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
              <span className="truncate max-w-[150px] font-semibold">
                {displayName}
              </span>
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
