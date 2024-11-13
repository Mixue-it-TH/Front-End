<script setup>
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import ListCollaborator from "./ListCollaborator.vue";

import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import CollaboratorAddModal from "./CollaboratorAddModal.vue";
import CollaboratorModal from "./CollaboratorModal.vue";
import { changeAccessCollaborator, removeCollaborator, getCollaborators } from "@/util/accountFetchUtil";
import { useCollaborator } from "@/store/collaborator";
import { useAlert } from "@/store/alert";
import ToolTipOwnerBtn from "../Ui/ToolTipOwnerBtn.vue";
import { useAccount } from "@/store/account";
import { useInvite } from "@/store/invite";
import { addInvitation, declineInvitation, changeAccessInvitation } from "@/util/inviteApi";
import Spinner from "../Ui/Spinner.vue";

const emit = defineEmits(["cancle", "save"]);
const route = useRoute();
const collabStore = useCollaborator();
const inviteStore = useInvite();
const alertManagement = useAlert();
const showCollaboratorModal = ref(false);
const showDeleteModal = ref(false);
const collabDetail = ref({});
const mode = ref("");
const accountStore = useAccount();
const permission_owner = computed(() => accountStore.isOwner);
const isLoading = ref(false);

async function addUserCollaborator(access, email) {
  isLoading.value = true;
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
    alertManagement.statusHandler("success", "You Send invite to Collaborator successfull");
  } else if (response.status === 409) {
    alertManagement.statusHandler("error", "This user email already be collaborator");
  } else if (response.status === 404) {
    alertManagement.statusHandler("error", "The user does not exist");
  } else if (response.status === 403) {
    closeAddModal();

    alertManagement.statusHandler("error", "You don't have permission to add board collaborator");
  }
  isLoading.value = false;
}

function closeAddModal(isClose) {
  showCollaboratorModal.value = isClose;
}

function deleteModalHandler(collaboratorDetail) {
  collabDetail.value = collaboratorDetail;
  mode.value = "delete";
  showDeleteModal.value = true;
}
function closeModal(isClose, oid, collabDetail, mode_pram) {
  if (mode_pram === "edit") {
    const accessRight = collabDetail.accessRight === "WRITE" ? "READ" : "WRITE";
    collabStore.changeAccess(oid, accessRight);
  }
  collabDetail.value = {};
  mode.value = "";
  showDeleteModal.value = isClose;
}

async function confirmHandeler(oid, collabDetail) {
  let response;
  const isInvitation = collabDetail.status === "PENDING";

  if (mode.value === "delete" || mode.value === "leave") {
    response = isInvitation
      ? await handleRequestWithTokenRefresh(declineInvitation, route.params.id, oid)
      : await handleRequestWithTokenRefresh(removeCollaborator, route.params.id, oid);

    if (response.ok) {
      alertManagement.statusHandler(
        "success",
        isInvitation
          ? `${collabDetail.name} is removed from the collaborator table`
          : "Collaborator removed from the board."
      );
    } else if (response.status === 404) {
      alertManagement.statusHandler("error", "Not a collaborator.");
    } else if (response.status === 403) {
      alertManagement.statusHandler("error", "You do not have permission to remove this collaborator.");
    } else {
      alertManagement.statusHandler("success", `${collabDetail.name} is removed from the collaborator table`);
    }

    collabStore.deleteCollaborator(oid);
    showDeleteModal.value = false;
    collabDetail.value = {};
  }

  const newAccessRight = collabDetail.accessRight === "WRITE" ? "WRITE" : "READ";

  if (mode.value !== "delete" && mode.value !== "leave") {
    response = isInvitation
      ? await handleRequestWithTokenRefresh(changeAccessInvitation, route.params.id, oid, newAccessRight)
      : await handleRequestWithTokenRefresh(changeAccessCollaborator, route.params.id, collabDetail, oid);

    if (response && response.accessRight) {
      if (isInvitation) {
        inviteStore.changeAccess(oid, "WRITE");
      } else {
        collabStore.changeAccess(oid, newAccessRight);
      }

      alertManagement.statusHandler("success", "Access right changed successfully.");
    } else if (response && response.status === 403) {
      alertManagement.statusHandler("error", "Access denied. You don't have permission to do this.");
    }
  }

  showDeleteModal.value = false;
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
  <Spinner v-if="isLoading" />
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
