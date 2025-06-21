import API_URL from "../config";

export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;

  const filename = avatar
    .replace("media/", "")
    .replace("avatars/", "")
    .replace("user/avatar/", "")
    .replace(/^\/+/, "");

  return `${API_URL}/user/avatar/${filename}`;
}
