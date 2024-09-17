<script setup>
import { RouterLink } from "vue-router"
import Listmodel from "@/components/Ui/ListModel.vue"

const emit = defineEmits(["delete"])
const props = defineProps({
  listTasks: {
    type: Array
  }
})
</script>

<template>
  <router-link
    :to="{ name: 'taskAdd' }"
    class="invisible mobile-L:visible absolute left-0 bottom-0 mb-[20px] ml-[20px]"
  >
    <div
      class="flex justify-center items-center w-[60px] h-[60px] rounded-[50%] bg-[#0058DD] border-2 shadow-xl"
    >
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
        <line
          fill="none"
          stroke="#F3F3F3"
          stroke-miterlimit="10"
          stroke-width="4"
          x1="9"
          x2="41"
          y1="25"
          y2="25"
        />
        <line
          fill="none"
          stroke="#F3F3F3"
          stroke-miterlimit="10"
          stroke-width="4"
          x1="25"
          x2="25"
          y1="9"
          y2="41"
        />
      </svg>
    </div>
  </router-link>
  <div class="mt-[20px] text-gray-700 min-w-[740px]">
    <div
      class="flex justify-between items-center w-[100%] px-[20px] min-h-[45px] font-[550]"
    >
      <div class="w-[10%] mobile-L:w-[5%]">
        <p>No</p>
      </div>
      <div class="w-[45%] px-[15px]">
        <p>Title</p>
      </div>
      <div class="w-[14%] tablet:mr-[40px]">
        <p>Status</p>
      </div>
      <div class="w-[35%]">
        <p class="">Assignees</p>
      </div>
    </div>
    <router-link :to="{ name: 'taskAdd' }" class="mobile-L:hidden">
      <div
        class="transition itbkk-button-add flex items-center min-h-[55px] mb-[5px] px-[15px] border-dashed border-[3px] hover:bg-white border-[#FFCB45] rounded-[8px]"
      >
        <div class="flex flex-row w-[50%]">
          <div class="mr-[10px]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6L12 18"
                stroke="#E2A300"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M18 12L6 12"
                stroke="#E2A300"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="font-[430] pt-0.5">Add New Task</div>
        </div>
      </div>
    </router-link>

    <Listmodel :jobs="listTasks" v-if="listTasks.length != 0">
      <template #default="slotprop">
        <div
          class="transition flex justify-between w-[100%] min-h-[55px] px-[28px] py-[10px] mb-[3px] break-all border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] hover:drop-shadow-2xl"
        >
          <router-link
            :to="{ name: 'taskDetail', params: { taskId: slotprop.job.id } }"
            class="w-full h-full"
          >
            <div class="flex w-full min-h-[55px]">
              <div class="w-[10%] mobile-L:w-[3%] font-[350]">
                <p class="m-[auto]">
                  {{ slotprop.key + 1 }}
                </p>
              </div>
              <div class="w-[45%]">
                <div class="itbkk-title px-[15px] font-[430]">
                  {{ slotprop.job.title }}
                </div>
              </div>
              <div class="w-[13%] transition-icon duration-100">
                <div
                  class="min-w-[95px] max-w-[120px] w-[90%] rounded-[5px] py-[3px] flex items-center justify-center"
                  :style="{
                    backgroundColor: slotprop.job.status.statusColor
                  }"
                >
                  <p class="itbkk-status text-white">
                    {{ slotprop.job.status.name }}
                  </p>
                </div>
              </div>
              <div class="ml-[20px] w-[25%] font-[350] tablet:pl-[15px]">
                <p
                  class="itbkk-assignees"
                  :class="{
                    'italic text-gray-500': !slotprop.job.assignees
                  }"
                >
                  {{
                    slotprop.job.assignees
                      ? slotprop.job.assignees
                      : "Unassigned"
                  }}
                </p>
              </div>
            </div>
          </router-link>
          <div
            class="itbkk-button-action dropdown dropdown-end dropdown-hover z-[1]"
          >
            <div
              tabindex="0"
              role="button"
              class="btn m-1 z-[1] bg bg-gray-[#A9A9A9]"
            >
              <svg
                width="7"
                height="30"
                viewBox="0 0 7 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="3.5" cy="3.5" r="3.5" fill="#969696" />
                <circle cx="3.5" cy="26.5" r="3.5" fill="#969696" />
                <circle cx="3.5" cy="14.8335" r="3.5" fill="#969696" />
              </svg>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-[5] bg bg-gray-[#A9A9A9]"
            >
              <router-link
                :to="{ name: 'taskEdit', params: { taskId: slotprop.job.id } }"
              >
                <li class="itbkk-button-edit flex flex-row">
                  <a class="px-5"
                    >Edit
                    <img class="px-0" src="/image/edit-icon.png" width="25px"
                  /></a>
                </li>
              </router-link>
              <div>
                <li
                  class="itbkk-button-delete flex flex-row w-full"
                  @click="emit('delete', slotprop.job, slotprop.key + 1)"
                >
                  <a class="px-5 text-red-500"
                    >Delete<img
                      class="px-0"
                      src="/image/delete-image.png"
                      width="25px"
                  /></a>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </template>
    </Listmodel>
    <div
      v-else
      class="w-[100%] border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] min-h-[45px] flex items-center justify-center"
    >
      <div class="m-[auto]">NO TASK LIST</div>
    </div>
  </div>
</template>

<style scoped></style>
