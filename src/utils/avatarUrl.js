import API_URL from "../config";

export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  let filename = avatar
    .trim()
    .replace(/^media[\\/]/, "")
    .replace(/^avatars[\\/]/, "");
  filename = filename.replace(/^\/+/, "");
  return `https://aeedk-backend.onrender.com/api/user/avatar/${encodeURIComponent(
    filename
  )}`;
}
