import API_URL from "../config";

export function getAvatarUrl(avatar, bustCache = false) {
  if (
    !avatar ||
    typeof avatar !== "string" ||
    avatar === "avatar.jpeg" ||
    avatar === "/default-avatar.png"
  )
    return "/default-avatar.png";
  if (avatar.startsWith("http") || avatar.startsWith("data:")) return avatar;
  const filename = encodeURIComponent(avatar.split("/").pop());
  let url = `${API_URL}/user/avatar/${filename}`;
  if (bustCache) url += `?v=${Date.now()}`;
  return url;
}

export function getUserAvatarSrc(user, bustCache = false) {
  if (!user) return "/default-avatar.png";
  if (
    user.avatar_url &&
    typeof user.avatar_url === "string" &&
    user.avatar_url.trim()
  )
    return bustCache ? user.avatar_url + "?v=" + Date.now() : user.avatar_url;
  if (user.avatar && typeof user.avatar === "string" && user.avatar.trim())
    return getAvatarUrl(user.avatar, bustCache);
  return "/default-avatar.png";
}
