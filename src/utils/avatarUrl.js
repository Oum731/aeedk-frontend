import API_URL from "../config";

const DEFAULT_CLOUDINARY_AVATAR = "/default-avatar.png";

export function getAvatarUrl(avatar, bustCache = false) {
  if (
    !avatar ||
    typeof avatar !== "string" ||
    avatar.trim() === "" ||
    avatar === "avatar.jpeg" ||
    avatar.endsWith("/default-avatar.png")
  ) {
    return DEFAULT_CLOUDINARY_AVATAR;
  }

  if (avatar.startsWith("http") || avatar.startsWith("data:")) {
    let url = avatar;
    if (bustCache) url += (url.includes("?") ? "&" : "?") + "v=" + Date.now();
    return url;
  }

  return DEFAULT_CLOUDINARY_AVATAR;
}

export function getUserAvatarSrc(user, bustCache = false) {
  if (!user) return DEFAULT_CLOUDINARY_AVATAR;
  if (
    user.avatar_url &&
    typeof user.avatar_url === "string" &&
    user.avatar_url.trim() !== "" &&
    !user.avatar_url.endsWith("/default-avatar.png")
  ) {
    return bustCache
      ? user.avatar_url +
          (user.avatar_url.includes("?") ? "&" : "?") +
          "v=" +
          Date.now()
      : user.avatar_url;
  }
  if (
    user.avatar &&
    typeof user.avatar === "string" &&
    user.avatar.trim() !== ""
  ) {
    return getAvatarUrl(user.avatar, bustCache);
  }
  return DEFAULT_CLOUDINARY_AVATAR;
}
