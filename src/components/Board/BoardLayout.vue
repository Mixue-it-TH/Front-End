<script setup>
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import { useCollaborator } from "@/store/collaborator";
import { useAlert } from "@/store/alert";
import { useAccount } from "@/store/account";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import { getBoardIdByUserOIDs } from "@/util/fetchUtils";
import { removeCollaborator } from "@/util/accountFetchUtil";
import CollaboratorModal from "../collaborator/CollaboratorModal.vue";
import ListModel from "../Ui/ListModel.vue";
import Board from "./Board.vue";
import Spinner from "../Ui/Spinner.vue";

const emit = defineEmits(["cancle", "save"]);
const accountStore = useAccount();
const collabStore = useCollaborator();
const alertManagement = useAlert();
const showDeleteModal = ref(false);
const isLoading = ref(false);
const boardDetail = ref({});
const mode = ref("");

onMounted(async () => {
  const boards = await handleRequestWithTokenRefresh(getBoardIdByUserOIDs);
  console.log(boards);

  if (boards.owners) {
    accountStore.setBoardList(boards.owners);
  }
  if (boards.collabs || boards.invitations) {
    collabStore.setListCollabBoard(boards.collabs, boards.invitations);
  }

  isLoading.value = true;
});

function leaveHandler(board) {
  boardDetail.value = board;
  mode.value = "leave";
  showDeleteModal.value = true;
}

function closeModal(isClose) {
  boardDetail.value = {};
  showDeleteModal.value = isClose;
}
async function confirmHandeler(oid, board) {
  if (mode.value === "leave") {
    const response = await handleRequestWithTokenRefresh(removeCollaborator, board.id, accountStore.getData().oid);
    if (response.accessRight) {
      collabStore.leaveBoard(board.id);
      showDeleteModal.value = false;
      boardDetail.value = {};
      alertManagement.statusHandler("success", `You leave the ${board.name} board now`);
    } else {
      alertManagement.statusHandler("error", `There is a problem please try again later`);
    }
  }
}
</script>

<template>
  <Teleport to="body" v-if="showDeleteModal">
    <CollaboratorModal @cancel="closeModal" @confirm="confirmHandeler" :objectDetail="boardDetail" :mode="mode" />
  </Teleport>

  <!-- LOADED PHASE -->
  <div v-if="isLoading">
    <!-- CREATE BOARD -->
    <div class="mt-[50px] flex justify-end">
      <router-link :to="{ name: 'boardAdd' }">
        <button
          class="itbkk-button-create bg-white text-black font-semibold px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
        >
          Create personal board
        </button>
      </router-link>
    </div>

    <!-- PERSONAL BOARD -->
    <div>
      <div class="itbkk-personal-item text-center p-4">
        <p class="itbkk-personal-board text-3xl font-bold text-black drop-shadow-lg">Personal Boards</p>
      </div>
      <ListModel
        class="grid grid-cols-[repeat(auto-fit,minmax(250px,330px))] gap-y-8 justify-evenly"
        :jobs="accountStore.getBoardList()"
      >
        <template #default="slotprop">
          <Board :board="slotprop.job" />
        </template>
      </ListModel>
    </div>

    <!-- COLAB BOARDS -->

    <div v-if="collabStore.getListCollabBoard().length" class="text-center p-4">
      <p class="text-3xl font-bold text-black drop-shadow-lg">Collab Boards</p>
    </div>

    <ListModel
      class="grid grid-cols-[repeat(auto-fit,minmax(250px,330px))] gap-y-8 justify-evenly"
      :jobs="collabStore.getListCollabBoard()"
    >
      <template #default="slotprop">
        <Board @leave="leaveHandler" :board="slotprop.job" />
      </template>
    </ListModel>

    <RouterView />
  </div>
  <Spinner v-else></Spinner>
</template>

<style scoped></style>
