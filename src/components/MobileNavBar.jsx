import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Newspaper, Mail, User } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { getUserAvatarSrc } from "../utils/avatarUrl";
import { useAuth } from "../contexts/AuthContext";
import clsx from "clsx";

const sections = [
  { id: "accueil", icon: <Home size={20} />, label: "Accueil", path: "/" },
  { id: "actu", icon: <Newspaper size={20} />, label: "Actus", path: "/#actu" },
  {
    id: "contact",
    icon: <Mail size={20} />,
    label: "Contact",
    path: "/#contact",
  },
  { id: "about", icon: <Info size={20} />, label: "À Propos", path: "/#about" },
];

export default function MobileNavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("accueil");

  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (hash && sections.find((s) => s.id === hash)) {
      setActive(hash);
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setActive("accueil");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const handleKeyDown = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      navigate(path);
    }
  };

  const displayName =
    user?.first_name || user?.username || user?.email || "Moi";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-14 flex items-center justify-between px-4 md:hidden pt-[env(safe-area-inset-top)]">
        <Link
          to="/"
          className="flex items-center gap-2 focus:outline-none"
          tabIndex={0}
        >
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-cover border border-blue-600"
          />
          <span className="font-bold text-blue-700 text-base">AEEDK</span>
        </Link>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/register"
                className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                tabIndex={0}
              >
                Inscription
              </Link>
              <Link
                to="/login"
                className="text-xs font-medium text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                tabIndex={0}
              >
                Connexion
              </Link>
            </>
          ) : (
            <Link
              to="/profile"
              className="flex items-center gap-1 text-xs text-gray-700 hover:text-blue-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              tabIndex={0}
            >
              <img
                src={getUserAvatarSrc(user)}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover border mr-1"
                style={{ minWidth: 28 }}
              />
              {displayName.length > 12 ? "Moi" : displayName}
            </Link>
          )}
        </div>
      </header>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden flex justify-between items-center h-14 px-2 sm:px-4 pb-[env(safe-area-inset-bottom)]">
        {sections.map((s) => (
          <Link
            key={s.id}
            to={s.path}
            className={clsx(
              "flex flex-col items-center justify-center text-[11px] sm:text-xs w-full py-1 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 rounded",
              active === s.id
                ? "text-blue-600 font-semibold border-t-2 border-blue-600 bg-blue-50 shadow-inner"
                : "text-gray-600 hover:text-blue-600"
            )}
            tabIndex={0}
            aria-current={active === s.id ? "page" : undefined}
            onKeyDown={(e) => handleKeyDown(e, s.path)}
          >
            {s.icon}
            <span>{s.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
