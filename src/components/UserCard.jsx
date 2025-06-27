import React from "react";
import { User as UserIcon, Bell } from "lucide-react";
import { getUserAvatarSrc } from "../utils/avatarUrl";

function getAge(birth_date) {
  if (!birth_date) return "-";
  const dob = new Date(birth_date);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default function UserCard({
  user,
  isOnline = false,
  unreadNotifications = 0,
}) {
  if (!user) return null;
  const avatarSrc = getUserAvatarSrc(user);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow rounded-xl flex items-center gap-5 p-4 sm:p-6 md:p-8 hover:shadow-xl transition relative">
      <div className="relative flex-shrink-0">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {unreadNotifications > 0 && (
          <span
            className="absolute -top-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs border-2 border-white shadow-md"
            title={`${unreadNotifications} notification${
              unreadNotifications > 1 ? "s" : ""
            } non lue${unreadNotifications > 1 ? "s" : ""}`}
          >
            <Bell className="w-4 h-4 mr-1" />
            {unreadNotifications > 9 ? "9+" : unreadNotifications}
          </span>
        )}

        <span
          className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
          title={isOnline ? "En ligne" : "Hors ligne"}
        ></span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg md:text-2xl truncate text-blue-700 flex items-center gap-2">
          <span className="truncate">{user.username}</span>
          {user.role === "admin" && (
            <span className="badge badge-info ml-2 align-middle">Admin</span>
          )}
        </h3>
        <p className="text-sm md:text-base text-gray-500 truncate">
          {user.email}
        </p>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm md:text-base">
          <span>
            <strong>Village:</strong> {user.village || "-"}
          </span>
          <span>
            <strong>Sous-préf.:</strong> {user.sub_prefecture || "-"}
          </span>
          <span>
            <strong>Âge:</strong> {getAge(user.birth_date)}
          </span>
        </div>
      </div>
    </div>
  );
}
