function getToken() {
  return localStorage.getItem("token");
}

export default async function uploadFile(files, boardId, taskId) {
  try {
    const token = getToken();

    console.log(typeof files[0]);

    // สร้าง FormData เพื่อรองรับข้อมูลและไฟล์
    const formData = new FormData();

    // เพิ่มไฟล์ใน fileList ลงใน FormData
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file instanceof File) {
          formData.append("fileList", file);
        } else {
          console.warn("Item in files is not a File instance:", file);
        }
      });
    }

    console.log(formData.getAll("fileList"));

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${taskId}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return response;
    }
  } catch (e) {
    console.log(`error: ${e}`);
  }
}
