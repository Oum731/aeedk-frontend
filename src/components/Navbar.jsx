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
  {
    label: "Accueil",
    icon: <Home size={22} />,
    href: "/",
  },
  {
    label: "À Propos",
    icon: <Info size={22} />,
    href: "#about",
  },
  {
    label: "Actualités",
    icon: <Newspaper size={22} />,
    href: "#actu",
  },
  {
    label: "Contact",
    icon: <Mail size={22} />,
    href: "#contact",
  },
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
    if (href?.startsWith("/")) {
      onNavigate(href);
    }
  };

  const displayName = user
    ? user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.username || user.email
    : "";
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;

  return (
    <>
      {/* Hamburger button fixed top-left */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-[95] p-2 rounded-full bg-white shadow-md hover:bg-blue-600 hover:text-white transition"
        aria-label="Ouvrir le menu"
      >
        <MenuIcon size={24} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[89] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar full */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 z-[91] h-screen w-[75vw] sm:w-[25vw] max-w-sm bg-base-100 shadow-xl flex flex-col items-center py-6 transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="mb-6 p-2 rounded-full hover:bg-blue-600 hover:text-white transition absolute top-6 left-4"
          aria-label="Fermer le menu"
        >
          <CloseIcon size={26} />
        </button>

        {/* Logo */}
        <a href="/" className="mb-8 mt-4 flex flex-col items-center gap-3">
          <span className="rounded-full bg-base-200 p-2 shadow-md">
            <img
              src={logo}
              alt="logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
            />
          </span>
          <span className="text-xl font-bold text-blue-600">AEEDK</span>
        </a>

        {/* Menu */}
        <nav className="w-full flex-1">
          <ul className="flex flex-col gap-1 w-full px-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => handleLinkClick(item.href)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-600 hover:text-white rounded-md w-full text-left transition"
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
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-600 hover:text-white rounded-md w-full text-left transition"
                  >
                    <UserPlus size={22} />
                    Inscription
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick("/login")}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-600 hover:text-white rounded-md w-full text-left transition"
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
                  className="flex items-center gap-3 px-4 py-3 hover:bg-blue-600 hover:text-white rounded-md w-full text-left transition"
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
