import {ref, onMounted} from "vue";
import {useAlert} from "../store/alert";

export function useCheckPrivate() {
  const alertManagement = useAlert();
  const isPrivateAlertShown = ref(false);

  onMounted(() => {
    const isPrivate = localStorage.getItem("isPrivate");

    if (isPrivate) {
      alertManagement.statusHandler(
        "error",
        "Access denied, you do not have permission to view this page."
      );
      localStorage.removeItem("isPrivate");
      isPrivateAlertShown.value = true;
    }
  });

  return {
    isPrivateAlertShown,
  };
}
