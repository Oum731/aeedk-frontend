import React, { useRef, useEffect, useState } from "react";
import { User as UserIcon, LogOut, Edit2, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getUserAvatarSrc } from "../utils/avatarUrl";

export default function ProfileMenu({ onNavigate }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!user) return null;

  const displayName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.username || user.email || "Moi";

  const handleNavigation = (path) => {
    setOpen(false);
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 px-2 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
        aria-label="Ouvrir le menu du profil"
      >
        <img
          src={getUserAvatarSrc(user)}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover border"
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 bg-white border rounded-xl shadow-lg min-w-[200px] p-2 flex flex-col gap-1">
          <div className="flex justify-center mb-2">
            <img
              src={getUserAvatarSrc(user)}
              alt={displayName}
              className="w-14 h-14 rounded-full object-cover border shadow"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>
          <div className="text-center font-semibold text-base mb-2 truncate px-2">
            {displayName}
          </div>
          <button
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded"
            onClick={() => handleNavigation("/profile")}
          >
            <Edit2 size={18} /> Modifier mon profil
          </button>
          {user.role === "admin" && (
            <button
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded"
              onClick={() => handleNavigation("/admin")}
            >
              <LayoutDashboard size={18} /> Tableau de bord admin
            </button>
          )}
          <button
            className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded text-red-600"
            onClick={() => {
              handleNavigation("/home");
              logout();
            }}
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
