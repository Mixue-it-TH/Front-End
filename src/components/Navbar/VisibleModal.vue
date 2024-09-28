<script setup>
import {ref} from "vue";
</script>

<template>
  <div
    class="bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] flex items-center justify-center font-noto"
  >
    <div
      class="itbkk-modal-alert fade-up itbkk-modal-setting text-black flex flex-col w-[90%] min-w-[300px] max-w-[600px] rounded-lg bg-white shadow-lg overflow-hidden"
    >
      <div class="">
        <div
          class="border-b border-gray-500 px-[15px] py-[8px] mb-[15px] text-[30px] font-[500]"
        >
          <h2 class=""> Board Visibility Changed! </h2>
        </div>
        <div class="itbkk-message font-[400] px-[15px] text-[17px]">
          <p class="">
            In public, any one can view the board, task list and task detail of
            tasks in the board. Do you want to change the visibility to Public?
          </p>
        </div>
      </div>
      <div class="flex justify-end gap-2 p-5">
        <button
          class="itbkk-button itbkk-button-confirm w-[80px] h-[40px] font-bold text-white bg-green-500 hover:bg-green-400 rounded-lg transition duration-200"
          @click="[$emit('save')]"
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
