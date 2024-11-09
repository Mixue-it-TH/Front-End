<script setup>
import BtnSpinner from "../Ui/BtnSpinner.vue";

const emit = defineEmits(["cancel", "confirm"]);

const props = defineProps({
  taskDetails: {
    type: Object,
  },
  taskNumber: {
    type: Number,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

console.log(props.isLoading);
</script>

<template>
  <div class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto">
    <div class="flex justify-center items-center w-screen h-screen">
      <div class="fade-up flex flex-col bg bg-white w-[45%] min-w-[300px] min-h-[250px] rounded-[7px]">
        <div class="text-[28px] font-[600] h-[40%] px-[15px] py-[10px]">Delete a Task</div>
        <div class="itbkk-message border border-gray-300 min-h-[120px] px-[15px] py-[10px] break-all">
          Do you want to delete the task number {{ taskNumber }} -
          <span class="text-red-600">"{{ taskDetails.title }}" ?</span>
        </div>
        <div class="flex flex-row justify-end items-end gap-[20px] h-[25%] mt-[auto] px-[15px] py-[10px]">
          <div
            @click="$emit('confirm', taskDetails.id)"
            :class="isLoading ? 'opacity-50 pointer-events-none' : ''"
            class="itbkk-button-confirm flex items-center justify-center h-[50px] w-[100px] text-white bg-green-500 hover:bg-green-600 rounded-[5px]"
          >
            <button v-if="!isLoading" class="w-full h-full">Confirm</button>
            <BtnSpinner v-else class="m-[auto]" />
          </div>
          <div
            class="itbkk-button-cancel flex items-center justify-center h-[50px] w-[100px] text-white bg-red-500 hover:bg-red-600 rounded-[5px]"
            @click="$emit('cancel', false)"
          >
            <button class="w-full h-full">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
