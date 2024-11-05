<script setup>
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import ListCollaborator from "./ListCollaborator.vue";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import CollaboratorAddModal from "./CollaboratorAddModal.vue";
import CollaboratorModal from "./CollaboratorModal.vue";
import { changeAccessCollaborator, removeCollaborator } from "@/util/accountFetchUtil";
import { useCollaborator } from "@/store/collaborator";
import { useAlert } from "@/store/alert";
import ToolTipOwnerBtn from "../Ui/ToolTipOwnerBtn.vue";
import { useAccount } from "@/store/account";
import { addInvitation, declineInvitation } from "@/util/inviteApi";

const emit = defineEmits(["cancle", "save"]);
const route = useRoute();
const collabStore = useCollaborator();
const alertManagement = useAlert();
const showCollaboratorModal = ref(false);
const showDeleteModal = ref(false);
const collabDetail = ref({});
const mode = ref("");
const accountStore = useAccount();
const permission_owner = computed(() => accountStore.isOwner);

async function addUserCollaborator(access, email) {
  const response = await handleRequestWithTokenRefresh(addInvitation, email, access, route.params.id);

  if (response.boardId) {
    const newCollab = {
      oid: response.oid,
      status: response.status,
      accessRight: response.accessRight,
      email: response.collaboratorEmail,
      name: response.collaboratorName,
    };
    collabStore.addNewCollaborator(newCollab);
    closeAddModal();
    alertManagement.statusHandler("success", "You add new Collaborator successfull");
  } else if (response.status === 409) {
    alertManagement.statusHandler("error", "This user email already be collaborator");
  } else if (response.status === 404) {
    alertManagement.statusHandler("error", "The user does not exist");
  } else if (response.status === 403) {
    closeAddModal();

    alertManagement.statusHandler("error", "You don't have permission to add board collaborator");
  }
}

function closeAddModal(isClose) {
  showCollaboratorModal.value = isClose;
}

function deleteModalHandler(collaboratorDetail) {
  collabDetail.value = collaboratorDetail;
  mode.value = "delete";
  showDeleteModal.value = true;
}
function closeModal(isClose) {
  if (mode.value === "edit") {
    console.log("detail", collabDetail.value);

    const oldAccess = collabDetail.value.accessRight === "READ" ? "WRITE" : "READ";
    collabStore.changeAccess(collabDetail.value.oid, oldAccess);
  }
  collabDetail.value = {};
  showDeleteModal.value = isClose;
}

async function confirmHandeler(oid, collabDetail) {
  let response;

  if (mode.value === "delete" || mode.value === "leave") {
    const isInvitation = collabDetail.status === "PENDING";

    if (isInvitation) {
      response = await handleRequestWithTokenRefresh(declineInvitation, route.params.id, oid);
    } else {
      response = await handleRequestWithTokenRefresh(removeCollaborator, route.params.id, oid);
    }

    if (response.ok) {
    } else if (response.status === 404) {
      alertManagement.statusHandler("error", `${collabDetail.user.userName} is not a collaborator`);
      showDeleteModal.value = false;
      collabDetail.value = {};
    } else if (response.status === 403) {
      alertManagement.statusHandler("error", "You do not have permission to remove this collaborator");
    }
    collabStore.deleteCollaborator(oid);
    showDeleteModal.value = false;
    collabDetail.value = {};
    alertManagement.statusHandler("success", "Removed the collaborator from the table");
  } else {
    const oldAccess = collabDetail.access_right === "READ" ? "WRITE" : "READ";
    response = await handleRequestWithTokenRefresh(changeAccessCollaborator, route.params.id, collabDetail, oid);

    if (response.ok) {
      collabStore.changeAccess(oid, collabDetail.access_right);
      collabDetail.value = {};
    } else if (response.status === 404) {
      collabStore.changeAccess(oid, oldAccess);
      alertManagement.statusHandler("error", `${collabDetail.user.userName} is not a collaborator`);
      showDeleteModal.value = false;
      collabDetail.value = {};
    } else if (response.status === 403) {
      collabStore.changeAccess(oid, oldAccess);
      alertManagement.statusHandler("error", "You do not have permission to change access rights");
    }
    showDeleteModal.value = false;
    alertManagement.statusHandler("success", "Changed access rights successfully");
  }
}

function editModalHandler(collaboratorDetail) {
  collabDetail.value = collaboratorDetail;
  mode.value = "edit";
  showDeleteModal.value = true;
}
function leaveModalHandler(collaboratorDetail) {
  collabDetail.value = collaboratorDetail;
  mode.value = "leave";
  showDeleteModal.value = true;
}
</script>

<template>
  <Teleport to="body" v-if="showCollaboratorModal">
    <CollaboratorAddModal @cancle="closeAddModal" @save="addUserCollaborator" />
  </Teleport>

  <div class="pt-[20px] flex justify-end">
    <ToolTipOwnerBtn>
      <button
        :disabled="!permission_owner"
        :class="!permission_owner ? 'disabled opacity-50' : ''"
        @click="showCollaboratorModal = !showCollaboratorModal"
        class="bg-white text-black font-semibold px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Invite Collaborator
      </button>
    </ToolTipOwnerBtn>
  </div>

  <Teleport to="body" v-if="showDeleteModal">
    <CollaboratorModal @cancel="closeModal" @confirm="confirmHandeler" :objectDetail="collabDetail" :mode="mode" />
  </Teleport>

  <div>
    <ListCollaborator @delete="deleteModalHandler" @edit="editModalHandler" @leave="leaveModalHandler" />
  </div>
</template>

<style scoped></style>
