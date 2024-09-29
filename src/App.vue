<script setup>
import { RouterView } from "vue-router";
import AlertMessage from "./components/Ui/AlertMessage.vue";
import { useAlert } from "./store/alert";

const alertManagement = useAlert();

const { showAlertModal, message, statusType } = alertManagement.getAlertData();
</script>

<template>
  <div class="w-[auto] h-screen overflow-auto bg bg-[#F4F4F4]">
    <AlertMessage
      v-if="showAlertModal"
      @close="alertManagement.closeStatusModal"
      :message="message"
      :type="statusType"
    />
    <div
      class="w-full h-[auto] bg-[#F4F4F4] text-gray-700 px-[2%] py-[25px] font-nonto"
    >
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
