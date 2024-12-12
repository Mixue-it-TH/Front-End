<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useTasks } from "@/store/task";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import { getEnableLimit } from "@/util/fetchUtils";
import TooltipBtn from "../Ui/TooltipBtn.vue";
import trimText from "@/compasable/trimText";
import convertName from "@/compasable/convertName";
import randomColor from "@/compasable/randomColor";
import SidebarBoard from "../Ui/SidebarBoard.vue";

const emit = defineEmits(["leave"]);

const props = defineProps({
  board: {
    type: Object,
  },
});
const taskManagement = useTasks();
const inputRef = ref(null);
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

function triggerFileUpload() {
  inputRef.value.click();
}

async function handleSelectBoard(boardId) {
  const boardSelected = props.board.id === boardId;
  const isEnbleLimit = await handleRequestWithTokenRefresh(getEnableLimit, boardId);
  taskManagement.setLimitMaximumTask(isEnbleLimit.limitMaximumTask, isEnbleLimit.noOfTasks);
}

const color = randomColor();
</script>
<template>
  <div
    class="fixed right-5 bottom-5 flex justify-center items-center w-[60px] h-[60px] rounded-[50%] bg-secondary border-2 shadow-xl cursor-pointer invisible mobile-L:visible z-[20]"
  >
    <div @click="toggleSidebar" aria-label="Open settings">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-8 h-8 text-accent">
        <path
          fill="currentColor"
          d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
        />
      </svg>
    </div>
  </div>

  <SidebarBoard :is-open="isSidebarOpen" @close="closeSidebar" @active="closeSidebar" />

  <div
    class="bg bg-white flex flex-col w-auto h-[225px] rounded-[10px] duration-300 transform hover:scale-[101%] hover:shadow-xl"
  >
    <div
      class="flex flex-col px-[20px] pb-[10px] h-[50%] bg rounded-t-[10px] cursor-pointer hover:show-svg"
      :class="`${color.bg_color}`"
      @click="triggerFileUpload"
    >
      <div v-if="board?.owner?.name" class="svg-container m-auto mt-[40px] duration-200">
        <div class="">
          <label for="file-upload" class="cursor-pointer">
            <svg
              class="svg-icon"
              style="width: 30px; height: 30px; vertical-align: middle; fill: white; overflow: hidden"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M160 128A96 96 0 0 0 64 224v576A96 96 0 0 0 160 896h262.72a374.464 374.464 0 0 1-25.216-64H160a31.872 31.872 0 0 1-32-32v-59.264l227.52-256.512L430.016 562.56c10.752-19.008 23.232-36.992 37.248-53.504L353.92 389.76 128 644.224V224c0-17.728 14.272-32 32-32h704c17.728 0 32 14.272 32 32v198.72c22.72 11.776 44.48 25.536 64 41.792V224A96 96 0 0 0 864 128zM704 256c-35.2 0-64 28.8-64 64s28.8 64 64 64 64-28.8 64-64-28.8-64-64-64z m32 192C577.28 448 448 577.28 448 736S577.28 1024 736 1024s288-129.28 288-288S894.72 448 736 448z m0 64c124.032 0 224 100.032 224 224 0 124.032-100.032 224-224 224A223.616 223.616 0 0 1 512 736C512 611.968 612.032 512 736 512zM704 576v128H576v64h128v128h64v-128h128v-64h-128V576z"
                fill=""
              />
            </svg>
          </label>
          <input id="file-upload" ref="inputRef" type="file" class="hidden" />
        </div>
      </div>
      <div
        class="itbkk-board-visibility itbkk-access-right mt-auto bg bg-red-200 rounded-[30px] overflow-hidden px-[8px] py-[3px] text-white w-fit"
        :class="board.visibility === 'PUBLIC' ? `${color.PUBLIC}` : `${color.PRIVATE}`"
      >
        {{ board?.accessRight ? board.accessRight : board.visibility }}
      </div>
    </div>
    <div class="flex flex-col h-[50%] px-[15px] py-[10px] pb-[20px]">
      <div>
        <TooltipBtn :data="board?.name" :access="true">
          <div class="itbkk-board-name font-bold mb-[5px] text-nowrap text-left">
            {{ board?.status ? trimText(board?.name, 15) : trimText(board?.name, 30) }}
            <span v-if="board?.status" class="text-red-500">(pending invite)</span>
          </div>
        </TooltipBtn>
        <div class="itbkk-owner-name text-[14px]">
          {{ board?.owner?.oid ? "Craete by:" : "Owner:" }}
          <span class="font-400">{{ convertName(board?.owner?.name ? board.owner.name : board.owner) }}</span>
        </div>
      </div>
      <div class="flex mt-auto">
        <div v-if="board.collab" @click="$emit('leave', board)" class="duration-200 hover:font-[500] cursor-pointer">
          Leave
        </div>
        <RouterLink
          v-if="!board?.status"
          @click="handleSelectBoard(board.id)"
          class="ml-auto duration-200 hover:font-[500]"
          :to="{ name: 'boardTask', params: { id: board.id } }"
        >
          <div>View board</div>
        </RouterLink>
        <RouterLink
          v-else
          class="ml-auto duration-200 hover:font-[500]"
          :to="{ name: 'invite', params: { id: board.id } }"
        >
          Accept/Decline
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.svg-container {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.hover\:show-svg:hover .svg-container {
  opacity: 1;
  transform: translateY(0);
}

/* .uploadfile {
  display: block;
  visibility: hidden;
  width: 0;
  height: 0;
} */
</style>
