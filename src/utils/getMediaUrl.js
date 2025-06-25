import API_URL from "../config";

export function getMediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return "";
}
