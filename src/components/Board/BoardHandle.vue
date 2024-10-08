<script setup>
import {useAccount} from "@/store/account";
import {getBoardIdByUserOIDs} from "@/util/fetchUtils";
import {onMounted} from "vue";
import {RouterLink, RouterView} from "vue-router";
import ListModel from "../Ui/ListModel.vue";
import {handleRequestWithTokenRefresh} from "@/util/handleRequest";

const emit = defineEmits(["isCreate"]);

const accountStore = useAccount();

onMounted(async () => {
  const boards = await handleRequestWithTokenRefresh(
    getBoardIdByUserOIDs,
    accountStore.getData()?.oid
  );

  if (boards) {
    accountStore.setBoardList(boards);
  }
});
</script>

<template>
  <div class="mt-[50px] flex justify-end">
    <router-link :to="{name: 'boardAdd'}">
      <button
        class="itbkk-button-create bg-white text-black font-semibold px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Create personal board
      </button>
    </router-link>
  </div>

  <div v-if="accountStore.getBoardList().length !== 0" class="gap-2 p-3">
    <ListModel
      class="grid grid-cols-3 mx-auto gap-3"
      :jobs="accountStore.getBoardList()"
    >
      <template #default="slotprop">
        <div
          class="relative mx-auto py-2 inline-block w-[80%] bg-slate-500 text-white rounded-[30px] transition-all duration-300 ease-in-out hover:-translate-x-[12px] hover:-translate-y-[12px] h-[auto] cursor-pointer"
        >
          <router-link :to="{name: 'boardTask', params: {id: slotprop.job.id}}">
            <div>
              <span class="flex justify-center p-2">
                {{ slotprop.key + 1 }}. {{ slotprop.job.name }}
              </span>
            </div>
            <div class="flex justify-center gap-4">
              <button class="btn btn-outline btn-warning">Edit</button>
              <button class="btn btn-outline btn-error">Delete</button>
            </div>
          </router-link>
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
