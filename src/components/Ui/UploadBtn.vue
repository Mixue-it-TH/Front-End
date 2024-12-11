<script setup>
import { ref } from "vue";
import formatFileSize from "@/compasable/formatFileSize";
import trimText from "@/compasable/trimText";
import isImageFile from "@/compasable/isImageFile";
import getFileType from "@/compasable/getFileType";

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

function handleDragOver(event) {
  if (props.mode === "edit") {
    event.preventDefault();
    event.currentTarget.classList.add("bg-gray-100");
  }
}

function handleDragLeave(event) {
  if (props.mode === "edit") {
    event.preventDefault();
    event.currentTarget.classList.remove("bg-gray-100");
  }
}

function handleDrop(event) {
  if (props.mode === "edit") {
    event.preventDefault();
    event.currentTarget.classList.remove("bg-gray-100");
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
  }
}

function handleFiles(files) {
  const newFiles = [];
  const errors = {
    maxFiles: [],
    maxSize: [],
    duplicateNames: [],
  };

  files.forEach((file) => {
    if (props.files.length + newFiles.length >= MAX_FILES) {
      errors.maxFiles.push(file.name);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.maxSize.push(file.name);
      return;
    }

    const isDuplicate = props.files.some((f) => f.name === file.name) || newFiles.some((f) => f.name === file.name);
    if (isDuplicate) {
      errors.duplicateNames.push(file.name);
      return;
    }

    const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    file.previewUrl = previewUrl;
    newFiles.push(file);
  });

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

  if (newFiles.length > 0) {
    emit("upload", newFiles);
  }
}

// Update the existing handleFileUpload function to use handleFiles
function handleFileUpload(event) {
  const selectedFiles = Array.from(event.target.files);
  handleFiles(selectedFiles);
  event.target.value = "";
}
</script>

<template>
  <div class="flex gap-[5px] mt-[15px]">
    <p class="font-[600]">Attachments</p>
    <div class="flex" @click="triggerFileUpload">
      <span
        v-if="mode !== 'read'"
        :class="files?.length >= 10 ? 'text-red-500' : ''"
        class="text-[16px] font-[400] text-[#AFAFAF]"
      >
        {{ files.length }}/10 files
      </span>
      <svg
        v-if="files.length < 10 && files.length && mode === 'edit'"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="w-[20px] ml-2 cursor-pointer"
      >
        <path
          d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
        />
      </svg>
    </div>
  </div>
  <div class="flex flex-col h-[250px] mobile-L:min-h-[60%]">
    <input type="file" multiple @change="handleFileUpload" ref="fileInput" class="hidden" />

    <div
      v-if="mode === 'edit' && !files.length"
      class="outline-dashed outline-2 flex flex-col justify-center items-center h-auto mt-5 cursor-pointer w-[95%] py-[20px]"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileUpload"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-[65px] text-red-400">
        <path
          d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
        />
      </svg>
      <h1>Upload a File</h1>
      <p class="text-gray-400">Drag and drop file here</p>
    </div>
    <!-- เล้งแก้ -->
    <div v-else-if="mode === 'read' && files.length <= 0" class="w-full flex h-[150px] mt-2">
      <div class="flex flex-col justify-center items-center outline-dashed outline-2 w-[95%]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-[65px] h-[85px] mt-2 text-red-600">
          <path
            fill="gray"
            d="M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z"
          />
        </svg>
        <h1 class="mt-2 text-center text-gray-400">This task has no file attachment</h1>
      </div>
    </div>

    <div
      v-if="files.length"
      class="outline-dashed outline-2 flex flex-col justify-center mobile-L:pl-[15px] mt-[10px] pb-[10px] cursor-pointer w-[95%] overflow-hidden"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <ul v-if="files.length" class="flex gap-2 flex-wrap pt-2 max-w-[100%] mx-2 overflow-y-auto">
        <li
          v-for="(file, index) in files"
          :key="file.name + file.lastModified"
          class="flex items-center gap-2 w-[210px] h-[60px] bg-accent border border-gray-400 rounded px-2 hover:shadow-xl hover:scale-[103%] duration-200"
        >
          <div @click="emit('open', file.previewUrl ? file.previewUrl : file.url)" class="flex items-center gap-2">
            <div class="cursor-pointer">
              <img
                v-if="file.previewUrl || file.url"
                :src="isImageFile(file.name) ? (file.previewUrl ? file.previewUrl : file.url) : getFileType(file.name)"
                class="w-[50px] h-[50px] object-cover"
              />
              <img v-else :src="getFileType(file.name)" class="w-[40px] h-[40px] object-cover" />
            </div>
            <span class="flex-1 text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
              {{ trimText(file.name, 20) }}
            </span>
          </div>

          <button
            @click="mode === 'edit' && emit('remove', index)"
            :class="mode !== 'edit' ? 'opacity-50 cursor-not-allowed' : ''"
            class="text-red-500 border-none bg-none cursor-pointer hover:text-red-800"
          >
            ✖
          </button>
        </li>
      </ul>
    </div>
    <p v-if="files.length >= MAX_FILES && mode !== 'read'" class="text-red-500 mt-2">
      You have reached the maximum file limit.
    </p>
    <!-- <div class="flex my-3" @click="triggerFileUpload">
      <span
        v-if="mode !== 'read'"
        :class="files?.length >= 10 ? 'text-red-500' : ''"
        class="text-[16px] font-[400] text-[#AFAFAF]"
      >
        {{ files.length }}/10 files
      </span>
      <svg
        v-if="files.length < MAX_FILES && files.length && mode === 'edit'"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="w-[20px] ml-2"
      >
        <path
          d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"
        />
      </svg>
    </div> -->
  </div>
</template>

<style scoped></style>
