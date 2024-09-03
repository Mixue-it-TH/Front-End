import {defineStore, acceptHMRUpdate} from "pinia";
import {ref} from "vue";

export const useLimit = defineStore("limitmanager", () => {
  const limitReached = ref([]);

  function getLimitReached() {
    return limitReached.value;
  }

  function addLimitReached(limits) {
    limits.forEach((limit) => {
      limitReached.value.push(limit);
    });
  }

  function clearLimitReached() {
    limitReached.value = [];
  }

  return {getLimitReached, addLimitReached, clearLimitReached};
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLimit, import.meta.hot));
}
