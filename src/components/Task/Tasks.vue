<script setup>
import {ref} from "vue";
import {useTasks} from "@/store/task";
import {deleteTaskById} from "@/util/fetchUtils";
import ListTask from "./ListTask.vue";
import DeleteTaskModal from "./DeleteTaskModal.vue";

const emit = defineEmits(["alert"]);
const taskManagement = useTasks();
const showDeleteModal = ref(false);
const taskDetails = ref({});
const taskNumber = ref();

function alertMessage(type, message) {
  emit("alert", type, message);
}

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
  if (typeof response === "object") {
    taskManagement.deleteTask(id);
    showDeleteModal.value = false;
    taskDetails.value = {};
    emit("alert", "success", "The task has been deleted successfully");
  } else if (response === 404) {
    emit("alert", "error", "An error has occurred, the task does not exist");
    taskManagement.deleteTask(id);
    showDeleteModal.value = false;
    taskDetails.value = {};
  }
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
  <div>
    <ListTask
      @delete="deleteModalHandler"
      :listTasks="taskManagement.getAllTask()"
    />
    <RouterView @alert="alertMessage" />
  </div>
</template>

<style scoped></style>
