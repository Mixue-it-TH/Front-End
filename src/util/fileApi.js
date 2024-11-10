// fileApi.js
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

// ตั้งค่า Cloudinary สำหรับการจัดการภาพ
const cld = new Cloudinary({
  cloud: {
    cloudName: "dyhavbbzf", // แทนที่ด้วย Cloud Name ของคุณ
  },
});

// ฟังก์ชันสำหรับการสร้าง URL ของภาพจาก Cloudinary
export function getImage(publicId) {
  const image = cld.image(publicId);
  image.resize(fill().width(250).height(250)); // ตั้งค่าขนาดตามต้องการ
  return image;
}

// ฟังก์ชันสำหรับอัปโหลดภาพไปยัง Cloudinary
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "xsmity"); // ใส่ชื่อ Upload Preset ของคุณ

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/dyhavbbzf/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("Uploaded to Cloudinary:", data);
    return data; // คืนค่าข้อมูลของภาพที่อัปโหลด
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

// ฟังก์ชันสำหรับการลบภาพ (ต้องตั้งค่าใน Cloudinary ให้ใช้งานการลบแบบ unsigned ได้)
export async function deleteImage(publicId) {
  console.error("Deleting images directly from client-side is not safe. This should be done through a server.");
  // ทางเลือกที่ปลอดภัยคือทำผ่านเซิร์ฟเวอร์หรือใช้ Cloudinary Console
}
