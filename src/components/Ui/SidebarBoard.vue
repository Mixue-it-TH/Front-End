<script setup>
import { useAccount } from "@/store/account";
import { defineProps, defineEmits, ref, computed, onMounted } from "vue";
import VisibleModal from "../Navbar/VisibleModal.vue";
import LimitTaskModal from "../Navbar/LimitTaskModal.vue";
import { useRoute, useRouter } from "vue-router";
import { useTasks } from "@/store/task";
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
const showLimitModal = ref(false);
const showVisibilityModal = ref(false);
const isLimit = ref(false);
const limitMaximux = ref(10);
const route = useRoute();
const taskManagement = useTasks();
const statusManagement = useStatus();
const router = useRouter();

function closeVisibleModal() {
  showVisibilityModal.value = !showVisibilityModal.value;
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

        <div class="p-4 border-t mt-auto">
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
