<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import Spinner from "@/components/Ui/Spinner.vue";
import { useAlert } from "@/store/alert";
import { addCollaborator } from "@/util/accountFetchUtil";
import { declineInvitation, getInvitationByBoardId } from "@/util/inviteApi";
import { useCollaborator } from "@/store/collaborator";

const route = useRoute();
const router = useRouter();

const alertManagement = useAlert();
const collaboratorManagemant = useCollaborator();
const invitation = ref();
const isLoading = ref(true);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (token === null) {
    router.go(-1);
    localStorage.setItem("invitationLogIn", route.fullPath);
    localStorage.setItem("isPrivate", "You need to Login to view this page.");
  }

  const boardId = route.params.id;
  const data = await handleRequestWithTokenRefresh(getInvitationByBoardId, boardId);

  if (data.status === 404) {
    if (token) router.push("/board");
    if (!token) router.go(-1);
    localStorage.setItem("isPrivate", "Sorry, we couldn't find the invitation to this board.");
  }

  invitation.value = data;
  isLoading.value = false;
});

async function acceptHandler() {
  const data = await handleRequestWithTokenRefresh(addCollaborator, route.params.id);
  if (data?.oid) router.push(`/board/${route.params.id}`);
}

async function declineHandler() {
  const data = await handleRequestWithTokenRefresh(declineInvitation, route.params.id, invitation.value.oid);

  if (data.status === 200) router.push("/board");
}
</script>

<template>
  <Spinner v-if="isLoading" />
  <div v-else class="flex flex-col items-center justify-center h-screen p-6 bg-gray-50 text-gray-800 text-center">
    <h1 class="text-2xl font-medium mb-4">{{ invitation.inviterName }} has invited you</h1>
    <p class="text-md mb-6">
      to collaborate with
      <strong class="text-red-500">{{ invitation.accessRight }}</strong>
      access on the
      <strong>{{ invitation.boardName }}</strong>
      board.
    </p>
    <div class="flex space-x-4">
      <button
        @click="acceptHandler"
        class="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
      >
        Accept
      </button>
      <button
        @click="declineHandler"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
      >
        Decline
      </button>
    </div>
  </div>
</template>

<style scoped></style>
