<script setup>
import {ref} from "vue";
import {useTasks} from "@/store/task";
import {useStatus} from "@/store/status";
import ListStatus from "./ListStatus.vue";
import DeleteStatusModal from "./DeleteStatusModal.vue";
import {deleteStatusById, deleteTaskAndTranfer} from "@/util/statusFetchUtils";
import {useLimit} from "@/store/limitReached";

const emit = defineEmits(["alert"]);

const taskManagement = useTasks();
const statusManagement = useStatus();
const limitManagement = useLimit();
const statusDetail = ref();
const statusId = ref();
const delState = ref(false);
const stage = ref("delete");
const arrTranfer = ref([]);
const amoutTasks = ref(0);

function alertMessage(type, message) {
  emit("alert", type, message);
}

function delAction(status, id) {
  statusDetail.value = status;
  const taskRelation = taskManagement.getAllTask().filter((task) => {
    return task.status.id === statusDetail.value.id;
  });
  if (taskRelation.length >= 1) {
    stage.value = "tranfer";
    amoutTasks.value = taskRelation.length;
    arrTranfer.value = statusManagement.getAllStatus().filter((st) => {
      return st.id !== id;
    });
  }
  statusId.value = id;
  delState.value = true;
}

async function delConfirm(id, tranferId) {
  let delRespond;
  if (stage.value === "delete") {
    delRespond = await deleteStatusById(
      import.meta.env.VITE_BASE_URL + "/statuses",
      id
    );
    if (delRespond.ok) {
      emit("alert", "success", "The status has been deleted successfully");
      closeDelModal(false);
    } else if (delRespond.status === 404) {
      emit(
        "alert",
        "error",
        "An error has occurred, the status does not exist"
      );
      closeDelModal(false);
    }
    statusManagement.deleteStatus(id);
  } else if (stage.value === "tranfer") {
    delRespond = await deleteTaskAndTranfer(
      import.meta.env.VITE_BASE_URL + "/statuses",
      id,
      tranferId
    );
    if (delRespond.ok) {
      statusManagement.deleteStatus(id);
      taskManagement.tranferStatus(
        id,
        statusManagement.getStatusById(tranferId)
      );
      emit(
        "alert",
        "success",
        `${amoutTasks.value} task(s) have been tranfer and the status has been deleted`
      );
      closeDelModal(false);
    } else if (delRespond.status === 404 || delRespond.status === 400) {
      const status = statusManagement.getStatusById(tranferId);
      emit(
        "alert",
        "error",
        `Cannot transfer to ${status.name} status since it will exceed the limit. Please choose another status to transfer to.`
      );
    }
  }
}

function closeDelModal(isclose) {
  delState.value = isclose;
  stage.value = "delete";
}
</script>

<template>
  <Teleport to="body" v-if="delState">
    <DeleteStatusModal
      :stDetail="statusDetail"
      :stage="stage"
      :tranferData="arrTranfer"
      :amountTasks="amoutTasks"
      :limitExceed="limitManagement.getLimitReached()"
      @cancel="closeDelModal"
      @confirm="delConfirm"
    />
  </Teleport>
  <div>
    <ListStatus @alert="alertMessage" @delAction="delAction" />
    <RouterView @alert="alertMessage" />
  </div>
</template>

<style scoped></style>
