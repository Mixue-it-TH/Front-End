<script setup>
import BoardHandle from "./BoardHandle.vue"
import { useRoute } from "vue-router"
import { ref } from "vue"
import { handleRequestWithTokenRefresh } from "@/util/handleRequest"
import CollaboratorModal from "../collaborator/CollaboratorModal.vue"
import {
  addCollaborator,
  changeAccessCollaborator,
  getCollaborators,
  removeCollaborator
} from "@/util/accountFetchUtil"
import { useCollaborator } from "@/store/collaborator"
import { useAlert } from "@/store/alert"
import { useAccount } from "@/store/account"

const emit = defineEmits(["cancle", "save"])
const route = useRoute()
const accountStore = useAccount()
const collabStore = useCollaborator()
const alertManagement = useAlert()
const showDeleteModal = ref(false)
const boardDetail = ref({})
const mode = ref("")

function leaveHandler(board) {
  boardDetail.value = board
  mode.value = "leave"
  showDeleteModal.value = true
}

function closeModal(isClose) {
  boardDetail.value = {}
  showDeleteModal.value = isClose
}
async function confirmHandeler(oid, board) {
  if (mode.value === "leave") {
    const response = await handleRequestWithTokenRefresh(
      removeCollaborator,
      board.id,
      accountStore.getData().oid
    )
    if (response.access_right) {
      collabStore.leaveBoard(board.id)
      showDeleteModal.value = false
      boardDetail.value = {}
      alertManagement.statusHandler(
        "success",
        `You leave the ${board.name} board now XD`
      )
    } else {
      alertManagement.statusHandler(
        "error",
        `There is a problem please try again later`
      )
    }
  }
}
</script>

<template>
  <Teleport to="body" v-if="showDeleteModal">
    <CollaboratorModal
      @cancel="closeModal"
      @confirm="confirmHandeler"
      :objectDetail="boardDetail"
      :mode="mode"
    />
  </Teleport>
  <div>
    <BoardHandle @leave="leaveHandler" />
  </div>
</template>

<style scoped></style>
