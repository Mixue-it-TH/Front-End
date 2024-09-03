<script setup>
import {RouterView} from "vue-router";
import {ref} from "vue";
import AlertMessage from "./components/Ui/AlertMessage.vue";

const message = ref("");
const statusType = ref("success");
const showAlertModal = ref(false);

function closeStatusModal(isClose) {
  showAlertModal.value = isClose;
  message.value = "";
  statusType.value = "";
}
function statusHandler(type, text) {
  message.value = text;
  statusType.value = type;
  showAlertModal.value = true;
  let seconds = 10;
  let timer = setInterval(function () {
    seconds--;
    if (seconds < 0) {
      clearInterval(timer);
      closeStatusModal(false);
    }
  }, 1000);
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
    <div
      class="w-full h-[auto] bg-[#F4F4F4] text-gray-700 px-[2%] py-[25px] font-nonto"
    >
      <RouterView @alert="statusHandler" />
    </div>
  </div>
</template>

<style scoped></style>
