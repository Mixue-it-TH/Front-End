import {ref, watch} from "vue";
import {useAlert} from "../store/alert";

export function useCheckPrivate() {
  const alertManagement = useAlert();
  const isPrivate = ref(false);

  const checkLocalStorage = () => {
    isPrivate.value = localStorage.getItem("isPrivate") !== null; // เปลี่ยนเป็น Boolean
  };

  watch(isPrivate, (newValue) => {
    if (newValue) {
      alertManagement.statusHandler(
        "error",
        "Access denied, you do not have permission to view this page."
      );
      localStorage.removeItem("isPrivate");
    }
  });

  return {
    checkLocalStorage,
    isPrivate,
  };
}
