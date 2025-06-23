import API_URL from "../config";

export function getAvatarUrl(avatar, bustCache = false) {
  if (!avatar) return `${API_URL}/default-avatar.png`;

  if (avatar.startsWith("http") || avatar.startsWith("data:")) return avatar;

  const filename = encodeURIComponent(avatar.split("/").pop());
  let url = `${API_URL}/user/avatar/${filename}`;

  if (bustCache) url += `?v=${Date.now()}`;

  return url;
}

export function isValidAvatarUrl(url) {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
}
