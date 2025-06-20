import React, { useState, useRef, useEffect } from "react";
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
  { label: "À Propos", icon: <Info size={22} />, href: "#about" },
  { label: "Actualités", icon: <Newspaper size={22} />, href: "#actu" },
  { label: "Contact", icon: <Mail size={22} />, href: "#contact" },
];

export default function Navbar({ user, onNavigate }) {
  const handleLinkClick = (href) => {
    if (href?.startsWith("/")) onNavigate(href);
  };

  const displayName = user
    ? user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.username || user.email
    : "";
  const avatarUrl = user?.avatar ? getAvatarUrl(user.avatar) : null;

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 z-[89] h-screen w-16 md:w-20 bg-base-100 shadow-xl flex-col items-center py-4 gap-4">
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
              title="Inscription"
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
    </>
  );
}
