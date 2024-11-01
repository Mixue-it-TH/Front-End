<script setup>
import { computed, ref, onMounted } from "vue";
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
const access = ref(""); //ใส่เป็นค่า default ไปก่อนค่อยกลับมาแก้
const permission_owner = computed(() => accountStore.isOwner);
const permission = computed(() => accountStore.permission);

onMounted(async () => {
  const collaboratorList = await handleRequestWithTokenRefresh(getCollaborators, route.params.id);
  if (collaboratorList.collaborators) {
    collabStore.setCollaborator(collaboratorList.collaborators);
    console.log(collabStore.getListCollabBoard());
  }
  if (collaboratorList?.status === 403) {
    router.push("/board");
  }
});

function changeAccessRight(collabDetail) {
  emit("edit", collabDetail);
}

function collabUserHandler(userDetail) {
  if (accountStore.getData().email === userDetail.email) {
    emit("leave", userDetail);
  } else {
    emit("delete", userDetail);
  }
}

// ใช้งานได้เมื่อไม่ใช่เจ้าของ board แต่เป็นเจ้าของละเจ๊ง
// function handlerToolTips(userDetail) {
//   if (accountStore.getData().oid === userDetail.oid) {
//     if (!permission.value) {
//       accountStore.permission = true;
//     }
//     return false;
//   } else {
//     return true;
//   }
// }

// ใช้งานไม่ได้เกับปุ่ม remove ที่ login ไม่ใช่เจ้าของ board
// function handlerToolTips() {
//   const leaveAccess = collabStore.getCollaborator().find((collab) => collab.oid === accountStore.getData().oid);
//   if (leaveAccess) {
//     if (!permission.value) {
//       accountStore.permission = true;
//     }
//     return false;
//   } else {
//     return true;
//   }
// }
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
              </p>
            </div>

            <div class="w-[25%]">
              <p class="itbkk-status-email text-center">
                {{ slotprop.job.email }}
              </p>
            </div>

            <div class="w-[20%] text-center">
              <ToolTipOwnerBtn class="w-full">
                <select
                  @change="changeAccessRight(slotprop.job)"
                  v-model="slotprop.job.accessRight"
                  :disabled="!permission_owner"
                  :class="!permission_owner ? 'disabled' : ''"
                  class="border p-2 rounded text-center w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option :value="slotprop.job.accessRight">
                    {{ slotprop.job.accessRight }}
                  </option>
                  <option :value="slotprop.job.accessRight === 'WRITE' ? 'READ' : 'WRITE'">
                    {{ slotprop.job.accessRight === "WRITE" ? "READ" : "WRITE" }}
                  </option>
                </select>
              </ToolTipOwnerBtn>
            </div>

            <div class="w-[10%] flex justify-center">
              <!-- <ToolTipOwnerBtn v-if="!permission_owner">
                <div class="flex gap-4 justify-center">
                  <button
                    @click="emit('delete', slotprop.job)"
                    :disabled="!permission_owner"
                    :class="!permission_owner ? 'disabled opacity-40' : ''"
                    class="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow-lg hover:scale-105 transition duration-200 ease-in-out border border-transparent"
                  >
                    Remove
                  </button>
                </div>
              </ToolTipOwnerBtn> -->

              <TooltipBtn :access="handlerToolTips(slotprop.job)">
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

<style scoped></style>
