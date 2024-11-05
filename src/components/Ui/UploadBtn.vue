<script setup>
import { ref } from "vue";
import formatFileSize from "@/compasable/formatFileSize";
import trimText from "@/compasable/trimText";

const emit = defineEmits(["upload", "remove", "open"]);

const props = defineProps({
  files: {
    type: Array,
    default: [],
  },
  mode: {
    type: String,
  },
});

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const fileInput = ref(null);

function triggerFileUpload() {
  fileInput.value.click();
}

function handleFileUpload(event) {
  const selectedFiles = Array.from(event.target.files);
  const newFiles = [];
  const errors = {
    maxFiles: [],
    maxSize: [],
    duplicateNames: [],
  };
  console.log(selectedFiles);

  selectedFiles.forEach((file) => {
    // เช็คจำนวนไฟล์สูงสุด
    if (props.files.length + newFiles.length >= MAX_FILES) {
      errors.maxFiles.push(file.name); // บันทึกชื่อไฟล์ที่เกินจำนวน
      return;
    }

    // เช็คขนาดไฟล์
    if (file.size > MAX_FILE_SIZE) {
      errors.maxSize.push(file.name);
      return;
    }

    // เช็คชื่อไฟล์ซ้ำ
    const isDuplicate =
      props.files.some((f) => f.file.name === file.name) || newFiles.some((f) => f.file.name === file.name);
    if (isDuplicate) {
      errors.duplicateNames.push(file.name);
      return; // ข้ามไฟล์ที่ซ้ำ
    }

    // สร้าง preview URL สำหรับไฟล์ที่เป็นรูปภาพ
    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    newFiles.push({ file, previewUrl });
  });

  // ถ้ามีข้อผิดพลาด แสดงข้อความเตือน
  if (errors.maxFiles.length > 0 || errors.maxSize.length > 0 || errors.duplicateNames.length > 0) {
    let errorMessage = "";
    if (errors.maxFiles.length > 0) {
      errorMessage += `- Each task can have at most ${MAX_FILES} files. The following files are not added: ${errors.maxFiles.join(
        ", "
      )}.\n`;
    }
    if (errors.maxSize.length > 0) {
      errorMessage += `- Each file cannot be larger than ${
        MAX_FILE_SIZE / (1024 * 1024)
      } MB. The following files are not added: ${errors.maxSize.join(", ")}.\n`;
    }
    if (errors.duplicateNames.length > 0) {
      errorMessage += `- File with the same filename cannot be added or updated to the attachments. Please delete the attachment and add again to update the file. The following files are not added: ${errors.duplicateNames.join(
        ", "
      )}.\n`;
    }

    alert(errorMessage);
  }

  // ส่งไฟล์ที่ผ่านการตรวจสอบแล้วกลับไปยัง parent component
  if (newFiles.length > 0) {
    emit("upload", newFiles);
  }

  // รีเซ็ต input file เพื่อให้เลือกไฟล์เดิมได้อีกครั้ง
  event.target.value = "";
}
</script>

<template>
  <div class="flex flex-col">
    <input type="file" multiple @change="handleFileUpload" ref="fileInput" class="hidden" />
    <button
      @click="triggerFileUpload"
      :class="mode !== 'edit' ? 'opacity-50 cursor-not-allowed' : ''"
      :disabled="mode !== 'edit'"
      class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center justify-center w-[150px] h-[30px]"
    >
      <svg
        fill="#ffffff"
        width="20px"
        height="18px"
        viewBox="0 0 35 35"
        data-name="Layer 2"
        id="Layer_2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18,34.75A11.32,11.32,0,0,1,6.69,23.45V8A7.78,7.78,0,0,1,22.25,8V22.49a4.58,4.58,0,1,1-9.15,0V9.29a1.25,1.25,0,0,1,2.5,0v13.2a2.08,2.08,0,1,0,4.15,0V8A5.28,5.28,0,0,0,9.19,8V23.45A8.82,8.82,0,0,0,18,32.25c4.6,0,7.81-3.62,7.81-8.8V9.66a1.25,1.25,0,0,1,2.5,0V23.45C28.31,30,24,34.75,18,34.75Z"
        />
      </svg>
      <div>Attach</div>
    </button>
    <p v-if="files.length >= MAX_FILES" class="text-red-500 mt-2">You have reached the maximum file limit.</p>

    <ul v-if="files.length" class="mt-4 w-[95%]">
      <ul class="flex flex-row overflow-x-auto space-x-4">
        <li
          v-for="(file, index) in files"
          :key="file.file.name + file.lastModified"
          class="flex flex-row border border-gray-300 px-2 py-1 rounded-[5px]"
        >
          <div
            @click="emit('open', file.previewUrl)"
            class="text-nowrap flex flex-row justify-center items-center cursor-pointer"
          >
            <img v-if="file.previewUrl" :src="file.previewUrl" class="w-[40px] h-[25px] object-cover mr-2" />
            <span v-if="!file.previewUrl" class="mr-2">📎</span>
            <span class="text-[14px]">{{ trimText(file.file.name, 20) }} ({{ formatFileSize(file.file.size) }})</span>
          </div>
          <button @click="emit('remove', index)" class="text-red-500 hover:text-red-700 ml-4">✖</button>
        </li>
      </ul>
    </ul>
    <!-- <button @click="saveAttachments" class="mt-4 p-2 bg-blue-500 text-white rounded">Save Attachments</button> -->
  </div>
</template>

<style scoped></style>
