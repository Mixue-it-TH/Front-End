<script setup>
import {RouterView, useRoute} from "vue-router";
import AlertMessage from "./components/Ui/AlertMessage.vue";
import {useAlert} from "./store/alert";
import {useCheckPrivate} from "./compasable/useCheckPrivate";
import {watch} from "vue";

const alertManagement = useAlert();
const {checkLocalStorage, isPrivate} = useCheckPrivate();
const {showAlertModal, message, statusType} = alertManagement.getAlertData();
const route = useRoute();

watch(route, () => {
  checkLocalStorage();
});

checkLocalStorage();
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
      <RouterView :key="$route.fullPath" />
    </div>
  </div>
</template>

<style scoped></style>
