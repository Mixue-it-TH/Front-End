<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useTasks } from "@/store/task.js"
import { useStatus } from "@/store/status.js"
import { getTaskById, addTask, editTask } from "@/util/fetchUtils"
import { convertUtils, convertStatus } from "@/util/formatUtils"
import { useAlert } from "@/store/alert"
import { useAccount } from "@/store/account"

const alertManagement = useAlert()
const taskManagement = useTasks()
const accountStore = useAccount()
const taskMessage = ref()
const statusManagement = useStatus()
const router = useRouter()
const route = useRoute()
const taskDetails = ref({
  title: "",
  assignees: "",
  description: "",
  status: { id: 1 }
})
const oldTask = ref({
  title: "",
  assignees: "",
  description: "",
  status: { id: 1 }
})
const isDisable = ref(true)
const mode = ref("read")
const dataLoaded = ref(false)

onMounted(async () => {
  const fullPath = router.currentRoute.value.fullPath
  const data = fullPath.split("/")

  if (data.length === 5 && !data.includes("add")) {
    actionHandler(data[4], "read")
  } else if (data.includes("add")) {
    actionHandler(null, "add")
  } else if (data.includes("edit")) {
    actionHandler(data[4], "edit")
  }
  dataLoaded.value = true
})

async function actionHandler(id, action) {
  if (action === "read") {
    const response = await getTaskById(id, route.params.id)

    if (typeof response === "object") {
      console.log(response)
      taskDetails.value = response

      taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn)
      taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn)
      mode.value = "read"
    } else if (response === 404) {
      alertManagement.statusHandler(
        "error",
        `An error has occurred, the task doesn't exit `
      )
      router.push("/")
    } else {
      alertManagement.statusHandler(
        "error",
        `For security reasons, your session has expired. Please log back in.`
      )
      accountStore.unAuthorizeHandle()
    }
  } else if (action === "add") {
    mode.value = "add"
  } else if (action === "edit") {
    const response = await getTaskById(id, route.params.id)
    if (typeof response === "object") {
      taskDetails.value = response
      taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn)
      taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn)
      oldTask.value = { ...taskDetails.value }
      mode.value = "edit"
    } else if (response === 404) {
      alertManagement.statusHandler(
        "error",
        "The requested task does not exist"
      )
      router.push("/")
    } else {
      alertManagement.statusHandler(
        "error",
        `For security reasons, your session has expired. Please log back in.`
      )
      accountStore.unAuthorizeHandle()
    }
  }
}
async function confirmHandeler() {
  if (mode.value === "add") {
    if (!taskDetails.value?.status) taskDetails.value.status = 1
    const respone = await addTask(taskDetails.value, route.params.id)
    if (typeof respone === "object") {
      alertManagement.statusHandler(
        "success",
        "The task has been added successfully"
      )
      taskManagement.addTask(respone)
      taskManagement.sortTaskByStatusName(taskManagement.getCurrentState())
    } else if (respone === 400) {
      alertManagement.statusHandler(
        "error",
        "An error has occurred, the status limit is excreed"
      )
    }

    closeModal()
    return
  }
  if (mode.value === "edit") {
    const respone = await editTask(taskDetails.value, route.params.id)
    if (typeof respone === "object") {
      alertManagement.statusHandler(
        "success",
        "The task has been updated successfully"
      )
      taskManagement.editTask(taskDetails.value.id, respone)
      taskManagement.sortTaskByStatusName(taskManagement.getCurrentState())
    } else if (respone === 400) {
      alertManagement.statusHandler(
        "error",
        "An error has occurred, the status limit is excreed"
      )
    } else if (respone === 404) {
      alertManagement.statusHandler(
        "error",
        "The requested task does not exist"
      )
    }

    closeModal()
    return
  }
}
function saveBthHandler(isTrue = false) {
  taskMessage.value = statusManagement.getStatusById(
    taskDetails.value.status?.id
  )
  if (
    taskDetails.value.title?.length > 100 ||
    taskDetails.value.assignees?.length > 30 ||
    taskDetails.value.description?.length > 500
  ) {
    isDisable.value = true
    return
  }
  if (isTrue && taskDetails.value.title !== "") {
    isDisable.value = false
    return
  }
  if (
    JSON.stringify({ ...oldTask.value }) !==
      JSON.stringify({ ...taskDetails.value }) &&
    oldTask.value.title &&
    mode.value !== "add"
  ) {
    isDisable.value = false
    return
  }
  if (mode.value === "add" && taskDetails.value.title !== "") {
    isDisable.value = false
    return
  }
  isDisable.value = true
}
function closeModal() {
  router.go(-1)
}
</script>

