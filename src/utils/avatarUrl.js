import API_URL from "../config";

export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  // avatar: "avatars/xxxx.jpg"
  return `https://aeedk-backend.onrender.com/api/user/avatar/${avatar.replace(
    /^avatars[\\/]/,
    ""
  )}`;
}
