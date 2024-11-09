import { defineStore } from "pinia";
import { ref } from "vue";

export const useInvite = defineStore("invite", () => {
  const invitationList = ref([]);

  function getInvitations() {
    return invitationList.value;
  }

  function changeAccess(oid, newAccess) {
    const index = invitationList.value.findIndex((invite) => invite.oid === oid);
    if (index !== -1) {
      invitationList.value[index] = {
        ...invitationList.value[index],
        accessRight: newAccess,
      };
    }
  }

  return {
    getInvitations,
    changeAccess,
  };
});
