export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;

  const filename = avatar.split("/").pop();
  return `${BASE_URL}/user/avatar/${filename}`;
}
