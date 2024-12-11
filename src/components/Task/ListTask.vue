<script setup>
import { RouterLink } from "vue-router";
import Listmodel from "@/components/Ui/ListModel.vue";
import TooltipBtn from "../Ui/TooltipBtn.vue";
import { useTasks } from "@/store/task";
import { ref } from "vue";
import Sidebar from "../Ui/Sidebar.vue";

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
const sortState = ref(0);
function sortTask() {
  sortState.value = taskManagement.sortTaskByStatusName(sortState.value);
}
const taskManagement = useTasks();
const hidden = ref(false);
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div
    class="fixed right-5 bottom-5 flex justify-center items-center w-[60px] h-[60px] rounded-[50%] bg-secondary border-2 shadow-xl cursor-pointer invisible mobile-L:visible"
  >
    <div @click="toggleSidebar" aria-label="Open settings">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-8 h-8 text-accent">
        <path
          fill="currentColor"
          d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
        />
      </svg>
    </div>
    <router-link
      :to="{ name: 'taskAdd' }"
      class="invisible mobile-L:visible absolute right-0 bottom-[50px] mb-[20px] ml-[20px]"
      :class="!permission ? 'pointer-events-none' : ''"
    >
      <div class="flex justify-center items-center w-[60px] h-[60px] rounded-[50%] bg-secondary border-2 shadow-xl">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-8 h-8 text-accent">
          <path
            fill="currentColor"
            d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
          />
        </svg>
      </div>
    </router-link>
  </div>

  <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" @active="closeSidebar" />

  <div class="mt-[20px] text-secondary min-w-[740px]">
    <div class="flex justify-between items-center w-[100%] px-[20px] min-h-[45px] font-[550]">
      <div class="w-[10%] mobile-L:w-[4%]">
        <p>No</p>
      </div>
      <div class="w-[37%] px-[15px]">
        <p>Title</p>
      </div>
      <div class="w-[14%] tablet:mr-[40px] flex items-center mobile-L:w-[14%] mobile-L:ml-[25px]">
        <p>Status</p>
        <div
          @click="sortTask"
          class="itbkk-status-sort h-[45px] m-[auto] cursor-pointer rounded-[4px] duration-100 ml-2"
        >
          <div v-if="sortState === 0" class="flex justify-center mt-[5px]">
            <img src="/image/up-and-down-icon.png" class="w-[30px] h-[30px]" />
          </div>
          <div v-if="sortState === 1" class="flex justify-center mt-[5.5px] mr-1">
            <img src="/image/a-z-blue.png" class="w-[30px] h-[30px]" />
          </div>
          <div v-if="sortState === 2" class="flex justify-center mt-[6px]">
            <img src="/image/z-a-blue.png" class="w-[30px] h-[30px]" />
          </div>
        </div>
      </div>

      <div class="w-[13%] mobile-L:mr-[57px]">
        <p>Attachments</p>
      </div>
      <div class="w-[28%] mobile-L:w-[25%] mobile-L:mr-[40px]">
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
          class="itbkk-item transition flex justify-between w-[100%] min-h-[55px] px-[28px] py-[10px] mb-[3px] break-all border border-[#DDDDDD] rounded-[10px] bg-accent hover:drop-shadow-2xl"
        >
          <router-link :to="{ name: 'taskDetail', params: { taskId: slotprop.job.id } }" class="w-full h-full">
            <div class="flex w-full min-h-[55px]">
              <div class="w-[10%] mobile-L:w-[3%] font-[350]">
                <p class="m-[auto]">
                  {{ slotprop.key + 1 }}
                </p>
              </div>
              <div class="w-[37%]">
                <div class="itbkk-title px-[15px] font-[430]">
                  {{ slotprop.job.title }}
                </div>
              </div>
              <div class="w-[13%] mr-[20px] transition-icon duration-100">
                <div
                  class="min-w-[95px] max-w-[120px] w-[90%] rounded-[5px] py-[3px] flex items-center justify-center"
                  :style="{
                    backgroundColor: slotprop.job.status.statusColor,
                  }"
                >
                  <p class="itbkk-status text-white">
                    {{ slotprop.job.status.name }}
                  </p>
                </div>
              </div>
              <div class="w-[13%] mobile-L:ml-[18px]">
                <p class="text-center">{{ slotprop.job.files?.length }}/10</p>
              </div>
              <div class="ml-[20px] w-[25%] font-[350] pl-[20px]">
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

          <div class="itbkk-button-action dropdown dropdown-end dropdown-hover z-[1]">
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
