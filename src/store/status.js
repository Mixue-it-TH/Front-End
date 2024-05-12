import { defineStore, acceptHMRUpdate, } from "pinia";
import { ref } from "vue";

export const useStatus = defineStore("statusmanager", () => {
    const statusList = ref([]);

    function getAllStatus() {
        return statusList.value
    }

    function getStatusById(id) {
        return statusList.value.find((e) => e.id === id)
    }

    function addStatus(newStatus) {
        statusList.value.push(newStatus)
    }

    function addStatuses(newStatus) {
        newStatus.forEach((newSt) => {
            this.addStatus(newSt)
        })
    }

    function editStatus(newStatus) {
        const index = statusList.value.findIndex((e) => e.id === newStatus.id)
        const currentStatus = statusList.value[index]
        statusList.value[index] = { currentStatus, ...newStatus }
    }

    function deleteStatus(statusId) {
        statusList.value.splice(
            statusList.value.findIndex((task) => task.id === statusId),
            1
        )
    }

    return { getAllStatus, getStatusById, addStatus, addStatuses, editStatus, deleteStatus };
}
);

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStatus, import.meta.hot));
}
