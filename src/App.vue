<script setup>
import {RouterView} from "vue-router";
import AlertMessage from "./components/Ui/AlertMessage.vue";
import {useAlert} from "./store/alert";
import {onBeforeMount, onMounted, ref} from "vue";

const alertManagement = useAlert();
const isPrivate = ref(localStorage.getItem("isPrivate") === "true");
const {showAlertModal, message, statusType} = alertManagement.getAlertData();

const checkLocalStorage = () => {
  console.log(isPrivate.value);

  if (isPrivate.value) {
    alertManagement.statusHandler(
      "error",
      "Access denied, you do not have permission to view this page."
    );
    localStorage.removeItem("isPrivate");
  }
};

let intervalId;

onMounted(() => {
  intervalId = setInterval(checkLocalStorage, 500);
});

onBeforeMount(() => {
  clearInterval(intervalId);
});
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
