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

function handleFileUpload(event) {
  const selectedFiles = Array.from(event.target.files);
  const newFiles = [];
  const errors = {
    maxFiles: [],
    maxSize: [],
    duplicateNames: [],
  };

  selectedFiles.forEach((file) => {
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

  event.target.value = "";
}
</script>

<template>
  <div class="flex flex-col">
    <input type="file" multiple @change="handleFileUpload" ref="fileInput" class="hidden" />
    <button
      v-if="mode === 'edit'"
      @click="triggerFileUpload"
      :class="[
        mode !== 'edit' ? 'opacity-50 cursor-not-allowed' : '',
        'bg-accent text-white px-4 py-2 rounded hover:bg-gray-300 flex items-center justify-center w-[150px] h-[30px]',
      ]"
      :disabled="mode !== 'edit' || files.length === 10"
    >
      <svg fill="#ffffff" width="20px" height="18px" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18,34.75A11.32,11.32,0,0,1,6.69,23.45V8A7.78,7.78,0,0,1,22.25,8V22.49a4.58,4.58,0,1,1-9.15,0V9.29a1.25,1.25,0,0,1,2.5,0v13.2a2.08,2.08,0,1,0,4.15,0V8A5.28,5.28,0,0,0,9.19,8V23.45A8.82,8.82,0,0,0,18,32.25c4.6,0,7.81-3.62,7.81-8.8V9.66a1.25,1.25,0,0,1,2.5,0V23.45C28.31,30,24,34.75,18,34.75Z"
        />
      </svg>
      <div>Attach</div>
    </button>
    <p v-if="files.length >= MAX_FILES && mode !== 'read'" class="text-red-500 mt-2">
      You have reached the maximum file limit.
    </p>

    <!-- เล้งแก้ -->
    <ul v-if="files.length" class="flex gap-2 flex-wrap pt-2 max-h-[150px] overflow-y-auto">
      <li
        v-for="(file, index) in files"
        :key="file.name + file.lastModified"
        class="flex items-center gap-2 w-[220px] h-[50px] bg-accent border border-gray-300 rounded px-2"
      >
        <div @click="emit('open', file.previewUrl ? file.previewUrl : file.url)" class="cursor-pointer">
          <img
            v-if="file.previewUrl || file.url"
            :src="isImageFile(file.name) ? (file.previewUrl ? file.previewUrl : file.url) : getFileType(file.name)"
            class="w-[40px] h-[40px] object-cover"
          />
          <img v-else :src="getFileType(file.name)" class="w-[40px] h-[40px] object-cover" />
        </div>
        <span class="flex-1 text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
          {{ trimText(file.name, 20) }}
        </span>
        <button
          @click="mode === 'edit' && emit('remove', index)"
          :class="mode !== 'edit' ? 'opacity-50 cursor-not-allowed' : ''"
          class="text-red-500 border-none bg-none cursor-pointer"
        >
          ✖
        </button>
      </li>
    </ul>
    <!-- เล้งแก้ -->
    <div v-else-if="mode === 'read' && files.length <= 0" class="w-full flex justify-center items-center h-[150px]">
      <div class="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-10 h-10 text-red-600">
          <path
            fill="gray"
            d="M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z"
          />
        </svg>
        <h1 class="mt-2 text-center text-gray-400">This task has no file attachment</h1>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
