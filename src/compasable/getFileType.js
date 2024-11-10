export default function getFileType(fileName) {
  const extension = fileName.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return "/image/pdf-icon.png";
    case "zip":
      return "/image/zip-icon.png";
    default:
      return "/image/fileicon.png";
  }
}
