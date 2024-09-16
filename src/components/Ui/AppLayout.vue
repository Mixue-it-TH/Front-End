<script setup>
import { useTasks } from "@/store/task"
import Navbar from "../Navbar/Navbar.vue"
import { useStatus } from "@/store/status"
import { onMounted, ref } from "vue"
import {
  getStatusList,
  getTaskList,
  getBoardIdByUserOIDs
} from "@/util/fetchUtils"
import { useAccount } from "@/store/account"
import { useRoute } from "vue-router"
const taskManagement = useTasks()
const statusManagement = useStatus()
const accountStore = useAccount()
const isLoaded = ref(false)
const route = useRoute()

onMounted(async () => {
  const token = localStorage.getItem("token")
  const boardId = localStorage.getItem("boardId")
  if (token) {
    accountStore.setisLogin(true)
    accountStore.decodedToken(token)
    accountStore.setBoardId(boardId)
  }
  if (boardId) {
    const listStatuses = await getStatusList()
    const listTasks = await getTaskList()

    if (listStatuses.status !== 400) statusManagement.addStatuses(listStatuses)
    if (listTasks.status !== 400) taskManagement.addTasks(listTasks)
  }

  isLoaded.value = true
})
</script>

<template>
  <Navbar v-if="isLoaded" />
  <RouterView v-if="isLoaded" />
</template>

<style scoped></style>
