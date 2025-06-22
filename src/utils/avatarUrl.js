import API_URL from "../config";

export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  let filename = avatar.replace(/^media[\\/]/, "");
  filename = filename.replace(/^avatars[\\/]/, "");
  return `https://aeedk-backend.onrender.com/api/user/avatar/${filename}`;
}
