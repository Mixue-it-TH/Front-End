<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import { getBoardIdByUserOIDs } from "@/util/fetchUtils";
import { useAccount } from "@/store/account";
import { useCollaborator } from "@/store/collaborator";
import ListModel from "../Ui/ListModel.vue";
import Board from "./Board.vue";

const emit = defineEmits(["leave"]);

const accountStore = useAccount();
const collaboratorStore = useCollaborator();

onMounted(async () => {
  const boards = await handleRequestWithTokenRefresh(getBoardIdByUserOIDs, accountStore.getData()?.oid);
  if (boards.owners) {
    accountStore.setBoardList(boards.owners);
  }
  if (boards.collabs) {
    collaboratorStore.setListCollabBoard(boards.collabs);
  }

  console.log(boards.owners);
  console.log(boards.collabs);
});
</script>

<template>
  <ListModel
    class="grid grid-cols-[repeat(auto-fit,minmax(250px,330px))] gap-y-8 justify-evenly"
    :jobs="accountStore.getBoardList()"
  >
    <template #default="slotprop">
      <Board v-if="accountStore.getBoardList().length !== 0" :board="slotprop.job" />
    </template>
  </ListModel>
  <ListModel
    class="grid grid-cols-[repeat(auto-fit,minmax(250px,330px))] gap-y-8 justify-evenly"
    :jobs="collaboratorStore.getListCollabBoard()"
  >
    <template #default="slotprop">
      <Board v-if="collaboratorStore.getListCollabBoard().length !== 0" :board="slotprop.job" />
    </template>
  </ListModel>
  <div class="mt-[50px] flex justify-end">
    <router-link :to="{ name: 'boardAdd' }">
      <button
        class="itbkk-button-create bg-white text-black font-semibold px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Create personal board
      </button>
    </router-link>
  </div>

  <div v-if="accountStore.getBoardList().length !== 0" class="gap-2 p-3">
    <div class="itbkk-personal-item text-center p-4">
      <p class="itbkk-personal-board text-3xl font-bold text-black drop-shadow-lg">Personal Boards</p>
    </div>
    <ListModel class="grid grid-cols-3 mx-auto gap-3" :jobs="accountStore.getBoardList()">
      <template #default="slotprop">
        <div
          class="relative mx-auto py-4 px-6 inline-block w-[80%] bg-white text-black rounded-[20px] transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-x-[10px] hover:-translate-y-[10px] cursor-pointer border border-gray-300"
        >
          <router-link :to="{ name: 'boardTask', params: { id: slotprop.job.id } }">
            <div>
              <span class="itbkk-board-name flex justify-center p-2 font-semibold text-lg">
                {{ slotprop.key + 1 }}. {{ slotprop.job.name }}
              </span>

              <div class="itbkk-board-visibility flex justify-start items-center my-2">
                <p class="mr-2 font-medium">Visibility:</p>
                <span>{{ slotprop.job.visibility }}</span>
              </div>
            </div>
          </router-link>
          <div class="flex justify-center gap-4 mt-4">
            <button
              class="bg-transparent border border-black text-black font-semibold py-2 px-4 rounded-lg hover:bg-black hover:text-white transition duration-200 ease-in-out"
            >
              Edit
            </button>
            <button
              class="bg-transparent border border-red-500 text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition duration-200 ease-in-out"
            >
              Delete
            </button>
          </div>
        </div>
      </template>
    </ListModel>
  </div>

  <div v-if="collaboratorStore.getListCollabBoard().length !== 0" class="gap-2 p-3 itbkk-collab-item">
    <div class="text-center p-4">
      <p class="text-3xl font-bold text-black drop-shadow-lg">collab Boards</p>
    </div>
    <ListModel class="grid grid-cols-3 mx-auto gap-3" :jobs="collaboratorStore.getListCollabBoard()">
      <template #default="slotprop">
        <div
          class="relative mx-auto py-4 px-6 inline-block w-[80%] bg-white text-black rounded-[20px] transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-x-[10px] hover:-translate-y-[10px] cursor-pointer border border-gray-300"
        >
          <router-link :to="{ name: 'boardTask', params: { id: slotprop.job.id } }">
            <div>
              <span class="itbkk-board-name flex justify-center p-2 font-semibold text-lg">
                {{ slotprop.key + 1 }}. {{ slotprop.job.name }}
              </span>

              <div class="itbkk-owner-name flex justify-start items-center my-2">
                <p class="mr-2 font-medium">Owner:</p>
                <span>{{ slotprop.job.ownerName }}</span>
              </div>

              <div class="flex justify-start items-center my-2">
                <p class="mr-2 font-medium">Access Right:</p>
                <span class="itbkk-access-right">{{ slotprop.job.access_right }}</span>
              </div>
            </div>
          </router-link>
          <div class="flex justify-center gap-4 mt-4">
            <button
              class="bg-transparent border border-black text-black font-semibold py-2 px-4 rounded-lg hover:bg-black hover:text-white transition duration-200 ease-in-out"
            >
              Edit
            </button>
            <button
              class="bg-transparent border border-red-500 text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition duration-200 ease-in-out"
            >
              Delete
            </button>
          </div>
          <div class="itbkk-leave-board flex justify-center mt-4">
            <button
              @click="$emit('leave', slotprop.job)"
              class="bg-transparent text-black font-medium py-2 px-4 rounded-lg border border-gray-400 hover:bg-gray-200 transition duration-200 ease-in-out"
            >
              Leave
            </button>
          </div>
        </div>
      </template>
    </ListModel>
  </div>

  <RouterView />
</template>

<style scoped>
.btn-1 {
  background-color: #000;
  color: #fff;
  border-radius: 30px;
  transition: all 0.25s ease;
}

.btn-1:hover {
  transform: translate(-12px, -12px);
}

.btn-1:hover:after {
  transform: translate(6px, 6px);
}
.btn-1:hover:before {
  transform: translate(12px, 12px);
}

.btn-1:hover:after,
.btn-1:hover:before {
  content: "";
  position: absolute;
  opacity: 0.3;
  background-color: #000;
  border-radius: inherit;
  width: 100%;
  height: 100%;
  left: 0px;
  bottom: 0px;
  z-index: -1;
  transition: all 0.25s ease;
}
</style>
