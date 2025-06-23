import API_URL from "../config";

export function getAvatarUrl(avatar, bustCache = false) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  let filename = avatar.split("/").pop();
  let url = `${API_URL}/user/avatar/${encodeURIComponent(filename)}`;
  if (bustCache) url += `?t=${Date.now()}`;
  return url;
}
console.log("Avatar URL:", url);
