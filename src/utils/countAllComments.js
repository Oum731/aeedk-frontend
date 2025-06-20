export default function countAllComments(comments) {
  if (!Array.isArray(comments)) return 0;
  let count = 0;
  for (const c of comments) {
    count += 1;
    if (Array.isArray(c.children) && c.children.length > 0) {
      count += countAllComments(c.children);
    }
  }
  return count;
}
