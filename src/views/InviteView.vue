<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import Spinner from "@/components/Ui/Spinner.vue";
import { useAlert } from "@/store/alert";
import { addCollaborator } from "@/util/accountFetchUtil";
import { declineInvitation, getInvitationByBoardId } from "@/util/inviteApi";

const route = useRoute();
const router = useRouter();

const alertManagement = useAlert();
const invitation = ref();
const isLoading = ref(true);

onMounted(async () => {
  // IF NO TOKEN
  const token = localStorage.getItem("token");
  if (token === null) {
    router.go(-1);
    localStorage.setItem("invitationLogIn", route.fullPath);
    localStorage.setItem("isPrivate", "You need to Login to view this page.");
  }

  // NORMAL FLOW
  const boardId = route.params.id;
  const data = await handleRequestWithTokenRefresh(getInvitationByBoardId, boardId);

  // HANDLE STATUS CODE
  if (data.status === 404) {
    if (token) router.push("/board");
    if (!token) router.go(-1);
    localStorage.setItem("isPrivate", "Sorry, we coldn't find the invitation to this board.");
  }

  console.log(data);

  invitation.value = data;
  isLoading.value = false;
});

async function acceptHandler() {
  const data = await handleRequestWithTokenRefresh(addCollaborator, route.params.id);
  if (data?.oid) router.push(`/board/${route.params.id}`);
}

async function declineHandler() {
  const data = await handleRequestWithTokenRefresh(declineInvitation, route.params.id, invitation.value.oid);

  // HANDLER STATUS
  if (data.status === 200) router.push("/board");
}
</script>

<template>
  <Spinner v-if="isLoading" />
  <div v-else class="text-[50px]">
    {{ invitation.inviterName }} has invited you to collaborate with {{ invitation.accessRight }} access right on
    {{ invitation.boardName }}
    board with
    <span @click="acceptHandler" class="hover:text-green-500">Accept invitation</span>
    or
    <span @click="declineHandler" class="hover:text-red-500">Decline</span>
  </div>
</template>

<style scoped></style>
