export default function isImageFile(fileName) {
  return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
}
