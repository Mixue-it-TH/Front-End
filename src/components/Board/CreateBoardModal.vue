<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAccount } from "@/store/account";
import { createBoard } from "@/util/fetchUtils";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";

const router = useRouter();
const prop = defineProps({
  name: {
    type: String,
  },
});

const accountStore = useAccount();
const boardName = ref(accountStore.getData().name);
const isDisable = ref(false);

async function saveBoard(name) {
  const newBoard = await handleRequestWithTokenRefresh(createBoard, name);
  accountStore.addBoard(newBoard);
  closeModal();
}

function closeModal() {
  router.push("/board");
  router.go(-1);
}

function handleCreateBoard() {
  if (boardName.value.length === 0) {
    isDisable.value = true;
  } else {
    isDisable.value = false;
  }
}
</script>

<template>
  <div
    class="itbkk-modal-new backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto flex items-center justify-center"
  >
    <div
      class="fade-up itbkk-modal-setting flex flex-col w-[75%] min-w-[320px] h-auto max-w-[600px] p-6 rounded-lg bg-white shadow-xl"
    >
      <div class="border-b pb-3 border-gray-300 text-2xl font-bold flex items-center justify-between">
        <p>Create Your Board</p>
      </div>

      <div class="mt-4">
        <div class="flex justify-between items-center mb-3">
          <p class="text-lg font-semibold">Name</p>
          <p class="text-gray-400 text-sm">{{ boardName.length }}/120</p>
        </div>

        <input
          v-model="boardName"
          type="text"
          @input="handleCreateBoard"
          maxlength="120"
          placeholder="Your board name here"
          class="w-full bg bg-white border-2 border-gray-300 rounded-md h-12 px-4 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition duration-200"
        />

        <div class="flex justify-end gap-4 mt-6">
          <button
            @click="saveBoard(boardName)"
            :class="isDisable ? 'opacity-50 cursor-not-allowed' : ''"
            :disabled="isDisable"
            class="w-24 h-10 font-semibold text-white bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Save
          </button>

          <button
            @click="closeModal"
            class="w-24 h-10 font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
