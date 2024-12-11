<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useStatus } from "@/store/status.js";
import ListModel from "../Ui/ListModel.vue";
import TooltipBtn from "../Ui/TooltipBtn.vue";
import { useAccount } from "@/store/account";

const emit = defineEmits(["delAction"]);
const prop = defineProps({
  limitExceed: {
    type: Array,
  },
});

const accountStore = useAccount();
const statusManagement = useStatus();
const mode = ref("read");
const permission = computed(() => accountStore.permission);

function modalHandler(id, action) {
  if (action === "add") {
    mode.value = "add";
  } else if (action === "read") {
  } else if (action === "edit") {
    mode.value = "edit";
  }
}

function delBtnHandler(id, tranferId) {
  emit("delAction", id, tranferId);
}
</script>

<template>
  <router-link
    :to="{ name: 'statusAdd' }"
    class="invisible mobile-L:visible absolute left-0 bottom-0 mb-[20px] ml-[20px]"
    :class="!permission ? 'pointer-events-none' : ''"
  >
    <div class="flex justify-center items-center w-[60px] h-[60px] rounded-[50%] bg-[#0058DD] border-2 shadow-xl">
      <!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
      <svg
        enable-background="new 0 0 50 50"
        height="50px"
        id="Layer_1"
        version="1.1"
        viewBox="0 0 50 50"
        width="50px"
        xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <rect fill="none" height="50" width="50" />
        <line fill="none" stroke="#F3F3F3" stroke-miterlimit="10" stroke-width="4" x1="9" x2="41" y1="25" y2="25" />
        <line fill="none" stroke="#F3F3F3" stroke-miterlimit="10" stroke-width="4" x1="25" x2="25" y1="9" y2="41" />
      </svg>
    </div>
  </router-link>
  <div class="text-secondary-700 mt-[20px]">
    <div>
      <div class="flex justify-between items-center gap-[5px] w-[100%] px-[20px] min-h-[45px] font-[550]">
        <div class="w-[10%]">
          <p>No</p>
        </div>
        <div class="w-[30%] px-[15px]">
          <p>Name</p>
        </div>
        <div class="w-[50%]">
          <p>Description</p>
        </div>
        <div class="w-[10%]">
          <p>Action</p>
        </div>
      </div>
    </div>
    <TooltipBtn>
      <router-link
        :to="{ name: 'statusAdd' }"
        class="mobile-L:hidden"
        :class="!permission ? 'pointer-events-none' : ''"
      >
        <div
          class="transition itbkk-button-add flex items-center min-h-[55px] w-[95vw] mb-[5px] px-[15px] bg bg-primary hover:bg-gray-300 border-dashed border-[3px] border-[#FFCB45] rounded-[8px]"
          :class="!permission ? 'opacity-50' : ''"
        >
          <div class="flex flex-row w-[50%]">
            <div class="mr-[10px]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6L12 18" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
                <path d="M18 12L6 12" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <div class="font-[430]" @click="modalHandler(null, 'add')">Add New Status</div>
          </div>
        </div>
      </router-link>
    </TooltipBtn>

    <ListModel :jobs="statusManagement.getAllStatus()">
      <template #default="slotprop">
        <div
          class="transition itbkk-item flex justify-between w-[100%] min-h-[55px] px-[20px] py-[10px] mb-[3px] break-all border border-[#DDDDDD] rounded-[10px] bg-accent reak-all hover:drop-shadow-2xl"
        >
          <router-link
            :to="{
              name: 'statusDetail',
              params: { statusId: slotprop.job.id },
            }"
            class="w-full"
          >
            <div class="w-[100%] flex gap-[5px]">
              <div class="w-[11%] font-[350]">
                <p class="m-[auto]">{{ slotprop.key + 1 }}</p>
              </div>
              <div class="w-[33%]">
                <div
                  class="text-white min-w-[80px] max-w-[150px] px-[10px] rounded-[5px] m-[auto] inline-block transition-icon duration-100 hover:drop-shadow-2xl"
                  :style="{ backgroundColor: slotprop.job.statusColor }"
                >
                  <p class="itbkk-status-name">{{ slotprop.job.name }}</p>
                </div>
              </div>

              <div class="w-[50%]">
                <div class="">
                  <p
                    :class="{
                      'italic text-gray-500': !slotprop.job.description,
                    }"
                    class="itbkk-status-description"
                  >
                    {{ slotprop.job.description ? slotprop.job.description : "No description is provided" }}
                  </p>
                </div>
              </div>
            </div>
          </router-link>
          <div class="w-[12%]">
            <TooltipBtn v-if="slotprop.job.name !== 'No Status' && slotprop.job.name !== 'Done'">
              <div class="flex tablet:flex-col w-[100px]" :class="!permission ? 'pointer-events-none opacity-50' : ''">
                <router-link
                  :to="{
                    name: 'statusEdit',
                    params: { statusId: slotprop.job.id },
                  }"
                  class="itbkk-button-edit"
                >
                  <div class="transition-icon w-[50px] px-[6px] rounded-[10px] hover:drop-shadow-2xl duration-150">
                    Edit
                    <img src="/image/edit-icon.png" class="w-[30px]" />
                  </div>
                </router-link>
                <div
                  class="transition-icon itbkk-button-deletew-[50px] text-red-500 rounded-[10px] hover:drop-shadow-2xl duration-150"
                >
                  Delete
                  <img
                    src="/image/delete-image.png"
                    class="w-[30px] ml-[5px] cursor-pointer"
                    @click="delBtnHandler(slotprop.job, slotprop.job.id)"
                  />
                </div>
              </div>
            </TooltipBtn>
            <div v-else class=""><p class="text-sm text-gray-600">default status</p></div>
          </div>
        </div>
      </template>
    </ListModel>
  </div>
</template>

<style scoped></style>
