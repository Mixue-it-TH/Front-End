<script setup>
import router from "@/router";
import {handelLimitMaximum} from "@/util/statusFetchUtils";
import {useStatus} from "@/store/status";
import {useTasks} from "@/store/task";
import {computed, onMounted, ref, watch} from "vue";
import {
  getEnableLimit,
  getBoardIdByUserOIDs,
  getBoardByBoardid,
} from "@/util/fetchUtils";
import {useAlert} from "@/store/alert";
import {useAccount} from "@/store/account";
import {useLimit} from "@/store/limitReached";
import LimitTaskModal from "./LimitTaskModal.vue";
import VisibleModal from "./VisibleModal.vue";
import {useRoute} from "vue-router";
import {handleRequestWithTokenRefresh} from "@/util/handleRequest";
import {handleVisibleMode} from "@/util/accountFetchUtil";
import getAccessToken from "@/util/tokenUtil";
import TooltipBtn from "../Ui/TooltipBtn.vue";

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
const permission = computed(() => accountStore.permission);

onMounted(async () => {
  if (getAccessToken()) {
    if (route.params.id) {
      const isEnbleLimit = await handleRequestWithTokenRefresh(
        getEnableLimit,
        route.params.id
      );

      isLimit.value = isEnbleLimit.limitMaximumTask;
      limitMaximux.value = isEnbleLimit.noOfTasks;
      const responese = await handleRequestWithTokenRefresh(
        handelLimitMaximum,
        isLimit.value,
        limitMaximux.value,
        route.params.id
      );

      if (isEnbleLimit.limitMaximumTask)
        limitManagement.addLimitReached(responese.statusList);
      taskManagement.setLimitMaximumTask(
        isEnbleLimit.limitMaximumTask,
        isEnbleLimit.noOfTasks
      );
    }
  }
});

watch(
  () => route.fullPath,
  async (newPath) => {
    if (newPath === "/board") {
      isboardSelect.value = false;

      toggleManage.value = " Manage Status";
    } else {
      isboardSelect.value = true;
    }
    if (newPath.includes("status")) {
      toggleManage.value = "Home";
    }
    if (route.params.id) {
      if (
        accountStore.getBoardList().length === 0 &&
        localStorage.getItem("Token")
      ) {
        const boards = await handleRequestWithTokenRefresh(
          getBoardIdByUserOIDs,
          accountStore.getData()?.oid
        );
        accountStore.setBoardList(boards);
      }
      ////// REFACTOR SOON ///////
      if (!getAccessToken()) {
        accountStore.setVisibility(true, null);
      } else {
        const board = await getBoardByBoardid(route.params.id);

        if (board.status === 403) {
          accountStore.setVisibility("PRIVATE");
        } else {
          accountStore.setVisibility(
            board[0]?.visibility === "PUBLIC" ? true : false,
            board[0]?.owner.oid
          );
        }
      }
      ///// REFACTOR SOON ///////

      visibilityToggle.value = accountStore.getVisibility();

      boardName.value = accountStore
        .getBoardList()
        .find((board) => board.id === route.params.id);
    }
  },
  {immediate: true}
);

async function handleVisible(status) {
  const mode = visibilityToggle.value ? "private" : "public";

  const response = await handleVisibleMode(mode, route.params.id);
  if (response.status === 401) {
    handleLogout();
  }
  if (response.status === 403) {
    alertManagement.statusHandler(
      "You do not have permission to change board visibility mode"
    );
  } else {
    alertManagement.statusHandler("There is a problem. Please try again later");
  }
  alertManagement.statusHandler(
    "success",
    `Change visibility to ${response.visibility.toLowerCase()}`
  );

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
    localStorage.removeItem("boardId");
    localStorage.removeItem("boardName");
    taskManagement.clearAllTask();
    statusManagement.clearAllStatus();
    router.push("/login");
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
  const responese = await handleRequestWithTokenRefresh(
    handelLimitMaximum,
    enable,
    amountLimit,
    route.params.id
  );

  handleLimitResponse(responese);

  limitMaximux.value = amountLimit;
  showLimitModal.value = false;
  isLimit.value = enable;
}

function handleLimitResponse(responese) {
  if (responese.limitMaximumTask) {
    limitManagement.addLimitReached(responese.statusList);
    alertManagement.statusHandler(
      "success",
      `The Kanban board now limits ${responese.noOfTasks} tasks in each status`
    );
  } else {
    limitManagement.clearLimitReached();
    alertManagement.statusHandler(
      "success",
      `The Kanban board has disabled the task limit in each status`
    );
  }

  taskManagement.setLimitMaximumTask(
    responese.limitMaximumTask,
    responese.noOfTasks
  );
}

function backToPrevious() {
  taskManagement.clearAllTask();
  statusManagement.clearAllStatus();
  router.push("/board");
}
function closeVisibleModal(isClose) {
  showVisibilityModal.value = isClose;
}
</script>

