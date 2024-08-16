<script setup>
import router from "@/router"
import { onMounted, ref } from "vue"
import { getTaskList, deleteTaskById } from "@/util/fetchUtils"
import { getStatusList, handelLimitMaximum } from "@/util/statusFetchUtils"
import { useTasks } from "@/store/task.js"
import { useStatus } from "@/store/status.js"
import ListTask from "@/components/ListTask.vue"
import DeleteTaskModal from "@/components/DeleteTaskModal.vue"
import LimitTaskModal from "@/components/LimitTaskModal.vue"
import ListStatus from "@/components/ListStatus.vue"
import { RouterLink } from "vue-router"
import { useAccount } from "@/store/account"

const emit = defineEmits(["alert"])

const taskManagement = useTasks()
const statusManagement = useStatus()
const isEmptyTask = ref(false)
const taskDetails = ref({})
const showDeleteModal = ref(false)
const showLimitModal = ref(false)
const taskNumber = ref()
const showTask = ref(true)
const toggleManage = ref(" Manage Status")
const sortState = ref(0)
const statusFilter = ref([])
const limitMaximux = ref(10)
const isLimit = ref(false)
const limitReached = ref([])
const isLogin = ref(false)
const accountStore = useAccount()
const userDetails = ref(accountStore.getData())

onMounted(async () => {
  if(localStorage.getItem("token")) {
    const token = localStorage.getItem("token")
    accountStore.setisLogin(true)
    accountStore.decodedToken(token)
  }
  const listTasks = await getTaskList(import.meta.env.VITE_BASE_URL + "/tasks")
  const listStatuses = await getStatusList(
    import.meta.env.VITE_BASE_URL + "/statuses"
  )
  const isEnbleLimit = await getTaskList(
    import.meta.env.VITE_BASE_URL + "/statuses/islimit"
  )
  isLimit.value = isEnbleLimit.limitMaximumTask
  limitMaximux.value = isEnbleLimit.noOfTasks
  const responese = await handelLimitMaximum(
    import.meta.env.VITE_BASE_URL + `/statuses/maximum-task`,
    isLimit.value,
    limitMaximux.value
  )
  limitReached.value = responese.statusList
  taskManagement.setLimitMaximumTask(
    isEnbleLimit.limitMaximumTask,
    isEnbleLimit.noOfTasks
  )
  taskManagement.addTasks(listTasks)
  statusManagement.addStatuses(listStatuses)
  if (listTasks.length === 0) isEmptyTask.value = true

  if (router.currentRoute.value.fullPath.includes("status")) toggleMode()

  
})

function deleteModalHandler(tasks, number) {
  taskDetails.value = tasks
  taskNumber.value = number
  showDeleteModal.value = true
}
function closeDeleteModal(isClose) {
  taskDetails.value = {}
  showDeleteModal.value = isClose
}
async function confirmDelete(id) {
  const response = await deleteTaskById(
    import.meta.env.VITE_BASE_URL + "/tasks",
    id
  )
  if (typeof response === "object") {
    taskManagement.deleteTask(id)
    showDeleteModal.value = false
    taskDetails.value = {}
    emit("alert", "success", "The task has been deleted successfully")
  } else if (response === 404) {
    emit("alert", "error", "An error has occurred, the task does not exist")
    taskManagement.deleteTask(id)
    showDeleteModal.value = false
    taskDetails.value = {}
  }
}
function limitModalHandler(isClose) {
  showLimitModal.value = isClose
}

async function filterSelection(statusName) {
  const isDuplicate = statusFilter.value.filter((status) => {
    return status === statusName
  })
  if (isDuplicate.length === 0) {
    statusFilter.value.push(statusName)
  } else {
    statusFilter.value = statusFilter.value.filter((status) => {
      return status !== statusName
    })
  }
  taskManagement.addFilter(statusFilter.value)
  if (sortState.value === 0) {
    taskManagement.sortTaskByStatusName(2)
  } else {
    taskManagement.sortTaskByStatusName(taskManagement.getCurrentState())
  }
}
function filterDeleteSelection(statusName) {
  statusFilter.value = statusFilter.value.filter((status) => {
    return status !== statusName
  })
  taskManagement.addFilter(statusFilter.value)
  if (sortState.value === 0) {
    taskManagement.sortTaskByStatusName(2)
  } else taskManagement.sortTaskByStatusName(taskManagement.getCurrentState())
}

function filterClearSelection() {
  statusFilter.value = []
  taskManagement.addFilter(statusFilter.value)
  if (sortState.value === 0) {
    taskManagement.sortTaskByStatusName(2)
  } else taskManagement.sortTaskByStatusName(taskManagement.getCurrentState())
}

