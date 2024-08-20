<script setup>
import { RouterView } from "vue-router"
import HomeView from "./views/HomeView.vue"
import { ref } from "vue"
import AlertMessage from "./components/AlertMessage.vue"
import LoginModal from "./components/LoginModal.vue"
const message = ref("")
const statusType = ref("success")
const showAlertModal = ref(false)

function closeStatusModal(isClose) {
  showAlertModal.value = isClose
  message.value = ""
  statusType.value = ""
}
function statusHandler(type, text) {
  message.value = text
  statusType.value = type
  showAlertModal.value = true
  let seconds = 10
  let timer = setInterval(function () {
    seconds--
    if (seconds < 0) {
      clearInterval(timer)
      closeStatusModal(false)
    }
  }, 1000)
}
</script>

<template>
  <div class="w-[auto] h-screen overflow-auto bg bg-[#F4F4F4]">
    <AlertMessage
      v-if="showAlertModal"
      @close="closeStatusModal"
      :message="message"
      :type="statusType"
    />
    <HomeView @alert="statusHandler" />
    <RouterView @alert="statusHandler" />
  </div>
</template>

<style scoped></style>
