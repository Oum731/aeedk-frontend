import API_URL from "../config";

export function getAvatarUrl(avatar, bustCache = false) {
  if (!avatar) return `${API_URL}/default-avatar.png`;
  if (avatar.startsWith("http") || avatar.startsWith("data:")) return avatar;

  const filename = avatar.split("/").pop();
  let url = `${API_URL}/user/avatar/${encodeURIComponent(filename)}`;

  if (bustCache) url += `?v=${Date.now()}`;
  return url;
}

export function isValidAvatarUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
