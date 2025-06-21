import React, { useState, useEffect } from "react";
import {
  Home,
  Info,
  Newspaper,
  Mail,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";
import logo from "../assets/logo.jpeg";

const sections = [
  { id: "accueil", icon: <Home size={20} />, label: "Accueil", path: "/" },
  { id: "about", icon: <Info size={20} />, label: "À Propos", path: "#about" },
  { id: "actu", icon: <Newspaper size={20} />, label: "Actus", path: "#actu" },
  {
    id: "contact",
    icon: <Mail size={20} />,
    label: "Contact",
    path: "#contact",
  },
];

export default function MobileNavBar({ user, onNavigate }) {
  const [activeSection, setActiveSection] = useState("accueil");

  const displayName =
    user?.first_name || user?.username || user?.email || "Moi";

  function scrollToSmoothly(targetY, duration = 900) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let start;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      const percent = Math.min(time / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(percent));
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    });
  }

  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      const offset = 70;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      scrollToSmoothly(y, 900);
    }
  };

  const handleNavigate = (path) => {
    if (path === "/" || path === "/home") {
      onNavigate("home");
      setActiveSection("accueil");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (path.startsWith("#")) {
      const id = path.substring(1);
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/home"
      ) {
        onNavigate("home");
        setTimeout(() => {
          scrollToSection(path);
          setActiveSection(id);
        }, 200);
      } else {
        scrollToSection(path);
        setActiveSection(id);
      }
    } else {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let current = "accueil";
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const offset = el.offsetTop - 100;
          if (scrollY >= offset) current = section.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-14 flex items-center justify-between px-4 md:hidden pt-[env(safe-area-inset-top)]">
        <div
          onClick={() => handleNavigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 rounded-full object-cover border border-blue-600"
          />
          <span className="font-bold text-blue-700 text-base">AEEDK</span>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <button
                onClick={() => handleNavigate("/register")}
                className="text-xs font-medium text-gray-700 hover:text-blue-600"
              >
                Inscription
              </button>
              <button
                onClick={() => handleNavigate("/login")}
                className="text-xs font-medium text-gray-700 hover:text-blue-600"
              >
                Connexion
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigate("/profile")}
              className="flex items-center gap-1 text-xs text-gray-700 hover:text-blue-600 font-medium"
            >
              <User size={18} />
              {displayName.length > 12 ? "Moi" : displayName}
            </button>
          )}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden flex justify-between items-center h-14 px-2 sm:px-4 pb-[env(safe-area-inset-bottom)]">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => handleNavigate(s.path)}
            className={`flex flex-col items-center justify-center text-[11px] sm:text-xs w-full ${
              activeSection === s.id
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </nav>
    </>
  );
}