<template>
  <Teleport to="body" v-if="showLimitModal">
    <LimitTaskModal
      @cancel="limitModalHandler"
      @save="handelLimit"
      :isLimit="isLimit"
      :limitMaximum="limitMaximux"
    />
  </Teleport>
  <Teleport to="body" v-if="showVisibilityModal">
    <VisibleModal
      @cancel="closeVisibleModal"
      @save="handleVisible"
      :isPublic="accountStore.getVisibility()"
    />
  </Teleport>
  <div
    class="flex flex-row justify-between tablet:h-[auto] tablet:flex-col w-[100%] h-[75px] mb-[15px]0"
  >
    <div class="flex h-[85%]">
      <img
        class="mr-[10px] tablet:w-[15%] laptop:w-[100px] mobile:w-[5%] mobile-M:hidden"
        src="/image/SIT-logo.png"
      />

      <h1 class="text-[22px] text-gray-700 font-[800] mt-[10px]">
        IT-Bangmod Kradan Kanban
      </h1>
    </div>
    <div class="flex mobile:flex-col tablet:justify-between gap-[15px] h-[75%]">
      <div class="flex mobile:items-center mobile-L:flex-col">
        <div
          class="itbkk-manage-status itbkk-button-home mobile-L:w-[235px] cursor-pointer hover:bg-gray-200 duration-100 bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px] w-[200px] h-[45px] m-[7px] py-[7px] px-[5px] text-center"
          :class="isboardSelect ? '' : 'pointer-events-none'"
          @click="toggleMode"
        >
          <div
            v-if="toggleManage === 'Home'"
            class="flex items-center justify-center gap-[10px]"
          >
            <h1>
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
          class="itbkk-status-filter flex justify-between w-[202px] mobile-L:w-[235px] h-[45px] px-[10px] m-[auto] hover:bg-gray-200 duration-100 bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px]"
          :class="isboardSelect ? '' : 'pointer-events-none'"
        >
          <div
            class="dropdown dropdown-bottom text-xs font-medium cursor-pointer"
          >
            <div
              tabindex="0"
              role=""
              class="cursor-pointer w-full flex items-center"
            >
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
                    class="itbkk-filter-item min-w-[120px] max-h-[60px] mb-5 pt-6 hover:bg-gray-100 text-gray-400 border border-gray-400 rounded-md flex flex-row gap-[5px] w-auto items-center justify-center p-0.5 me-2 text-sm font-normal"
                  >
                    <div
                      class="relative mb-5 transition-all text-sm duration-75 rounded-md flex"
                    >
                      {{ status }}
                      <div
                        @click="filterDeleteSelection(status)"
                        class="itbkk-filter-item-clear z-[10]"
                      >
                        <p
                          class="itbkk-item-clear pr-1 hover:text-red-500 text-gray-400"
                        >
                          &nbsp;&nbsp;&nbsp;&nbsp; X
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul
              tabindex="0"
              class="dropdown-content z-[1] menu shadow rounded-[10px] w-[150px] bg-white"
            >
              <li
                v-for="(status, index) in statusManagement.getAllStatus()"
                :key="index"
                class="break-all itbkk-status-choice"
                @click="filterSelection(status.name)"
              >
                <a
                  :class="
                    statusFilter.includes(status.name) ? 'bg-[#D7D7D7]' : ''
                  "
                  >{{ status.name }}</a
                >
              </li>
            </ul>
          </div>
          <div
            @click="filterClearSelection"
            class="flex justify-center items-center cursor-pointer"
          >
            <p
              class="hover:text-red-600 border-6 rounded-md border-gray-50 pr-1.5"
            >
              X
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-center mobile:flex-row l gap-[10px]">
        <div
          @click="sortTask"
          :class="isboardSelect ? '' : 'pointer-events-none'"
          class="itbkk-status-sort bg-[#F9F9F9] hover:bg-gray-200 w-[45px] min-w-[px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px] duration-100"
        >
          <div v-if="sortState === 0" class="flex justify-center mt-[5px]">
            <img src="/image/up-and-down-icon.png" class="w-[30px] h-[30px]" />
          </div>
          <div
            v-if="sortState === 1"
            class="flex justify-center mt-[5.5px] mr-1"
          >
            <img src="/image/a-z-blue.png" class="w-[30px] h-[30px]" />
          </div>
          <div v-if="sortState === 2" class="flex justify-center mt-[6px]">
            <img src="/image/z-a-blue.png" class="w-[30px] h-[30px]" />
          </div>
        </div>
        <TooltipBtn>
          <div
            @click="limitModalHandler(true)"
            :class="!permission ? 'pointer-events-none opacity-50' : ''"
            class="itbkk-status-setting flex justify-center items-center bg-[#F9F9F9] hover:bg-gray-200 duration-100 w-[45px] min-w-[40px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px]"
          >
            <div class="flex justify-center">
              <img src="/image/setting-icon.png" class="w-[25px] h-[25px]" />
            </div>
          </div>
        </TooltipBtn>
      </div>
      <RouterLink v-if="!accountStore.getisLogin()" :to="{name: 'login'}">
        <div class="flex btn btn-outline mt-[5px]">Login</div>
      </RouterLink>
      <div v-else class="dropdown dropdown-end flex items-center">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle avatar flex items-center w-auto"
          style="min-width: 170px; padding: 0 10px"
        >
          <div
            class="flex-shrink-0 w-[50px] h-[50px] mb-auto rounded-full overflow-hidden"
          >
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            class="ml-2 font-inter flex-1 flex flex-col justify-center h-[50px] w-[125px]"
          >
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
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-[100px] w-52 p-2 shadow cursor-none"
        >
          <li>
            <a @click="handleLogout(false)">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div
    v-show="isboardSelect"
    class="breadcrumbs flex justify-between text-sm overflow-visible"
  >
    <ul class="w-[50%]">
      <li @click="backToPrevious"><a>Home</a></li>
      <li>
        {{ boardName?.name }}
      </li>
    </ul>
    <TooltipBtn>
      <ul>
        <li class="border">
          <div class="itbkk-board-visibility form-control w-[120px]">
            <label class="label cursor-pointer">
              <span>{{
                visibilityToggle === false ? "private" : "public"
              }}</span>

              <input
                v-model="visibilityToggle"
                :disabled="!permission"
                type="checkbox"
                @click.prevent="openVisibilityModal"
                class="toggle bg bg-gray-200 checked:bg-blue-500"
                :class="!permission ? 'disabled' : ''"
              />
            </label>
          </div>
        </li>
      </ul>
    </TooltipBtn>
  </div>
</template>

<style scoped></style>
