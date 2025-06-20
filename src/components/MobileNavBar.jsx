import React from "react";
import {
  Home,
  Info,
  Newspaper,
  Mail,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function MobileNavBar({ user, onNavigate }) {
  const displayName = user?.first_name || user?.username || user?.email;

  const handleNavigate = (path) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden flex justify-around items-center h-14">
      <button
        onClick={() => handleNavigate("/")}
        className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
      >
        <Home size={20} />
        Accueil
      </button>
      <button
        onClick={() => handleNavigate("#about")}
        className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
      >
        <Info size={20} />À Propos
      </button>
      <button
        onClick={() => handleNavigate("#actu")}
        className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
      >
        <Newspaper size={20} />
        Actus
      </button>
      <button
        onClick={() => handleNavigate("#contact")}
        className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
      >
        <Mail size={20} />
        Contact
      </button>
      {!user ? (
        <button
          onClick={() => handleNavigate("/login")}
          className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <LogIn size={20} />
          Login
        </button>
      ) : (
        <button
          onClick={() => handleNavigate("/profile")}
          className="flex flex-col items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <User size={20} />
          Moi
        </button>
      )}
    </nav>
  );
}
