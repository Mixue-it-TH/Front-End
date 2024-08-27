<script setup>
import {useStatus} from "@/store/status";
import {useTasks} from "@/store/task";
import {useAccount} from "@/store/account";
import {getStatusList, getTaskList} from "@/util/fetchUtils";
import {onMounted, ref} from "vue";
import router from "@/router";

const emit = defineEmits(["alert"]);

const accountStore = useAccount();
const taskManagement = useTasks();
const statusManagement = useStatus();
const isCraeted = ref(false);

onMounted(async () => {
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    accountStore.setisLogin(true);
    accountStore.decodedToken(token);
  }

  isCraeted.value = true; // Simulate check is board is craeted

  // if board craeted Fetch Data
  const listStatuses = await getStatusList(
    import.meta.env.VITE_BASE_URL + "/statuses"
  );
  const listTasks = await getTaskList(import.meta.env.VITE_BASE_URL + "/tasks");

  // Assign value to global management
  statusManagement.addStatuses(listStatuses);
  taskManagement.addTasks(listTasks);

  if (isCraeted.value) router.push("/board/777");
});

function alertMessage(type, message) {
  emit("alert", type, message);
}
</script>

<template>
  <button v-if="!isCraeted">Create new Board</button>
  <RouterView @alert="alertMessage"></RouterView>
</template>

<style scoped></style>
