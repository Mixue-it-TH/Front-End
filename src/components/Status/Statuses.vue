<script setup>
import { onMounted, ref } from "vue"
import { useTasks } from "@/store/task"
import { useStatus } from "@/store/status"
import ListStatus from "./ListStatus.vue"
import DeleteStatusModal from "./DeleteStatusModal.vue"
import { deleteStatusById, deleteTaskAndTranfer } from "@/util/statusFetchUtils"
import { getStatusList } from "@/util/fetchUtils"
import { useLimit } from "@/store/limitReached"
import { useAlert } from "@/store/alert"
import { useRoute, useRouter } from "vue-router"

const alertManagement = useAlert()
const taskManagement = useTasks()
const statusManagement = useStatus()
const limitManagement = useLimit()
const statusDetail = ref()
const statusId = ref()
const delState = ref(false)
const stage = ref("delete")
const arrTranfer = ref([])
const amoutTasks = ref(0)
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const listStatuses = await getStatusList(route.params.id)
  if (listStatuses === 404) {
    router.push("/login")
  }
  if (statusManagement.getAllStatus().length === 0) {
    statusManagement.addStatuses(listStatuses)
  }
})

function delAction(status, id) {
  statusDetail.value = status
  const taskRelation = taskManagement.getAllTask().filter((task) => {
    return task.status.id === statusDetail.value.id
  })
  if (taskRelation.length >= 1) {
    stage.value = "tranfer"
    amoutTasks.value = taskRelation.length
    arrTranfer.value = statusManagement.getAllStatus().filter((st) => {
      return st.id !== id
    })
  }
  statusId.value = id
  delState.value = true
}

async function delConfirm(id, tranferId) {
  let delRespond
  if (stage.value === "delete") {
    delRespond = await deleteStatusById(id, route.params.id)
    if (delRespond.ok) {
      alertManagement.statusHandler(
        "success",
        "The status has been deleted successfully"
      )
      closeDelModal(false)
    } else if (delRespond.status === 404) {
      alertManagement.statusHandler(
        "error",
        "An error has occurred, the status does not exist"
      )
      closeDelModal(false)
    } else if (delRespond.status === 401) {
      alertManagement.statusHandler(
        "error",
        `For security reasons, your session has expired. Please log back in.`
      )
      accountStore.unAuthorizeHandle()
    }
    statusManagement.deleteStatus(id)
  } else if (stage.value === "tranfer") {
    delRespond = await deleteTaskAndTranfer(id, tranferId, route.params.id)
    if (delRespond.ok) {
      statusManagement.deleteStatus(id)
      taskManagement.tranferStatus(
        id,
        statusManagement.getStatusById(tranferId)
      )
      alertManagement.statusHandler(
        "success",
        `${amoutTasks.value} task(s) have been tranfer and the status has been deleted`
      )
      closeDelModal(false)
    } else if (delRespond.status === 404 || delRespond.status === 400) {
      const status = statusManagement.getStatusById(tranferId)
      alertManagement.statusHandler(
        "error",
        `Cannot transfer to ${status.name} status since it will exceed the limit. Please choose another status to transfer to.`
      )
    } else if (delRespond.status === 401) {
      alertManagement.statusHandler(
        "error",
        `For security reasons, your session has expired. Please log back in.`
      )
      accountStore.unAuthorizeHandle()
    }
  }
}

function closeDelModal(isclose) {
  delState.value = isclose
  stage.value = "delete"
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
    <ListStatus @delAction="delAction" />
    <RouterView />
  </div>
</template>

<style scoped></style>
