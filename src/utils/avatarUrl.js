import API_URL from "../config";

export function getAvatarUrl(avatar, bustCache = false) {
  if (!avatar || typeof avatar !== "string") return "/default-avatar.png";
  if (avatar.startsWith("http") || avatar.startsWith("data:")) return avatar;
  const filename = encodeURIComponent(avatar.split("/").pop());
  let url = `${API_URL}/user/avatar/${filename}`;
  if (bustCache) url += `?v=${Date.now()}`;
  return url;
}

export function getUserAvatarSrc(user, bustCache = false) {
  if (!user) return "/default-avatar.png";
  if (user.avatar_url)
    return bustCache ? user.avatar_url + "?v=" + Date.now() : user.avatar_url;
  if (user.avatar) return getAvatarUrl(user.avatar, bustCache);
  return "/default-avatar.png";
}
