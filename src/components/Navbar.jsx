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
  { label: "Accueil", icon: <Home size={22} />, href: "/" },
  { label: "À Propos", icon: <Info size={22} />, href: "#about" },
  { label: "Actualités", icon: <Newspaper size={22} />, href: "#actu" },
  { label: "Contact", icon: <Mail size={22} />, href: "#contact" },
];

export default function Navbar({ user, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLinkClick = (href) => {
    setIsOpen(false);
    if (href?.startsWith("/")) onNavigate(href);
  };

  const displayName = user
    ? user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.username || user.email
    : "";
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;

  const miniWidth = "w-16 md:w-20";
  const fullWidth = "w-[92vw] max-w-xs md:w-72 md:max-w-md";

  return (
    <>
      {/* Mini sidebar (desktop seulement) */}
      {!isOpen && (
        <aside
          className={`hidden md:flex fixed top-0 left-0 z-[89] h-[100vh] ${miniWidth} bg-base-100 shadow-xl flex-col items-center py-4 gap-4`}
        >
          <button
            onClick={() => setIsOpen(true)}
            className="mb-3 p-2 rounded-full hover:bg-[#1D4ED8] hover:text-white transition"
            aria-label="Ouvrir le menu"
          >
            <MenuIcon size={26} />
          </button>
          <a href="/" className="mb-5">
            <img
              src={logo}
              alt="logo"
              className="w-9 h-9 rounded-full object-cover border-2 border-[#1D4ED8]"
            />
          </a>
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className="flex items-center justify-center w-10 h-10 mx-auto hover:bg-[#1D4ED8] hover:text-white rounded transition"
              title={item.label}
            >
              {item.icon}
            </a>
          ))}
          {!user ? (
            <>
              <button
                onClick={() => handleLinkClick("/register")}
                className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white rounded transition"
                title="Inscrire"
              >
                <UserPlus size={22} />
              </button>
              <button
                onClick={() => handleLinkClick("/login")}
                className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-[#1D4ED8] hover:text-white rounded transition"
                title="Connexion"
              >
                <LogIn size={22} />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleLinkClick("/profile")}
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
      )}

      {/* Hamburger (mobile seulement) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-[95] p-2 rounded-full bg-white shadow-md text-[#1D4ED8] md:hidden"
          aria-label="Ouvrir le menu mobile"
        >
          <MenuIcon size={28} />
        </button>
      )}

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[89] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar complète (mobile + desktop) */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 z-[91] h-[100vh] ${fullWidth} bg-base-100 shadow-xl flex flex-col items-center py-6 transition-transform duration-300 overflow-y-auto max-h-[100vh] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="mb-6 p-2 rounded-full hover:bg-[#1D4ED8] hover:text-white transition absolute top-6 left-4"
          aria-label="Fermer le menu"
        >
          <CloseIcon size={26} />
        </button>
        <a href="/" className="mb-8 flex flex-col items-center gap-3 mt-4">
          <span className="rounded-full bg-base-200 p-2 shadow-md">
            <img
              src={logo}
              alt="logo"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#1D4ED8]"
            />
          </span>
          <span className="text-2xl font-bold text-[#1D4ED8] hidden sm:block">
            AEEDK
          </span>
        </a>
        <nav className="w-full flex-1">
          <ul className="flex flex-col gap-1 w-full">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-[#1D4ED8] hover:text-white rounded-md w-full text-left transition"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
            {!user ? (
              <>
                <li>
                  <button
                    onClick={() => handleLinkClick("/register")}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-[#1D4ED8] hover:text-white rounded-md w-full text-left transition"
                  >
                    <UserPlus size={22} />
                    Inscrire
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("/login")}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-[#1D4ED8] hover:text-white rounded-md w-full text-left transition"
                  >
                    <LogIn size={22} />
                    Connexion
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => handleLinkClick("/profile")}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-[#1D4ED8] hover:text-white rounded-md w-full text-left transition"
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
                  <span className="font-semibold truncate max-w-[140px]">
                    {displayName}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}
