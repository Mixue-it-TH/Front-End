<script setup>
import router from "@/router";
import { handelLimitMaximum } from "@/util/statusFetchUtils";
import { useStatus } from "@/store/status";
import { useTasks } from "@/store/task";
import { computed, onMounted, ref, watch } from "vue";
import { getEnableLimit, getBoardIdByUserOIDs, getBoardByBoardid, editTheme } from "@/util/fetchUtils";
import { useAlert } from "@/store/alert";
import { useAccount } from "@/store/account";
import { useLimit } from "@/store/limitReached";
import LimitTaskModal from "./LimitTaskModal.vue";
import VisibleModal from "./VisibleModal.vue";
import { RouterLink, useRoute } from "vue-router";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import { handleVisibleMode } from "@/util/accountFetchUtil";
import getAccessToken from "@/util/tokenUtil";
import TooltipBtn from "../Ui/TooltipBtn.vue";
import ToolTipOwnerBtn from "../Ui/ToolTipOwnerBtn.vue";
import { getCollaboratorsByCollabId } from "@/util/accountFetchUtil";
import { useThemeStore } from "@/store/theme";

const alertManagement = useAlert();
const statusManagement = useStatus();
const accountStore = useAccount();
const taskManagement = useTasks();
const limitManagement = useLimit();
const sortState = ref(0);
const showLimitModal = ref(false);
const statusFilter = ref([]);
const limitMaximux = ref(10);
const isLimit = ref(false);
const toggleManage = ref(" Manage Status");
const route = useRoute();
const isboardSelect = ref(true);
const boardName = ref("");
const visibilityToggle = ref(false);
const showVisibilityModal = ref(false);
const currentTheme = ref();
const permission = computed(() => accountStore.permission);
const permission_owner = computed(() => accountStore.isOwner);
const icon = ref("");

// เล้งเพิ่ม
const themeManagement = useThemeStore();

onMounted(async () => {
  if (getAccessToken()) {
    if (route.params.id) {
      const isEnbleLimit = await handleRequestWithTokenRefresh(getEnableLimit, route.params.id);

      isLimit.value = isEnbleLimit.limitMaximumTask;
      limitMaximux.value = isEnbleLimit.noOfTasks;

      if (permission_owner.value) {
        const responese = await handleRequestWithTokenRefresh(
          handelLimitMaximum,
          isLimit.value,
          limitMaximux.value,
          route.params.id
        );
        if (responese.status === 403) {
          localStorage.setItem("isPrivate", "Access denied, you do not have permission to view this page.");
          router.go(-1);
        }

        if (isEnbleLimit.limitMaximumTask) limitManagement.addLimitReached(responese.statusList);
        taskManagement.setLimitMaximumTask(isEnbleLimit.limitMaximumTask, isEnbleLimit.noOfTasks);
      }
    }
  }
  currentTheme.value = localStorage.getItem("theme");
});

watch(
  () => route.fullPath,
  async (newPath) => {
    if (newPath === "/board" || newPath === "/board/add") {
      themeManagement.setTheme("default");
      currentTheme.value = "default";
      isboardSelect.value = false;

      toggleManage.value = " Manage Status";
    } else {
      isboardSelect.value = true;
    }
    if (newPath.includes("status")) {
      toggleManage.value = "Home";
    }
    if (route.params.id) {
      if (accountStore.getBoardList().length === 0 && localStorage.getItem("Token")) {
        const boards = await handleRequestWithTokenRefresh(getBoardIdByUserOIDs, accountStore.getData()?.oid);
        accountStore.setBoardList(boards);
      }
      ////// REFACTOR SOON ///////
      if (!getAccessToken()) {
        accountStore.setVisibility(true, null);
      } else {
        const board = await getBoardByBoardid(route.params.id);

        if (board.status === 403) {
          accountStore.setVisibility("PRIVATE");
        } else if (board.owner.oid !== accountStore.getData().oid) {
          const access = await handleRequestWithTokenRefresh(
            getCollaboratorsByCollabId,
            route.params.id,
            accountStore.getData().oid
          );

          accountStore.setVisibility(
            board?.visibility === "PUBLIC" ? true : false,
            board?.owner.oid,
            access.accessRight
          );
        } else {
          accountStore.setVisibility(board?.visibility === "PUBLIC" ? true : false, board?.owner.oid);
        }
      }
      ///// REFACTOR SOON ///////

      visibilityToggle.value = accountStore.getVisibility();

      const boardDetail = await getBoardByBoardid(route.params.id);

      boardName.value = boardDetail.name;
      const themeSelect = localStorage.getItem("theme");
      currentTheme.value = themeSelect;
      icon.value = icon.value = themeManagement.getAllTheme()[themeSelect].icon;
    }
  },
  { immediate: true }
);

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

