import React from "react";
import { User as UserIcon } from "lucide-react";
import { getAvatarUrl } from "../utils/avatarUrl";

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
  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow rounded-xl flex items-center gap-6 p-4 sm:p-6 md:p-8">
      {user?.avatar ? (
        <img
          src={getAvatarUrl(user.avatar)}
          alt="avatar"
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <UserIcon className="w-16 h-16 md:w-20 md:h-20 text-gray-400 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg md:text-2xl truncate">
          {user?.username}
        </h3>
        <p className="text-sm md:text-base text-gray-500 truncate">
          {user?.email}
        </p>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm md:text-base">
          <span>
            <strong>Village:</strong> {user?.village || "-"}
          </span>
          <span>
            <strong>Sous-préf.:</strong> {user?.sub_prefecture || "-"}
          </span>
          <span>
            <strong>Âge:</strong> {getAge(user?.birth_date)}
          </span>
        </div>
      </div>
    </div>
  );
}
