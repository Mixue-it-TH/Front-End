export default function convertName(name) {
  if (!name) return "Unknow";
  return name.toUpperCase().replace(".", " ");
}