function openVisibilityModal() {
  showVisibilityModal.value = !showLimitModal.value;
}

async function filterSelection(statusName) {
  const isDuplicate = statusFilter.value.filter((status) => {
    return status === statusName;
  });
  if (isDuplicate.length === 0) {
    statusFilter.value.push(statusName);
  } else {
    statusFilter.value = statusFilter.value.filter((status) => {
      return status !== statusName;
    });
  }
  taskManagement.addFilter(statusFilter.value);
  if (sortState.value === 0) {
    taskManagement.sortTaskByStatusName(2);
  } else {
    taskManagement.sortTaskByStatusName(taskManagement.getCurrentState());
  }
}
function filterDeleteSelection(statusName) {
  statusFilter.value = statusFilter.value.filter((status) => {
    return status !== statusName;
  });
  taskManagement.addFilter(statusFilter.value);
  if (sortState.value === 0) {
    taskManagement.sortTaskByStatusName(2);
  } else taskManagement.sortTaskByStatusName(taskManagement.getCurrentState());
}

function filterClearSelection() {
  statusFilter.value = [];
  taskManagement.addFilter(statusFilter.value);
  if (sortState.value === 0) {
    taskManagement.sortTaskByStatusName(2);
  } else taskManagement.sortTaskByStatusName(taskManagement.getCurrentState());
}

function sortTask() {
  sortState.value = taskManagement.sortTaskByStatusName(sortState.value);
}