<template>
  <div
    v-if="dataLoaded"
    class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto"
  >
    <div
      class="fade-up flex justify-center items-center w-[100%] h-[100%] text-[#333333]"
    >
      <div
        class="itbkk-modal-task w-[75%] min-w-[300px] h-[90%] rounded-[15px] bg bg-white"
      >
        <header
          class="h-[10%] px-[25px] mb-[10px] pt-[10px] bg bg-[#F8F8F8] border-b-2 rounded-t-[2px]"
        >
          <div class="flex gap-[10px]" v-show="mode !== 'read'">
            <div>
              {{ mode === "add" ? "New Task" : "Edit Task" }}
            </div>
            <p
              v-if="mode !== 'read'"
              class="text-[15px]"
              :class="
                taskDetails.title.length > 100
                  ? 'text-red-500'
                  : 'text-[#AFAFAF]'
              "
            >
              {{ taskDetails.title.length }}/100 characters
            </p>
          </div>

          <textarea
            class="itbkk-title h-[40px] w-[100%] text-[22px] font-[500] break-all bg-white disabled:text-black disabled:opacity-100"
            :disabled="mode === 'read'"
            placeholder="input some title"
            v-model="taskDetails.title"
            @input="saveBthHandler"
            >{{ taskDetails.title }}</textarea
          >
        </header>
        <main
          class="flex flex-row mobile-L:flex-col laptop:overflow-auto h-[80%] px-[4%]"
          :class="mode !== 'read' ? 'pt-[30px]' : ''"
        >
          <div class="w-[70%] mobile-L:w-[100%] h-[100%] py-[10px]">
            <p class="font-[600]">Description</p>
            <textarea
              v-if="mode !== 'read'"
              class="itbkk-description w-[95%] h-[80%] px-[15px] border-[2px] border-gray-400 rounded-[8px] bg-white overflow-hidden"
              v-model="taskDetails.description"
              @input="saveBthHandler"
            >
            </textarea>
            <p
              v-if="mode !== 'read'"
              class="text-[15px]"
              :class="
                taskDetails.description?.length > 500
                  ? 'text-red-500'
                  : 'text-[#AFAFAF]'
              "
            >
              {{ taskDetails.description?.length || "0" }}/500 characters
            </p>

            <div
              v-if="mode === 'read'"
              class="itbkk-description w-[95%] h-[90%] px-[15px] py-[10px] border-[2px] border-gray-400 rounded-[8px] break-all"
              :class="{ 'italic text-gray-500': !taskDetails.description }"
            >
              {{
                taskDetails.description
                  ? taskDetails.description
                  : "No Description Provided"
              }}
            </div>
          </div>
          <div
            class="flex flex-col w-[30%] mobile-L:w-[100%] mobile-L:mt-[14px] h-[94%]"
          >
            <div class="flex flex-col h-[45%] py-[10px] mb-[10px]">
              <p class="font-[650]">Assignees</p>
              <textarea
                v-if="mode !== 'read'"
                class="itbkk-assignees px-[10px] py-[12px] border-[2px] border-gray-300 rounded-[4px] break-all bg-white"
                v-model="taskDetails.assignees"
                @input="saveBthHandler"
              ></textarea>
              <p
                v-if="mode !== 'read'"
                class="text-[15px] mt-[8px]"
                :class="
                  taskDetails.assignees?.length > 30
                    ? 'text-red-500'
                    : 'text-[#AFAFAF]'
                "
              >
                {{ taskDetails.assignees?.length || "0" }}/30 characters
              </p>
              <div
                v-if="mode === 'read'"
                class="itbkk-assignees min-h-[180px] px-[10px] py-[12px] border-[2px] border-gray-300 rounded-[4px] break-all"
                :class="{ 'italic text-gray-500': !taskDetails.assignees }"
              >
                {{
                  taskDetails.assignees ? taskDetails.assignees : "Unassigned"
                }}
              </div>
            </div>
            <div class="flex flex-col gap-[20px] h-[55%] mt-[17px]">
              <div>
                <p class="font-[600]">
                  Status<span
                    v-if="mode !== 'read'"
                    class="text-red-500 text-[14px] font-[500] ml-[5px]"
                    >(The limit is
                    {{
                      taskManagement.getIsLimit() ? "Enable" : "Disable"
                    }})</span
                  >
                </p>
                <div class="border border-gray-300 min-h-[50px] rounded-[5px]">
                  <select
                    name="status"
                    class="itbkk-status w-full h-full min-h-[50px] px-[15px] bg-white"
                    v-model="taskDetails.status.id"
                    @change="saveBthHandler(true)"
                    :required="true"
                  >
                    <option
                      v-for="(status, index) in statusManagement.getAllStatus()"
                      :key="index"
                      :value="status.id"
                      class="bg-white"
                    >
                      {{ convertStatus(status.name) }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex flex-col gap-[15px]" v-if="mode !== 'add'">
                <div class="itbkk-timezone flex">
                  <p class="font-[600] mr-[10px]">TimeZone:</p>
                  <p class="ml-[auto]">
                    {{ Intl.DateTimeFormat().resolvedOptions().timeZone }}
                  </p>
                </div>
                <div class="itbkk-created-on flex">
                  <p class="font-[600]">Created On:</p>
                  <p class="ml-[auto]">{{ taskDetails.createdOn }}</p>
                </div>
                <div class="itbkk-updated-on flex">
                  <p class="font-[600]">Updated On:</p>
                  <p class="ml-[auto]">{{ taskDetails.updatedOn }}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer
          class="h-[10%] px-[25px] border-t-2 border-gray-300 bg bg-[#F8F8F8] rounded-b-[7px]"
        >
          <div
            class="flex flex-row justify-end items-center gap-[15px] mt-[10px]"
          >
            <button
              class="itbkk-button itbkk-button-confirm flex w-[65px] h-[40px] font-[600] text-white bg bg-green-500 hover:bg-green-600"
              :class="isDisable ? 'opacity-50' : ''"
              @click="confirmHandeler"
              :disabled="isDisable"
              v-show="mode !== 'read'"
            >
              <div class="m-[auto] disabled">
                {{ mode !== "read" ? "Save" : "Ok" }}
              </div>
            </button>
            <div
              class="itbkk-button itbkk-button-cancel flex w-[80px] h-[40px] font-[600] text-gary-800 bg bg-gray-200 hover:bg-gray-300"
              @click="closeModal"
            >
              <button class="m-[auto]">Cancel</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
