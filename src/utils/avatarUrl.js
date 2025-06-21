import API_URL from "../config";
export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;

  const filename = avatar.split("/").pop();
  return `${API_URL}/user/avatar/${filename}`;
}
