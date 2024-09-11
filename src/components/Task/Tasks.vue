<script setup>
import { onMounted, ref } from "vue"
import { useTasks } from "@/store/task"
import { deleteTaskById } from "@/util/fetchUtils"
import { useAlert } from "@/store/alert"
import DeleteTaskModal from "./DeleteTaskModal.vue"
import ListTask from "./ListTask.vue"
import { useRouter } from "vue-router"
import { useStatus } from "@/store/status"
import { getStatusList, getTaskList } from "@/util/fetchUtils"

const alertManagement = useAlert()
const taskManagement = useTasks()
const showDeleteModal = ref(false)
const taskDetails = ref({})
const taskNumber = ref()
const router = useRouter()
const statusManagement = useStatus()

function deleteModalHandler(tasks, number) {
  taskDetails.value = tasks
  taskNumber.value = number
  showDeleteModal.value = true
}

function closeDeleteModal(isClose) {
  taskDetails.value = {}
  showDeleteModal.value = isClose
}

async function confirmDelete(id) {
  const response = await deleteTaskById(id)
  if (typeof response === "object") {
    taskManagement.deleteTask(id)
    showDeleteModal.value = false
    taskDetails.value = {}
    alertManagement.statusHandler(
      "success",
      "The task has been deleted successfully"
    )
  } else if (response === 404) {
    alertManagement.statusHandler(
      "error",
      "An error has occurred, the task does not exist"
    )
    taskManagement.deleteTask(id)
    showDeleteModal.value = false
    taskDetails.value = {}
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
    <RouterView />
  </div>
</template>

<style scoped></style>
