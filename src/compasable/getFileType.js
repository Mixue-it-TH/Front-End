export default function getFileType(fileName) {
  const extension = fileName.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return "https://intregatedproj-sy2.s3.ap-southeast-2.amazonaws.com/pdf_icon.png";
    case "zip":
      return "https://intregatedproj-sy2.s3.ap-southeast-2.amazonaws.com/zip_icon.png";
    default:
      return "https://intregatedproj-sy2.s3.ap-southeast-2.amazonaws.com/file_icon.png";
  }
}
