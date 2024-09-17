<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useStatus } from "@/store/status"
import { useTasks } from "@/store/task"
import { useAccount } from "@/store/account"
import { getStatusList, getTaskList } from "@/util/fetchUtils"
import BoardHandle from "./BoardHandle.vue"
</script>

<template>
  <div>
    <BoardHandle />
  </div>
</template>

<style scoped></style>
