<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import TooltipBtn from "../Ui/TooltipBtn.vue";
import trimText from "@/compasable/trimText";
import convertName from "@/compasable/convertName";
import randomColor from "@/compasable/randomColor";

const emit = defineEmits(["leave"]);

const props = defineProps({
  board: {
    type: Object,
  },
});

const inputRef = ref(null);

function triggerFileUpload() {
  inputRef.value.click();
}

const color = randomColor();
</script>
<template>
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
          <div class="itbkk-board-name font-bold mb-[5px] text-nowrap">{{ trimText(board?.name, 30) }}</div>
        </TooltipBtn>
        <div class="itbkk-owner-name text-[14px]">
          {{ board.ownerName ? "Owner:" : "Create by:" }}
          <span class="font-400">{{ convertName(board?.owner?.name ? board.owner.name : board.ownerName) }}</span>
        </div>
      </div>
      <div class="flex mt-auto">
        <div v-if="board.collab" @click="$emit('leave', board)" class="duration-200 hover:font-[500] cursor-pointer">
          Leave
        </div>
        <RouterLink class="ml-auto duration-200 hover:font-[500]" :to="{ name: 'boardTask', params: { id: board.id } }">
          <div>View board</div>
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
