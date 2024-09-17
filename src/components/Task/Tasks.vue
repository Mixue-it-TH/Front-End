<script setup>
import { onMounted, ref } from "vue"
import { useTasks } from "@/store/task"
import { deleteTaskById, getTaskList, getStatusList } from "@/util/fetchUtils"
import { useAlert } from "@/store/alert"
import DeleteTaskModal from "./DeleteTaskModal.vue"
import ListTask from "./ListTask.vue"
import { useRoute, useRouter } from "vue-router"
import { useStatus } from "@/store/status"

const alertManagement = useAlert()
const taskManagement = useTasks()
const showDeleteModal = ref(false)
const taskDetails = ref({})
const taskNumber = ref()
const router = useRouter()
const route = useRoute()
const statusManagement = useStatus()

onMounted(async () => {
  console.log("allTask", taskManagement.getAllTask())
  const listTasks = await getTaskList(route.params.id)
  const listStatuses = await getStatusList(route.params.id)
  console.log(listTasks)
  if (listTasks.status === 404) {
    router.push("/board")
  } else if (listTasks.status === 401) {
    router.push("/login")
  }

  if (statusManagement.getAllStatus().length === 0) {
    statusManagement.addStatuses(listStatuses)
  }
  if (taskManagement.getAllTask().length === 0) {
    console.log("555")
    taskManagement.addTasks(listTasks)
  }
})

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
  const response = await deleteTaskById(id, route.params.id)
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
