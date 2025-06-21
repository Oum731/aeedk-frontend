const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";

  if (/^https?:\/\//i.test(avatar)) return avatar;

  let filename = avatar.replace(/^avatars\//, "").replace(/^media\//, "");

  return `${BASE_URL}/user/avatar/${filename}`;
}
