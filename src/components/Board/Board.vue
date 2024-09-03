<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useStatus } from "@/store/status";
import { useTasks } from "@/store/task";
import { useAccount } from "@/store/account";
import { getStatusList, getTaskList } from "@/util/fetchUtils";
import CreateBoardModal from "./CreateBoardModal.vue";

const accountStore = useAccount();
const taskManagement = useTasks();
const statusManagement = useStatus();
const isCreated = ref(false);
const isClicked = ref(false);
const router = useRouter();

onMounted(async () => {
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    accountStore.setisLogin(true);
    accountStore.decodedToken(token);
  }

  isCreated.value = false; // Simulate check if the board is created

  // if board is created, Fetch Data
  const listStatuses = await getStatusList(
    import.meta.env.VITE_BASE_URL + "/statuses"
  );
  const listTasks = await getTaskList(import.meta.env.VITE_BASE_URL + "/tasks");

  // Assign value to global management
  statusManagement.addStatuses(listStatuses);
  taskManagement.addTasks(listTasks);

  if (isCreated.value) router.push("/board");
});

function closeModal() {
  router.push("/board ");
  // router.go(-1);
  router.go(-1); // previous page
}

function saveBoard() {
  console.log("Fetching new data...");
  console.log(11);
  closeModal();
} // ปิด modal}
</script>

<template>
  <div
    v-if="!isCreated"
    class="border border-black mt-[50px] flex justify-end"
  >
    <router-link :to="{ name: 'boardAdd' }">
      <button
        @click="isClicked = !isClicked"
        class="bg-white text-black font-semibold px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Create new Board
      </button>
    </router-link>
  </div>

  <CreateBoardModal
    v-if="isClicked"
    @cancel="closeModal"
    @save="saveBoard"
  ></CreateBoardModal>
</template>

<style scoped></style>
