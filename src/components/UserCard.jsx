import React from "react";
import { User as UserIcon } from "lucide-react";
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

export default function UserCard({ user }) {
  if (!user) return null;
  const avatarSrc = getUserAvatarSrc(user);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow rounded-xl flex items-center gap-6 p-4 sm:p-6 md:p-8 hover:shadow-xl transition">
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt="avatar"
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-avatar.png";
          }}
        />
      ) : (
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg md:text-2xl truncate text-blue-700 flex items-center gap-2">
          {user.username}
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
