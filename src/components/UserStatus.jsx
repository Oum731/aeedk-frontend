import React from "react";

export default function UserStatus({ user }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          user.is_online ? "bg-green-500" : "bg-gray-400"
        }`}
        title={user.is_online ? "En ligne" : "Hors ligne"}
        aria-label={user.is_online ? "En ligne" : "Hors ligne"}
      />
      <span>{user.username || user.first_name || "Utilisateur"}</span>
    </div>
  );
}
