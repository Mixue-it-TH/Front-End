<script setup>
import { ref } from 'vue';
import { useTasks } from '@/store/task';

const emit = defineEmits(["cancel", "save"]);
const prop = defineProps({
  isLimit: {
    type: Boolean,
  },
  limitMaximum: {
    type: Number
  }
},)
const amountMaximum = ref(prop.limitMaximum)
console.log(amountMaximum.value);
const isEnable = ref(prop.isLimit)
</script>
<template>
  <div class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto">
    <div class="fade-up flex justify-center items-center w-[100%] h-[100%]">
      <div class="itbkk-modal-setting flex flex-col w-[75%] h-[60%] rounded-[15px] bg bg-white">
        <div class="">
          <p class="text-black text-3xl pl-4 pt-5">Status Setting
          </p>
          <div class="border-b-2 border-gray-300 mt-5"></div>
        </div>
        <div class="w-full">
          <div>
            <p class="px-4 pt-5 ml-5 text-black text-xl"> User can limit the number of task in a status by setting the
              Maximum tasks in each status<br>(except"No Status"and"Done"statuses) </p>
          </div>
          <div class="mt-10">
            <div class="mt-5 ml-10">
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="itbkk-limit-task sr-only peer" v-model="isEnable" />

                <div
                  class=" relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  <p class="text-black text-lg"> Limit task in this status </p> <p v-if="isEnable" class="text-red-600">The Kanban board will limit the number of tasks in each status to {{ amountMaximum }}.</p>
                </span>
              </label>
            </div>
            <div class="flex pt-5">
              <p class="pl-10 pt-2 text-black text-lg font-semibold">Maximum tasks</p>
              <div>
                <input class="itbkk-max-task mb-5 ml-5 p-2.5 w-50px text-sm text-gray-900 rounded-lg border border-gray-200
                 focus:ring-blue-500 focus:border-blue-500 bg-white dark:border-gray-400 dark:placeholder-gray-black
                  dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" type="number"
                  v-model="amountMaximum"></input>
              </div>
            </div>

          </div>
        </div>

        <div class="mt-auto mb-8 mr-5  ">
          <div class="flex flex-row-reverse">
            <div class="">
              <button class="itbkk-button itbkk-button-cancel 
                    border-gray-400 border w-[80px] h-[40px] font-[600] text-gary-800
                     bg bg-red-600 text-white hover:bg-red-400 rounded-lg 
                     mr-5" @click="$emit('cancel', false)"> cancle </button>
            </div>
            <div class="">
              <button class="itbkk-button itbkk-button-confirm border-gray-400 border disabled w-[65px] h-[40px] font-[600] 
                      text-white bg bg-green-500 hover:bg-green-400 rounded-lg mr-5"
                @click="[$emit('save', isEnable, amountMaximum)]"> save </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>