<script setup>
import {useStatus} from "@/store/status";
import {useTasks} from "@/store/task";
import {useAccount} from "@/store/account";
import {getStatusList, getTaskList} from "@/util/fetchUtils";
import {onMounted, ref} from "vue";
import router from "@/router";

const accountStore = useAccount();
const taskManagement = useTasks();
const statusManagement = useStatus();
const isCraeted = ref(false);

onMounted(async () => {
  const token = localStorage.getItem("token");
  const boardId = localStorage.getItem("boardId");

  if (token && boardId) {
    accountStore.setisLogin(true);
    accountStore.decodedToken(token);
    accountStore.setBoardId(boardId);
  }

  // if board craeted Fetch Data
  const listStatuses = await getStatusList();

  const listTasks = await getTaskList();

  // Assign value to global management
  statusManagement.addStatuses(listStatuses);
  taskManagement.addTasks(listTasks);

  if (boardId !== undefined) {
    router.push(`/board/${accountStore.getBoardId()}`);
    isCraeted.value = true;
  }
});
</script>

<template>
  <button v-if="!isCraeted">Create new Board</button>
  <RouterView></RouterView>
</template>

<style scoped></style>
