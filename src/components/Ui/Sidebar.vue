<script setup>
import { useAccount } from "@/store/account";
import { defineProps, defineEmits, ref, computed, onMounted } from "vue";
import ToolTipOwnerBtn from "./ToolTipOwnerBtn.vue";
import VisibleModal from "../Navbar/VisibleModal.vue";
import LimitTaskModal from "../Navbar/LimitTaskModal.vue";
import { useAlert } from "@/store/alert";
import { handleVisibleMode } from "@/util/accountFetchUtil";
import { useRoute, useRouter } from "vue-router";
import { useLimit } from "@/store/limitReached";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import { handelLimitMaximum } from "@/util/statusFetchUtils";
import { useTasks } from "@/store/task";
import { getEnableLimit } from "@/util/fetchUtils";
import { useStatus } from "@/store/status";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "active"]);

const close = () => {
  emit("close");
};

const accountStore = useAccount();
const visibilityToggle = ref(false);
const showLimitModal = ref(false);
const showVisibilityModal = ref(false);
const isLimit = ref(false);
const limitMaximux = ref(10);
const permission_owner = computed(() => accountStore.isOwner);
const alertManagement = useAlert();
const route = useRoute();
const limitManagement = useLimit();
const taskManagement = useTasks();
const statusManagement = useStatus();
const router = useRouter();

onMounted(async () => {
  const isEnbleLimit = await handleRequestWithTokenRefresh(getEnableLimit, route.params.id);

  isLimit.value = isEnbleLimit.limitMaximumTask;
  limitMaximux.value = isEnbleLimit.noOfTasks;

  const responese = await handleRequestWithTokenRefresh(
    handelLimitMaximum,
    isLimit.value,
    limitMaximux.value,
    route.params.id
  );

  if (isEnbleLimit.limitMaximumTask) limitManagement.addLimitReached(responese.statusList);
  taskManagement.setLimitMaximumTask(isEnbleLimit.limitMaximumTask, isEnbleLimit.noOfTasks);
});

function openVisibilityModal() {
  showVisibilityModal.value = !showLimitModal.value;
  emit("active");
}

async function handleVisible(status) {
  const mode = visibilityToggle.value ? "private" : "public";

  const response = await handleVisibleMode(mode, route.params.id);
  if (response.status === 401) {
    handleLogout();
  }
  if (response.status === 403) {
    alertManagement.statusHandler("You do not have permission to change board visibility mode");
  } else {
    alertManagement.statusHandler("There is a problem. Please try again later");
  }
  alertManagement.statusHandler("success", `Change visibility to ${response.visibility.toLowerCase()}`);

  visibilityToggle.value = !visibilityToggle.value;
  accountStore.setVisibility(status, accountStore.getData().oid);

  closeVisibleModal();
}

function closeVisibleModal() {
  showVisibilityModal.value = !showVisibilityModal.value;
}

function limitModalHandler() {
  showLimitModal.value = !showLimitModal.value;
  emit("active");
}

async function handelLimit(enable, amountLimit) {
  const responese = await handleRequestWithTokenRefresh(handelLimitMaximum, enable, amountLimit, route.params.id);

  handleLimitResponse(responese);

  limitMaximux.value = amountLimit;
  showLimitModal.value = false;
  isLimit.value = enable;
}

function handleLimitResponse(responese) {
  if (responese.limitMaximumTask) {
    limitManagement.addLimitReached(responese.statusList);
    alertManagement.statusHandler("success", `The Kanban board now limits ${responese.noOfTasks} tasks in each status`);
  } else {
    limitManagement.clearLimitReached();
    alertManagement.statusHandler("success", `The Kanban board has disabled the task limit in each status`);
  }

  taskManagement.setLimitMaximumTask(responese.limitMaximumTask, responese.noOfTasks);
}

function handleLogout(login) {
  if (!login) {
    accountStore.setisLogin(login);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("boardId");
    localStorage.removeItem("boardName");
    localStorage.removeItem("theme");
    taskManagement.clearAllTask();
    statusManagement.clearAllStatus();

    // CHECK LOGOUT TYPE BETWEEN MICROSOFT || TRADITIONAL SYSTEM
    if (localStorage.getItem("msal_logout")) {
      localStorage.removeItem("msal_logout");
      window.location.href = `${import.meta.env.VITE_LOGIN_URL}/logout?${window.location.origin}${
        import.meta.env.VITE_GROUP_CODE !== undefined ? import.meta.env.VITE_GROUP_CODE : ""
      }/login`;
    } else router.push("/login");
  }
}
</script>

<template>
  <Teleport to="body" v-if="showVisibilityModal">
    <VisibleModal @cancel="closeVisibleModal" @save="handleVisible" :isPublic="accountStore.getVisibility()" />
  </Teleport>

  <Teleport to="body" v-if="showLimitModal">
    <LimitTaskModal @cancel="limitModalHandler" @save="handelLimit" :isLimit="isLimit" :limitMaximum="limitMaximux" />
  </Teleport>

  <Transition name="slide">
    <aside v-if="isOpen" class="fixed bg-accent inset-y-0 right-0 w-64 shadow-lg z-50 invisible mobile-L:visible">
      <div class="flex flex-col h-full">
        <div class="flex justify-between items-center p-4 border-b border-black">
          <div class="flex-shrink-0 w-[50px] h-[50px] mb-auto rounded-full overflow-hidden">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="ml-2 font-inter flex-1 flex flex-col justify-center h-[50px] w-[125px]">
            <div class="itbkk-fullname mt-2">
              {{ accountStore.getData()?.name }}
            </div>
            <div class="text-black text-opacity-40 text-[10px]">
              {{ accountStore.getData()?.role }}
            </div>
          </div>
          <button @click="close" class="text-gray-500 hover:text-gray-700" aria-label="Close sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="flex-1 overflow-y-auto">
          <ul class="space-y-2">
            <li>
              <ToolTipOwnerBtn>
                <li class="block px-4 py-2 border-b border-black">
                  <div class="itbkk-board-visibility form-control w-[120px]">
                    <label class="label cursor-pointer">
                      <span>{{ visibilityToggle === false ? "private" : "public" }}</span>

                      <input
                        :checked="visibilityToggle"
                        :v-model="visibilityToggle"
                        :disabled="!permission_owner"
                        type="checkbox"
                        @click.prevent="openVisibilityModal"
                        class="toggle bg bg-gray-200 checked:bg-blue-500 [--tglbg:white]"
                        :class="!permission_owner ? 'disabled' : ''"
                      />
                    </label>
                  </div>
                </li>
              </ToolTipOwnerBtn>
            </li>
            <ToolTipOwnerBtn>
              <li class="border-b border-black">
                <a
                  href="#"
                  @click="permission_owner ? limitModalHandler(true) : ''"
                  class="block px-4 py-2 text-secondary hover:bg-gray-100 rounded"
                >
                  Status setting
                </a>
              </li>
            </ToolTipOwnerBtn>
          </ul>
        </nav>
        <div class="p-4 border-t">
          <button @click="handleLogout()" class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Log out
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
