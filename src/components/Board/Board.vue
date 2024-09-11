<script setup>
import { ref, onMounted } from "vue"
import { RouterLink, RouterView, useRouter } from "vue-router"
import { useStatus } from "@/store/status"
import { useTasks } from "@/store/task"
import { useAccount } from "@/store/account"
import {
  getStatusList,
  getTaskList,
  getBoardIdByUserOIDs,
  createBoard
} from "@/util/fetchUtils"
import CreateBoardModal from "./CreateBoardModal.vue"
import BoardHandle from "./BoardHandle.vue"

const taskManagement = useTasks()
const statusManagement = useStatus()
const router = useRouter()
const isCreated = ref(false)
const isClicked = ref(false)
const boardList = ref([])
const accountStore = useAccount()

async function boardSelect(isCreate, boardId) {
  isCreated.value = isCreate
  localStorage.setItem("boardId", boardId)
  taskManagement.clearAllTask()
  statusManagement.clearAllStatus()
  const listStatuses = await getStatusList()
  const listTasks = await getTaskList()
  statusManagement.addStatuses(listStatuses)
  taskManagement.addTasks(listTasks)
}
</script>

<template>
  <div>
    <BoardHandle @isCreate="boardSelect" />
  </div>
</template>

<style scoped></style>
