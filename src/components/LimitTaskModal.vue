<script setup>
const emit = defineEmits(["cancel"]);
</script>

<template>
  <div
    class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto"
  >
    <div class="fade-up flex justify-center items-center w-[100%] h-[100%]">
      <div
        class="itbkk-modal-setting flex flex-col w-[75%] h-[90%] rounded-[15px] bg bg-white"
      >
        <div class="">
          <p class="text-black text-3xl pl-4 pt-5">Status Setting</p>
          <div class="border-b-2 border-black mt-5"></div>
        </div>
        <div class="w-full">
          <div>
            <p class="px-4 pt-5 text-black">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum
              nisi error libero voluptate accusantium aperiam, fugiat ratione
              consequuntur ex rem maxime ipsa, temporibus delectus quidem?
              Molestias, at repellat. Quae natus eaque veniam praesentium quas
              ipsum quisquam delectus aut tempora illo.>
            </p>
          </div>

          <div class="border border-black">
            <div class="mt-5 ml-4">
              <label class="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer" checked />
                <div
                  class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                ></div>
                <span
                  class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  ><p class="text-black text-lg">
                    Limit task in this status
                  </p></span
                >
              </label>
            </div>
            <div class="flex pt-5">
              <p class="pl-5 pt-2 text-black">Maximum tasks</p>
              <div>
                <textarea
                  class="itbkk-max-task ml-5 border-black rounded-10px bg-slate-300"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto border border-black">
          <div class="flex flex-row-reverse">
            <div class="">
              <button
                class="itbkk-button itbkk-button-cancel flex w-[80px] h-[40px] font-[600] text-gary-800 bg bg-red-600 hover:bg-gray-300 rounded-lg mr-5"
                @click="$emit('cancel', false)"
              >
                cancle
              </button>
            </div>
            <div class="">
              <button
                class="itbkk-button itbkk-button-confirm disabled flex w-[65px] h-[40px] font-[600] text-white bg bg-green-500 hover:bg-green-600 rounded-lg mr-5"
                @click="$emit('cancel', false)"
              >
                save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
