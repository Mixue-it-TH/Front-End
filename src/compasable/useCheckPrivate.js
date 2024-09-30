import {ref, watchEffect} from "vue";
import {useAlert} from "../store/alert";

export function useCheckPrivate() {
  const alertManagement = useAlert();
  const isPrivate = ref(false);

  const checkLocalStorage = () => {
    isPrivate.value = localStorage.getItem("isPrivate") !== null;
  };

  checkLocalStorage();

  watchEffect(() => {
    isPrivate.value = localStorage.getItem("isPrivate") !== null;

    if (isPrivate.value) {
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
