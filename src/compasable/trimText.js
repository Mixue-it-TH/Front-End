export default function trimText(text, size) {
  if (text.length > size) {
    return text.slice(0, size) + "...";
  }
  return text;
}
