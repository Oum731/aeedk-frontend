const BASE_URL = import.meta.env.VITE_API_URL;

export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  const filename = avatar.replace("avatars/", "").replace("media/", "");
  return `${BASE_URL}/user/avatar/${filename}`;
}
