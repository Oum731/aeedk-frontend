import React from "react";

export default function UserStatus({ user }) {
  const name =
    user?.username || user?.first_name || user?.last_name || "Utilisateur";
  const isOnline = !!user?.is_online;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full border-2 border-white ${
          isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
        }`}
        title={isOnline ? "En ligne" : "Hors ligne"}
        aria-label={isOnline ? "En ligne" : "Hors ligne"}
      />
      <span className="font-medium text-sm">
        {name}
        <span
          className={`ml-2 text-xs ${
            isOnline ? "text-green-600" : "text-gray-400"
          }`}
        >
          {isOnline ? "En ligne" : "Hors ligne"}
        </span>
      </span>
    </div>
  );
}
