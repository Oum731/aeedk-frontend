export function getMediaUrl(path) {
  if (!path) return "";
  const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  if (path.startsWith("http")) return path;
  return `${base}/posts/media/${path}`;
}
