<script setup>
import { computed, onMounted, ref } from "vue";
import { useTasks } from "@/store/task";
import { deleteTaskById, getTaskList, getStatusList, getBoardByBoardid } from "@/util/fetchUtils";
import { useAlert } from "@/store/alert";
import DeleteTaskModal from "./DeleteTaskModal.vue";
import ListTask from "./ListTask.vue";
import { useRoute, useRouter } from "vue-router";
import { useStatus } from "@/store/status";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import { useAccount } from "@/store/account";
import getAccessToken from "@/util/tokenUtil";
import { getCollaboratorsByCollabId } from "@/util/accountFetchUtil";

const accountStore = useAccount();
const alertManagement = useAlert();
const taskManagement = useTasks();
const showDeleteModal = ref(false);
const taskDetails = ref({});
const taskNumber = ref();
const router = useRouter();
const route = useRoute();
const statusManagement = useStatus();
const permission = computed(() => accountStore.permission);
const isLoadaed = ref(false);
const isFetching = ref(false);

onMounted(async () => {
  ////// REFACTOR SOON จุดนี้ก็ต้อง handle  ///////
  if (!getAccessToken()) {
    accountStore.setVisibility(true, null);
  } else {
    const board = await getBoardByBoardid(route.params.id);
    // PBI 25
    if (board.status === 403) {
      accountStore.setVisibility("PRIVATE");
    } else {
      accountStore.setVisibility(board[0]?.visibility === "PUBLIC" ? true : false, board[0]?.owner.oid);
    }
  }

  ///// REFACTOR SOON ///////

  const listTasks = await handleRequestWithTokenRefresh(getTaskList, route.params.id);

  const listStatuses = await handleRequestWithTokenRefresh(getStatusList, route.params.id);
  if (listTasks.status === 404) {
    router.push("/board");
  } else if (listTasks.status === 401) {
    router.push("/login");
  }
  if (listTasks.status !== 400) {
    if (taskManagement.getAllTask().length === 0) {
      taskManagement.clearAllTask();
      taskManagement.addTasks(listTasks);
    }
  } else {
    taskManagement.clearAllTask();
  }

  if (statusManagement.getAllStatus().length === 0) {
    statusManagement.addStatuses(listStatuses);
  }
  isLoadaed.value = true;
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
  isFetching.value = true;
  const response = await handleRequestWithTokenRefresh(deleteTaskById, id, route.params.id);
  if (response.ok) {
    taskManagement.deleteTask(id);
    showDeleteModal.value = false;
    taskDetails.value = {};
    alertManagement.statusHandler("success", "The task has been deleted successfully");
  } else if (response.status === 404) {
    alertManagement.statusHandler("error", "An error has occurred, the task does not exist");
    taskManagement.deleteTask(id);
    showDeleteModal.value = false;
    taskDetails.value = {};
  }
  isFetching.value = false;
}
</script>

<template>
  <Teleport to="body" v-if="showDeleteModal">
    <DeleteTaskModal
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
      :taskDetails="taskDetails"
      :taskNumber="taskNumber"
      :isLoading="isFetching"
    />
  </Teleport>

  <div>
    <ListTask
      v-if="isLoadaed"
      @delete="deleteModalHandler"
      :listTasks="taskManagement.getAllTask()"
      :permission="permission"
    />

    <RouterView v-if="isLoadaed" />
  </div>
</template>

<style scoped></style>
