<script setup>
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

const color = randomColor();
</script>

<template>
  <div
    class="bg bg-white flex flex-col w-auto h-[225px] rounded-[10px] duration-300 transform hover:scale-[101%] hover:shadow-xl"
  >
    <div class="flex flex-col px-[20px] pb-[10px] h-[50%] bg rounded-t-[10px]" :class="`${color.bg_color}`">
      <div
        class="itbkk-board-visibility itbkk-access-right mt-auto bg bg-red-200 rounded-[30px] overflow-hidden px-[8px] py-[3px] text-white w-fit"
        :class="board.visibility === 'PUBLIC' ? `${color.PUBLIC}` : `${color.PRIVATE}`"
      >
        {{ board?.access_right ? board.access_right : board.visibility }}
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
        <div v-if="board.ownerName" @click="$emit('leave', board)" class="cursor-pointer">Leave</div>
        <RouterLink class="ml-auto duration-200 hover:font-[500]" :to="{ name: 'boardTask', params: { id: board.id } }">
          <div>View board</div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
