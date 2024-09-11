import {defineStore, acceptHMRUpdate} from "pinia";
import {ref} from "vue";

export const useAlert = defineStore("alertManager", () => {
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
  function getAlertData() {
    return {message, statusType, showAlertModal};
  }

  return {statusHandler, getAlertData, closeStatusModal};
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlert, import.meta.hot));
}
