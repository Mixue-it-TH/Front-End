<script setup>
import { useRouter } from "vue-router"
import { ref } from "vue"
import Board from "./Board.vue"

const router = useRouter()
const emit = defineEmits(["cancel", "save"])
const prop = defineProps({
  name: {
    type: String
  }
})
const boardName = ref(prop.name)
</script>

<template>
  <div
    class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto"
  >
    <div class="flex justify-center items-center w-[100%] h-[100%]">
      <div
        class="fade-up itbkk-modal-setting flex flex-col w-[75%] min-w-[300px] h-[50%] max-w-[600px] min-h-[200px] rounded-[8px] mobile-L:mb-[70px] mobile-L:h-[490px] bg bg-white"
      >
        <div
          class="border-b-2 border-black text-xl h-[70px] font-semibold flex items-center justify-between"
        >
          <p class="pl-[5px] pt-[10px]">Create Your Board</p>
        </div>
        <div class="mx-[5px]">
          <p class="font-bold">Name</p>
          <input
            v-model="boardName"
            type="text"
            placeholder="Your board name here"
            class="itbkk-board-name mt-[10px] w-[100%] border-[2px] border-gray-200 rounded-[4px] bg-white placeholder-slate-200 h-[50px] pl-[10px]"
          />

          <div class="flex flex-row-reverse mt-[10px]">
            <button
              @click="$emit('cancel', false)"
              class="itbkk-button itbkk-button-cancel w-[80px] h-[40px] font-[600] text-gary-800 bg bg-red-600 text-white hover:bg-red-400 rounded-lg mr-5"
            >
              cancel
            </button>
            <button
              @click="$emit('save', boardName)"
              class="itbkk-button itbkk-button-confirm disabled w-[65px] h-[40px] font-[600] text-white bg bg-green-500 hover:bg-green-400 rounded-lg mr-5"
            >
              save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
