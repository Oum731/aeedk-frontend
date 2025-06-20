export function getAvatarUrl(avatar) {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  const filename = avatar.replace("avatars/", "").replace("media/", "");
  return `http://localhost:5000/api/user/avatar/${filename}`;
}