function toggleMode() {
  if (showTask.value) {
    showTask.value = false
    toggleManage.value = "Home"
    if (!router.currentRoute.value.fullPath.includes("status"))
      router.push("/status")
  } else {
    showTask.value = true
    toggleManage.value = " Manage Status"
    router.push("/task")
  }
}
function sortTask() {
  sortState.value = taskManagement.sortTaskByStatusName(sortState.value)
}

async function handelLimit(enable, amountLimit) {
  const responese = await handelLimitMaximum(
    import.meta.env.VITE_BASE_URL + `/statuses/maximum-task`,
    enable,
    amountLimit
  )
  if (responese.limitMaximumTask) {
    emit(
      "alert",
      "success",
      `The Kanban board now limits ${responese.noOfTasks} tasks in each status`
    )
  } else {
    emit(
      "alert",
      "success",
      `The Kanban board has disabled the task limit in each status`
    )
  }
  taskManagement.setLimitMaximumTask(
    responese.limitMaximumTask,
    responese.noOfTasks
  )

  limitReached.value = responese.statusList
  limitMaximux.value = amountLimit
  showLimitModal.value = false
  isLimit.value = enable
}
function alertMessageHandler(type = "success", text) {
  emit("alert", type, text)
}

function loginHandle(login){
  if(!login){
    accountStore.setisLogin(login)
    localStorage.removeItem("token")
  }
}

</script>

<template>
  <Teleport to="body" v-if="showDeleteModal">
    <DeleteTaskModal
      @cancel="closeDeleteModal"
      @confirm="confirmDelete"
      :taskDetails="taskDetails"
      :taskNumber="taskNumber"
    />
  </Teleport>
  <Teleport to="body" v-if="showLimitModal">
    <LimitTaskModal
      @cancel="limitModalHandler"
      @save="handelLimit"
      :isLimit="isLimit"
      :limitMaximum="limitMaximux"
    />
  </Teleport>

  <div
    class="w-full h-[auto] bg-[#F4F4F4] text-gray-700 px-[2%] py-[25px] font-nonto"
  >
    <div
      class="flex flex-row justify-between tablet:h-[auto] tablet:flex-col w-[100%] h-[75px] mb-[15px]0"
    >
      <div class="flex h-[85%]">
        <h1 class="text-[22px] text-gray-700 font-[800] mt-[10px]">
          IT-Bangmod Kradan Kanban
        </h1>
        <img
          class="ml-[10px] tablet:w-[15%] laptop:w-[100px] mobile:w-[5%] mobile-M:hidden"
          src="/image/SIT-logo.png"
        />
      </div>
      <div
        class="flex mobile:flex-col tablet:justify-between gap-[15px] h-[75%]"
      >
        <div class="flex mobile:items-center mobile-L:flex-col">
          <div
            class="itbkk-manage-status itbkk-button-home mobile-L:w-[235px] cursor-pointer hover:bg-gray-200 duration-100 bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px] w-[200px] h-[45px] m-[7px] py-[7px] px-[5px] text-center"
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
        <div class="flex mobile:flex-row l gap-[10px]">
          <div
            @click="sortTask"
            class="itbkk-status-sort bg-[#F9F9F9] hover:bg-gray-200 w-[45px] min-w-[px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px] duration-100"
          >
            <div v-if="sortState === 0" class="flex justify-center mt-[5px]">
              <img
                src="/image/up-and-down-icon.png"
                class="w-[30px] h-[30px]"
              />
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
          <div
            @click="limitModalHandler(true)"
            class="itbkk-status-setting flex justify-center items-center bg-[#F9F9F9] hover:bg-gray-200 duration-100 w-[45px] min-w-[40px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px]"
          >
            <div class="flex justify-center">
              <img src="/image/setting-icon.png" class="w-[25px] h-[25px]" />
            </div>
          </div>
        </div>
        <div v-if="!accountStore.getisLogin()" class="flex btn btn-outline mt-[5px]">
          <RouterLink :to="{name:'login'}">Login</RouterLink :to="{name:'login'}">
        </div>
        <div v-else class="dropdown dropdown-end flex">
          
          <div
            tabindex="0"
            role="button"
            class=" btn btn-ghost btn-circle avatar"
          >
            <div class="w-[50px] rounded-full">
              <img src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg">
              
            </div>
            
          
          </div>
          <div>{{ accountStore.getData().name }}</div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a @click="loginHandle(false)">Logout</a>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <ListTask
      v-if="showTask"
      @delete="deleteModalHandler"
      :listTasks="taskManagement.getAllTask()"
    />
    <ListStatus
      v-else
      @alert="alertMessageHandler"
      :limitExceed="limitReached"
    />
  </div>
</template>

<style scoped>
.transition {
  transition: all 0.3s ease-in-out;
}

.transition:hover {
  transform: scale(1.1);
}
</style>
