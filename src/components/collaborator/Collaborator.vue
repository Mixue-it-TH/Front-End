<script setup>
import router from "@/router";
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import TooltipBtn from "../Ui/TooltipBtn.vue";
import ListCollaborator from "./ListCollaborator.vue";
import { useAccount } from "@/store/account";
import { getBoardIdByUserOIDs } from "@/util/fetchUtils";
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import ListModel from "../Ui/ListModel.vue";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import CollaboratorModal from "./CollaboratorModal.vue";

const emit = defineEmits(["isCreate"]);

const prop = defineProps({
  limitExceed: {
    type: Array,
  },
});
const route = useRoute();
const accountStore = useAccount();

const showCollaboratorModal = ref(false);
const mode = ref("read");
const permission = computed(() => accountStore.permission);
function closeModal(isClose) {
  showCollaboratorModal.value = isClose;
}
</script>

<template>
  <Teleport to="body" v-if="showCollaboratorModal">
    <CollaboratorModal @cancel="closeModal" @save="" />
  </Teleport>
  <div class="pt-[20px] flex justify-end">
    <button
      @click="showCollaboratorModal = !showCollaboratorModal"
      class="bg-white text-black font-semibold px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
    >
      Add Collaborator
    </button>
  </div>
  <div>
    <ListCollaborator />
  </div>
</template>

<style scoped></style>
