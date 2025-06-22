import API_URL from "../config";

export function getAvatarUrl(avatar, bustCache = false) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  let filename = avatar
    .trim()
    .replace(/^media[\\/]/, "")
    .replace(/^avatars[\\/]/, "");
  filename = filename.replace(/^\/+/, "");
  let url = `${API_URL}/user/avatar/${encodeURIComponent(filename)}`;
  if (bustCache) {
    url += `?t=${Date.now()}`;
  }
  return url;
}
