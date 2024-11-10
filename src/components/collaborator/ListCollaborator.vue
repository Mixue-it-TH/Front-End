<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { getCollaborators } from "@/util/accountFetchUtil";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { useStatus } from "@/store/status.js";
import ListModel from "../Ui/ListModel.vue";
import TooltipBtn from "../Ui/TooltipBtn.vue";
import { useAccount } from "@/store/account";
import { useCollaborator } from "@/store/collaborator";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import ToolTipOwnerBtn from "../Ui/ToolTipOwnerBtn.vue";

const emit = defineEmits(["delete", "edit", "leave"]);
const accountStore = useAccount();
const collabStore = useCollaborator();
const route = useRoute();
const router = useRouter();
const access = ref("");
const permission_owner = computed(() => accountStore.isOwner);
const permission = computed(() => accountStore.permission);

onMounted(async () => {
  const collaboratorList = await handleRequestWithTokenRefresh(getCollaborators, route.params.id);

  if (collaboratorList.collaborators) {
    collabStore.setCollaborator(collaboratorList.collaborators, collaboratorList.invitations);
  }

  if (collaboratorList?.status === 403) {
    router.push("/board");
  }
});

function changeAccessRight(collabDetail) {
  collabStore.changeAccess(collabDetail.oid, collabDetail.accessRight);
  emit("edit", collabDetail);
}

function collabUserHandler(userDetail) {
  if (accountStore.getData().email === userDetail.email) {
    emit("leave", userDetail);
  } else {
    emit("delete", userDetail);
  }
}

function handlerToolTips() {
  const leaveAccess = collabStore.getCollaborator().find((collab) => collab.oid === accountStore.getData().oid);
  if (leaveAccess) {
    if (!permission.value) {
      accountStore.permission = true;
    }
    return false;
  } else {
    return true;
  }
}
</script>

<template>
  <div>
    <div class="mt-[20px] text-gray-700 min-w-[740px]">
      <div class="flex justify-between items-center w-full px-5 min-h-[45px] font-medium">
        <div class="w-[10%] text-center">
          <p>No</p>
        </div>
        <div class="w-[35%] text-center">
          <p>Name</p>
        </div>
        <div class="w-[25%] text-center">
          <p>E-mail</p>
        </div>
        <div class="w-[20%] text-center">
          <p>Access Right</p>
        </div>
        <div class="w-[10%] text-center">
          <p>Action</p>
        </div>
      </div>

      <ListModel :jobs="collabStore.getCollaborator()" v-if="collabStore.getCollaborator().length !== 0">
        <template #default="slotprop">
          <div
            class="transition itbkk-item flex justify-between w-full min-h-[55px] px-[20px] py-[10px] mb-[3px] border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] hover:drop-shadow-2xl"
          >
            <div class="w-[10%] text-center">
              <p>{{ slotprop.key + 1 }}</p>
            </div>

            <div class="w-[35%]">
              <p class="itbkk-status-name text-center">
                {{ slotprop.job.name }}
                <span v-if="slotprop.job?.status" class="text-red-500 font-[500]">(pending invite)</span>
              </p>
            </div>

            <div class="w-[25%]">
              <p class="itbkk-status-email text-center">
                {{ slotprop.job.email }}
              </p>
            </div>

            <div class="w-[20%] text-center">
              <TooltipBtn :access="!permission_owner && accountStore.getData().email !== slotprop.job.email">
                <select
                  v-model="slotprop.job.accessRight"
                  @change="changeAccessRight(slotprop.job)"
                  :disabled="!permission_owner && accountStore.getData().email !== slotprop.job.email"
                  class="w-full text-white bg-black border-2 border-gray-300 rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option :value="'WRITE'">WRITE</option>
                  <option :value="'READ'">READ</option>
                </select>
              </TooltipBtn>
            </div>

            <div class="w-[10%] flex justify-center">
              <TooltipBtn :access="!permission_owner && accountStore.getData().email !== slotprop.job.email">
                <div class="flex gap-4 justify-center">
                  <button
                    @click="collabUserHandler(slotprop.job)"
                    :disabled="!permission_owner && accountStore.getData().email !== slotprop.job.email"
                    :class="
                      !permission_owner && accountStore.getData().email !== slotprop.job.email
                        ? 'disabled opacity-40'
                        : ''
                    "
                    class="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow-lg hover:scale-105 transition duration-200 ease-in-out border border-transparent"
                  >
                    {{ accountStore.getData().oid === slotprop.job.oid ? "Leave" : "Remove" }}
                  </button>
                </div>
              </TooltipBtn>
            </div>
          </div>
        </template>
      </ListModel>

      <div
        v-else
        class="w-[100%] border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] min-h-[45px] flex items-center justify-center"
      >
        <div class="m-[auto]">NO Collaborator</div>
      </div>
    </div>
  </div>
  <RouterView />
</template>
