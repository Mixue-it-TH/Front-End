<script setup>
import { ref } from "vue";
const currentMode = ref("");
</script>

<template>
  <div
    class="bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] flex items-center justify-center font-noto"
  >
    <div
      class="itbkk-modal-alert fade-up itbkk-modal-setting flex flex-col w-[90%] min-w-[300px] max-w-[600px] rounded-lg bg-white shadow-lg overflow-hidden"
    >
      <div class="p-5 text-center">
        <h2 class="text-3xl text-black font-bold">
          Board Visibility Changed!!!
        </h2>
        <div class="itbkk-message">
          <p class="text-black font-semibold text-xl mt-2">
            Do you want to change board visibility ?
          </p>
        </div>
      </div>
      <div class="flex justify-end gap-2 p-5">
        <button
          class="itbkk-button itbkk-button-confirm w-[80px] h-[40px] font-bold text-white bg-green-500 hover:bg-green-400 rounded-lg transition duration-200"
          @click="[$emit('save', currentMode)]"
        >
          Confirm
        </button>
        <button
          class="itbkk-button itbkk-button-cancel w-[80px] h-[40px] font-bold bg-red-600 text-white hover:bg-red-500 rounded-lg transition duration-200"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
