<script setup>
import { RouterLink } from "vue-router";
import Listmodel from "@/components/Ui/ListModel.vue";
import TooltipBtn from "../Ui/TooltipBtn.vue";

const emit = defineEmits(["delete"]);
const props = defineProps({
  listTasks: {
    type: Array,
  },
  permission: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <router-link
    :to="{ name: 'taskAdd' }"
    class="invisible mobile-L:visible absolute left-0 bottom-0 mb-[20px] ml-[20px]"
    :class="!permission ? 'pointer-events-none' : ''"
  >
    <div class="flex justify-center items-center w-[60px] h-[60px] rounded-[50%] bg-[#0058DD] border-2 shadow-xl">
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

  <div class="mt-[20px] text-secondary">
    <div
      class="flex justify-between mobile-L:px-2 mobile-L:text-xs items-center w-[100%] px-[20px] min-h-[45px] font-[550]"
    >
      <div class="w-[10%] mobile-L:w-[5%]">
        <p>No</p>
      </div>
      <div class="w-[37%] px-[15px] mobile-L:w-[10%]">
        <p>Title</p>
      </div>
      <div class="w-[14%] tablet:mr-[40px] mobile-L:w-[7%] mobile-L:pl-4">
        <p>Status</p>
      </div>
      <div class="w-[13%] tablet:w-[20%]">
        <p>Attachments</p>
      </div>
      <div class="w-[28%] mobile-L:pl-7">
        <p class="">Assignees</p>
      </div>
    </div>

    <TooltipBtn>
      <router-link :to="{ name: 'taskAdd' }" class="mobile-L:hidden" :class="!permission ? 'pointer-events-none' : ''">
        <div
          class="transition itbkk-button-add disabled flex items-center min-h-[55px] mb-[5px] px-[15px] w-[95vw] border-dashed border-[3px] hover:bg-gray-300 border-[#FFCB45] rounded-[8px]"
          :class="!permission ? 'opacity-50' : ''"
        >
          <div class="flex flex-row w-[50%]">
            <div class="mr-[10px]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6L12 18" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
                <path d="M18 12L6 12" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <div class="font-[430] pt-0.5">Add New Task</div>
          </div>
        </div>
      </router-link>
    </TooltipBtn>
    <Listmodel :jobs="listTasks" v-if="listTasks.length != 0">
      <template #default="slotprop">
        <div
          class="itbkk-item transition flex justify-between w-[100%] min-h-[55px] px-[28px] mobile-L:px-4 py-[10px] mb-[3px] break-all border border-[#DDDDDD] rounded-[10px] bg-accent hover:drop-shadow-2xl"
        >
          <router-link :to="{ name: 'taskDetail', params: { taskId: slotprop.job.id } }" class="w-full h-full">
            <div class="flex w-full min-h-[55px]">
              <div class="w-[11%] laptop-L:w-[12%] mobile-L:w-[3%] font-[350] mobile-L:w-[4%]">
                <p class="m-[auto]">
                  {{ slotprop.key + 1 }}
                </p>
              </div>
              <div class="w-[36%] laptop-L:w-[37%] mobile-L:w-[45%] mobile-L:pl-5">
                <div class="itbkk-title font-[430]">
                  {{ slotprop.job.title }}
                </div>
              </div>
              <div
                class="w-[16%] laptop-L:w-[20%] mobile-L:text-sm mobile-L:w-[20%] mobile-L:min-w-[90px] mobile-L:ml-1 mobile-L:mb-10 mobile-L:py-1 flex items-center transition-icon duration-100"
              >
                <div
                  class="min-w-[50px] ml-30 laptop-L:text-red-400 max-w-[100px] w-auto rounded-[4px] py-[6px] px-[12px] flex items-center justify-center"
                  :style="{
                    backgroundColor: slotprop.job.status.statusColor,
                  }"
                >
                  <p class="itbkk-status text-white">
                    {{ slotprop.job.status.name }}
                  </p>
                </div>
              </div>

              <div class="w-[10%] b mobile-L:w-[30%] mobile-L:-auto mobile-L:pl-5 tablet:pl-10">
                <p class="">
                  {{ slotprop.job.files?.length ? slotprop.job.files.length : "-" }}
                </p>
              </div>

              <div
                class="ml-[20px] w-[25%] font-[350] tablet:pl-[15px] mobile-L:w-[50%] mobile-L:pl-15 mobile-L:text-xs"
              >
                <p
                  class="itbkk-assignees"
                  :class="{
                    'italic text-gray-500': !slotprop.job.assignees,
                  }"
                >
                  {{ slotprop.job.assignees ? slotprop.job.assignees : "Unassigned" }}
                </p>
              </div>
            </div>
          </router-link>

          <div class="itbkk-button-action dropdown dropdown-end dropdown-hover z-[1] mobile-L:w-[5%]">
            <div
              tabindex="0"
              role="button"
              class="btn m-1 z-[1] bg bg-primary border border-white hover:bg-gray-100 hover:border-gray-200"
            >
              <svg width="7" height="30" viewBox="0 0 7 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="3.5" cy="3.5" r="3.5" fill="#969696" />
                <circle cx="3.5" cy="26.5" r="3.5" fill="#969696" />
                <circle cx="3.5" cy="14.8335" r="3.5" fill="#969696" />
              </svg>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-white rounded-box w-[180px] hover:absolute z-[10] bg bg-gray-[#A9A9A9] focus:bg-gray-200"
            >
              <TooltipBtn>
                <router-link
                  :to="{
                    name: 'taskEdit',
                    params: { taskId: slotprop.job.id },
                  }"
                >
                  <li
                    class="itbkk-button-edit flex flex-row"
                    :class="!permission ? 'opacity-50 pointer-events-none disabled' : ''"
                  >
                    <a class="px-5 text-black">
                      Edit
                      <img class="px-0" src="/image/edit-icon.png" width="25px" />
                    </a>
                  </li>
                </router-link>
              </TooltipBtn>

              <TooltipBtn>
                <div>
                  <li
                    class="itbkk-button-delete flex flex-row w-full"
                    :class="!permission ? 'opacity-50 pointer-events-none disabled' : ''"
                    @click="emit('delete', slotprop.job, slotprop.key + 1)"
                  >
                    <a class="px-5 text-red-500">
                      Delete
                      <img class="px-0" src="/image/delete-image.png" width="25px" />
                    </a>
                  </li>
                </div>
              </TooltipBtn>
            </ul>
          </div>
        </div>
      </template>
    </Listmodel>
    <div
      v-else
      class="w-[100%] border border-[#DDDDDD] rounded-[10px] bg-accent min-h-[45px] flex items-center justify-center"
    >
      <div class="m-[auto]">NO TASK LIST</div>
    </div>
  </div>
</template>

<style scoped></style>