function handleLogout(login) {
  if (!login) {
    accountStore.setisLogin(login);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    themeManagement.setTheme("default");
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

function toggleMode() {
  const boardId = route.params.id;
  if (toggleManage.value === " Manage Status") {
    router.push(`/board/${boardId}/status`);
    toggleManage.value = "Home";
  } else if (toggleManage.value === "Home") {
    router.push(`/board/${boardId}`);
    toggleManage.value = " Manage Status";
  }
}

function limitModalHandler(isClose) {
  showLimitModal.value = isClose;
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

function backToPrevious() {
  taskManagement.clearAllTask();
  statusManagement.clearAllStatus();
  router.push("/board");
}
function closeVisibleModal(isClose) {
  showVisibilityModal.value = isClose;
}

function collabPageHandle() {
  if (!route.fullPath.includes("collab")) {
    router.push({ name: "collaborator", params: { id: route.params.id } });
  } else {
    router.go(-1);
  }
}

// เล้งเพิ่ม
async function setTheme(theme) {
  const newTheme = await handleRequestWithTokenRefresh(editTheme, route.params.id, theme);
  if (newTheme.theme) {
    themeManagement.setTheme(newTheme.theme);
    icon.value = themeManagement.getAllTheme()[newTheme.theme].icon;
    console.log(icon.value);
    localStorage.setItem("theme", newTheme.theme);
    currentTheme.value = newTheme.theme;
  }
}
</script>

<template>
  <Teleport to="body" v-if="showLimitModal">
    <LimitTaskModal @cancel="limitModalHandler" @save="handelLimit" :isLimit="isLimit" :limitMaximum="limitMaximux" />
  </Teleport>
  <Teleport to="body" v-if="showVisibilityModal">
    <VisibleModal @cancel="closeVisibleModal" @save="handleVisible" :isPublic="accountStore.getVisibility()" />
  </Teleport>
  <div class="flex flex-row justify-between tablet:h-[auto] tablet:flex-col w-[100%] h-[75px] mb-[15px]">
    <div class="flex h-[85%]">
      <img class="mr-[10px] tablet:w-[15%] laptop:w-[100px] mobile:w-[5%]" src="/image/SIT-logo.png" />

      <h1 class="text-[22px] text-secondary font-[800] mt-[10px]">IT-Bangmod Kradan Kanban</h1>
    </div>
    <div class="flex mobile:flex-col tablet:justify-between gap-[15px] h-[75%] mobile-L:flex-col-reverse">
      <div class="flex mobile-L:items-center mobile-L:flex-col">
        <div
          v-show="isboardSelect"
          class="itbkk-manage-status itbkk-button-home mobile-L:w-[235px] cursor-pointer hover:bg-gray-300 hover:text-black duration-100 bg-accent border border-[#BDBDBD] rounded-[4px] w-[200px] h-[45px] m-[7px] py-[7px] px-[5px] text-center"
          @click="toggleMode"
        >
          <div v-if="toggleManage === 'Home'" class="flex items-center justify-center gap-[10px]">
            <h1 class="">
              {{ toggleManage }}
            </h1>
            <img src="/image/home-icon.png" width="30px" />
          </div>
          <div v-else>
            <h1>
              {{ toggleManage }}
            </h1>
          </div>
        </div>
        <div
          v-show="isboardSelect"
          class="itbkk-status-filter flex justify-between w-[202px] mobile-L:w-[235px] h-[45px] px-[10px] m-[auto] hover:bg-gray-300 hover:text-black duration-100 bg-accent border border-[#BDBDBD] rounded-[4px]"
        >
          <div class="dropdown dropdown-bottom text-xs font-medium cursor-pointer">
            <div tabindex="0" role="">
              <div class="mt-2 overflow-auto">
                <div v-if="statusFilter.length === 0">
                  <p class="pl-8 pt-[5px]">Filter by status(es)</p>
                </div>

                <div
                  v-else
                  class="flex gap-[8px] w-[150px] absolute mb-5s max-h-[55px] overflow-y-hidden"
                  tabindex="0"
                  role=""
                >
                  <div
                    v-for="(status, index) in statusFilter"
                    :key="index"
                    class="itbkk-filter-item min-w-[120px] max-h-[60px] mb-5 pt-6 hover:bg-gray-300 hover:text-black text-secondary border border-primary rounded-md flex flex-row gap-[5px] w-auto items-center justify-center p-0.5 me-2 text-sm font-normal"
                  >
                    <div class="relative mb-5 transition-all text-sm duration-75 rounded-md flex">
                      {{ status }}
                      <div @click="filterDeleteSelection(status)" class="itbkk-filter-item-clear z-[10]">
                        <p class="itbkk-item-clear pr-1 hover:text-red-500 text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp; X</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul tabindex="0" class="dropdown-content z-[1] menu shadow rounded-[10px] w-[150px] bg-accent">
              <li
                v-for="(status, index) in statusManagement.getAllStatus()"
                :key="index"
                class="break-all itbkk-status-choice"
                @click="filterSelection(status.name)"
              >
                <a :class="statusFilter.includes(status.name) ? 'bg-[#D7D7D7]' : ''">{{ status.name }}</a>
              </li>
            </ul>
          </div>
          <div @click="filterClearSelection" class="flex justify-center items-center cursor-pointer">
            <p class="hover:text-red-600 border-6 rounded-md border-gray-50 pr-1.5">X</p>
          </div>
        </div>
      </div>
      <div class="flex items-center mobile:flex-row l gap-[10px] mobile-L:hidden">
        <ToolTipOwnerBtn>
          <div
            v-show="isboardSelect"
            @click="permission_owner ? limitModalHandler(true) : ''"
            class="itbkk-status-setting flex justify-center items-center bg-accent hover:bg-gray-300 hover:text-black duration-100 w-[45px] min-w-[40px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px]"
          >
            <div class="flex justify-center">
              <img src="/image/setting-icon.png" class="w-[25px] h-[25px]" />
            </div>
          </div>
        </ToolTipOwnerBtn>
      </div>

      <RouterLink v-if="!accountStore.getisLogin()" :to="{ name: 'login' }">
        <div class="flex btn btn-outline mt-[5px]">Login</div>
      </RouterLink>
      <div v-else class="dropdown dropdown-end flex items-center mobile-L:justify-center mobile-L:hidden">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle avatar flex items-center w-auto mobile-L:ml-20"
          style="min-width: 170px; padding: 0 10px"
        >
          <div class="flex-shrink-0 w-[50px] h-[50px] mb-auto rounded-full overflow-hidden">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="ml-2 font-inter flex-1 flex flex-col justify-center h-[50px] w-[125px] mobile:text-md">
            <div class="itbkk-fullname mt-2">
              {{ accountStore.getData()?.name }}
            </div>
            <div class="text-black text-opacity-40 text-[10px]">
              {{ accountStore.getData()?.role }}
            </div>
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content rounded-box z-[1] mt-[100px] w-52 p-2 shadow cursor-none bg-accent"
        >
          <li @click="handleLogout(false)">
            <div class="flex justify-between">
              <a>Logout</a>
              <img src="/image/logout.png" class="w-[28px]" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div
    v-if="isboardSelect"
    class="breadcrumbs flex justify-between text-sm overflow-visible text-secondary mobile-L:flex-col-reverse"
  >
    <ul class="w-[50%] mobile-L:mt-[20px]">
      <li @click="backToPrevious"><a>HOME</a></li>
      <li>
        {{ boardName }}
      </li>
      <li>
        <ToolTipOwnerBtn>
          <div class="dropdown dropdown-right" :class="!permission_owner ? 'pointer-events-none opacity-50' : ''">
            <div tabindex="0" role="button ">
              <img :src="icon" alt="Theme Icon" class="w-8 h-6 inline mr-2" />
            </div>
            <ul tabindex="0" class="dropdown-content menu rounded-box z-[1] w-52 p-2 shadow bg-accent">
              <li v-for="(theme, index) in Object.keys(themeManagement.getAllTheme())">
                <a @click="setTheme(theme)">
                  <img
                    :src="themeManagement.getAllTheme()[theme].icon"
                    alt="Theme Icon"
                    class="w-6 h-6 inline mr-2 text-secondary"
                  />
                  {{ theme }}
                  <span v-if="currentTheme === theme" class="text-[12px] flex gap-[5px] justify-center items-center">
                    <div class="rounded-full bg-green-500 w-[7px] h-[7px]"></div>
                    in use
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </ToolTipOwnerBtn>
      </li>
    </ul>

    <ul>
      <div class="flex gap-[15px] justify-center items-center mobile-L:w-[500px]">
        <div>
          <button
            v-if="route.params.id"
            @click="collabPageHandle"
            class="bg-accent border-[#BDBDBD] text-secondary border px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-black transition duration-200 mobile-L:w-[240px] ml-5"
          >
            Manage Collaborator
          </button>
        </div>
        <ToolTipOwnerBtn>
          <li class="border border-[#BDBDBD] rounded-lg bg-accent mobile-L:hidden">
            <div class="itbkk-board-visibility form-control w-[120px]">
              <label class="label cursor-pointer mobile:text-base">
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
      </div>
    </ul>
  </div>
</template>

<style scoped></style>
