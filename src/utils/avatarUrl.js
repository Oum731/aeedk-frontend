import API_URL from "../config";

export function getAvatarUrl(avatar, bustCache = false) {
  if (!avatar || typeof avatar !== "string") {
    return `${API_URL}/user/avatar/avatar.jpeg`;
  }

  if (avatar.startsWith("http") || avatar.startsWith("data:")) return avatar;

  const filename = encodeURIComponent(avatar.split("/").pop());
  let url = `${API_URL}/user/avatar/${filename}`;
  if (bustCache) url += `?v=${Date.now()}`;
  return url;
}
