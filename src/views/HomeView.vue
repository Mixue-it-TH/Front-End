<script setup>
import router from "@/router";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { getTaskList, deleteTaskById } from "@/util/fetchUtils";
import { convertStatus } from "@/util/formatUtils";
import { getStatusList } from "@/util/statusFetchUtils";
import { useTasks } from "@/store/task.js";
import { useStatus } from "@/store/status.js";
import ListTask from "@/components/ListTask.vue";
import DeleteTaskModal from "@/components/DeleteTaskModal.vue";
import LimitTaskModal from "@/components/LimitTaskModal.vue";
import ListStatus from "@/components/ListStatus.vue";

const emit = defineEmits(["alert"]);

const taskManagement = useTasks();
const statusManagement = useStatus();
const isEmptyTask = ref(false);
const taskDetails = ref({});
const showDeleteModal = ref(false);
const showLimitModal = ref(false);
const taskNumber = ref();
const showTask = ref(true);
const toggleManage = ref(" Mannage Status");
const sortState = ref(0);
const statusFilter = ref([]);

onMounted(async () => {
  const listTasks = await getTaskList(import.meta.env.VITE_BASE_URL + "/tasks");
  const listStatuses = await getStatusList(
    import.meta.env.VITE_BASE_URL + "/statuses"
  );
  if (listTasks.length === 0) isEmptyTask.value = true;
  taskManagement.addTasks(listTasks);
  statusManagement.addStatuses(listStatuses);
  if (router.currentRoute.value.fullPath.includes("status")) toggleMode();
});

function deleteModalHandler(tasks, number) {
  taskDetails.value = tasks;
  taskNumber.value = number;
  showDeleteModal.value = true;
}
function closeDeleteModal(isClose) {
  taskDetails.value = {};
  showDeleteModal.value = isClose;
}
async function confirmDelete(id) {
  const response = await deleteTaskById(
    import.meta.env.VITE_BASE_URL + "/tasks",
    id
  );
  console.log(response);
  if (response.status === 200) {
    taskManagement.deleteTask(id);
    showDeleteModal.value = false;
    taskDetails.value = {};
    emit("alert", taskDetails.value.title, "deleted", "task");
  }
  if (response.status === 404) {
    emit("alert", taskDetails.value.title, "deleting", "task", "error");
    taskManagement.deleteTask(id);
    showDeleteModal.value = false;
    taskDetails.value = {};
  }
}
function limitModalHandler(isClose) {
  showLimitModal.value = isClose;
}

function filterSelection(statusName) {
  const isDuplicate = statusFilter.value.filter((status) => {
    console.log(status);
    return status === statusName;
  });
  if (isDuplicate.length === 0) statusFilter.value.push(statusName);
}
function filterDeleteSelection(statusName) {
  console.log(statusName);
  statusFilter.value = statusFilter.value.filter((status) => {
    return status !== statusName;
  });
}

function filterClearSelection() {
  statusFilter.value = [];
}

function toggleMode() {
  if (showTask.value) {
    showTask.value = false;
    toggleManage.value = "Home";
    if (!router.currentRoute.value.fullPath.includes("status"))
      router.push("/status");
  } else {
    showTask.value = true;
    toggleManage.value = " Mannage Status";
    router.push("/task");
  }
}
function sortTask() {
  sortState.value = taskManagement.sortTaskByStatusName(sortState.value);
}

function alertMessageHandler(title, status, data, type = "success") {
  emit("alert", title, status, data, type);
}
</script>

<template>
  <Teleport to="body" v-if="showDeleteModal">
    <DeleteTaskModal
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
      :taskDetails="taskDetails"
      :taskNumber="taskNumber"
    />
  </Teleport>
  <Teleport to="body" v-if="showLimitModal">
    <LimitTaskModal @cancel="limitModalHandler" />
  </Teleport>
  <div class="w-screen h-screen bg bg-[#F4F4F4] px-[35px] py-[25px] font-nonto">
    <div
      class="flex flex-row justify-between items-center w-[100%] h-[75px] mb-[15px]"
    >
      <div class="h-[75%] mt-[20px]">
        <h1 class="text-[24px] text-gray-700 font-[800]">
          IT-Bangmod Kradan Kanban
        </h1>
      </div>
      <div class="flex flex-row gap-[15px] h-[75%]">
        <div
          class="itbkk-manage-status itbkk-button-home cursor-pointer bg bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px] w-[200px] h-[40px] m-[7px] py-[7px] px-[5px] text-center"
          @click="toggleMode"
        >
          <h1>{{ toggleManage }}</h1>
        </div>
        <div
          class="flex justify-between w-[202px] h-[45px] px-[10px] m-[auto] bg bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px]"
        >
          <div class="dropdown dropdown-bottom text-xs font-medium">
            <div
              tabindex="0"
              role=""
              class="cursor-pointer w-full h-full flex items-center"
            >
              <div v-if="statusFilter.length === 0">Filter by status(es)</div>

              <div
                v-else
                class="flex gap-[10px] border border-blue-500 w-[150px] overflow-auto"
                tabindex="0"
                role=""
              >
                <div
                  v-for="status in statusFilter"
                  class="flex flex-row gap-[5px] w-auto relative items-center justify-center p-0.5 me-2 text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                >
                  <div class="text-gray-600 flex">
                    {{ status }}
                    <div
                      @click="filterDeleteSelection(status)"
                      class="z-[10] text-black"
                    >
                      <p class="pr-1">&nbsp;&nbsp;X</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content z-[1] menu shadow bg-base-100 rounded-[10px] w-[150px]"
            >
              <li
                v-for="status in statusManagement.getAllStatus()"
                class="break-all"
                @click="filterSelection(status.name)"
              >
                <a>{{ status.name }}</a>
              </li>
            </ul>
          </div>
          <div
            @click="filterClearSelection"
            class="flex justify-center items-center cursor-pointer"
          >
            <img src="/image/close-icon.png" class="w-[13px] h-[13px]" />
          </div>
        </div>
        <div
          @click="sortTask"
          class="itbkk-status-filter w-[45px] h-[45px] m-[auto] cursor-pointer bg bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px]"
        >
          <div class="flex justify-center mt-[5px]">
            <img src="/image/up-and-down-icon.png" class="w-[30px] h-[30px]" />
          </div>
        </div>
        <div
          @click="limitModalHandler(true)"
          class="flex justify-center items-center w-[45px] h-[45px] m-[auto] cursor-pointer border bg bg-[#F9F9F9] border-[#BDBDBD] rounded-[4px]"
        >
          <div class="flex justify-center">
            <img src="/image/setting-icon.png" class="w-[25px] h-[25px]" />
          </div>
        </div>
      </div>
    </div>
    <ListTask
      v-if="showTask"
      @delete="deleteModalHandler"
      :sortState="sortState"
    />
    <ListStatus v-else @alert="alertMessageHandler" />
  </div>
</template>

<style scoped></style>
@/store/task
