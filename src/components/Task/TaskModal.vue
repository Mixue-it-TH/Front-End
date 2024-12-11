<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTasks } from "@/store/task.js";
import { useStatus } from "@/store/status.js";
import { getTaskById, addTask, editTask } from "@/util/fetchUtils";
import { convertUtils } from "@/util/formatUtils";
import { useAlert } from "@/store/alert";
import { useAccount } from "@/store/account";
import { handleRequestWithTokenRefresh } from "@/util/handleRequest";
import UploadBtn from "../Ui/UploadBtn.vue";
import Spinner from "../Ui/Spinner.vue";
import BtnSpinner from "../Ui/BtnSpinner.vue";

const alertManagement = useAlert();
const taskManagement = useTasks();
const accountStore = useAccount();
const taskMessage = ref();
const statusManagement = useStatus();
const router = useRouter();
const route = useRoute();
const taskDetails = ref({
  title: "",
  assignees: "",
  description: "",
  status: { id: statusManagement.getAllStatus()[0].id },
  files: [],
});
const oldTask = ref({
  title: "",
  assignees: "",
  description: "",
  status: { id: statusManagement.getAllStatus()[0].id },
  files: [],
});
const isDisable = ref(true);
const mode = ref("read");
const dataLoaded = ref(false);
const permission = computed(() => accountStore.permission);
const arrayDelete = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  if (statusManagement.getAllStatus().length === 0) {
    statusManagement.addStatuses(listStatuses);
  }

  const fullPath = router.currentRoute.value.fullPath;
  const data = fullPath.split("/");

  //Check user permission to view this modal
  if (!permission.value && (data.includes("add") || data.includes("edit"))) {
    localStorage.setItem("isPrivate", "Access denied, you do not have permission to view this page.");
    router.go(-1);
  }

  if (data.length === 5 && !data.includes("add")) {
    actionHandler(data[4], "read");
  } else if (data.includes("add")) {
    actionHandler(null, "add");
  } else if (data.includes("edit")) {
    mode.value = "edit";
    actionHandler(data[4], "edit");
  }
  dataLoaded.value = true;
});

// UPLOAD BTN FUNC
function handleFileUpload(newFile) {
  taskDetails.value.files = [...taskDetails.value.files, ...newFile];
  saveBthHandler(true);
}

function removeFile(index) {
  let file = taskDetails.value.files.splice(index, 1);
  arrayDelete.value.push(file[0].id);
  saveBthHandler(true);
}

const openImageInNewTab = (url) => {
  window.open(url, "_blank");
};

async function actionHandler(id, action) {
  if (action === "read") {
    const response = await handleRequestWithTokenRefresh(getTaskById, id, route.params.id);

    if (typeof response === "object") {
      taskDetails.value = response;

      taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn);
      taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn);
      mode.value = "read";
    } else if (response === 404) {
      alertManagement.statusHandler("error", `An error has occurred, the task doesn't exit `);
      router.push("/");
    }
  } else if (action === "add") {
    mode.value = "add";
  } else if (action === "edit") {
    const response = await handleRequestWithTokenRefresh(getTaskById, id, route.params.id);
    if (typeof response === "object") {
      mode.value = "edit";
      taskDetails.value = response;
      taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn);
      taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn);
      oldTask.value = { ...taskDetails.value };
    } else if (response === 404) {
      alertManagement.statusHandler("error", "The requested task does not exist");
      router.push("/");
    }
  }
}
async function confirmHandeler() {
  if (mode.value === "add") {
    if (!taskDetails.value?.status) taskDetails.value.status = 1;
    const respone = await handleRequestWithTokenRefresh(addTask, taskDetails.value, route.params.id);

    if (respone?.id) {
      alertManagement.statusHandler("success", "The task has been added successfully");
      taskManagement.addTask(respone);
      taskManagement.sortTaskByStatusName(taskManagement.getCurrentState());
    } else if (respone.status === 403) {
      alertManagement.statusHandler("error", "You don't have permission to do this action.");
    } else if (respone.status === 400) {
      alertManagement.statusHandler("error", "An error has occurred, the status limit is excreed");
    }
    closeModal();
    return;
  }
  if (mode.value === "edit") {
    isLoading.value = true;
    const response = await handleRequestWithTokenRefresh(
      editTask,
      taskDetails.value,
      route.params.id,
      arrayDelete.value
    );

    if (response.id) {
      alertManagement.statusHandler("success", "The task has been updated successfully");
      taskManagement.editTask(taskDetails.value.id, response);
      taskManagement.sortTaskByStatusName(taskManagement.getCurrentState());
    } else if (response.status === 400) {
      alertManagement.statusHandler("error", "An error has occurred, the status limit is excreed");
    } else if (response.status === 404) {
      alertManagement.statusHandler("error", "The requested task does not exist");
    }
    closeModal();
    isLoading.value = false;
    return;
  }
}
function saveBthHandler(isTrue = false) {
  taskMessage.value = statusManagement.getStatusById(taskDetails.value.status?.id);
  if (taskDetails.value.files.length > 10) {
    isDisable.value = true;
    return;
  }
  if (
    taskDetails.value.title?.length > 100 ||
    taskDetails.value.assignees?.length > 30 ||
    taskDetails.value.description?.length > 500
  ) {
    isDisable.value = true;
    return;
  }
  if (isTrue && taskDetails.value.title !== "") {
    isDisable.value = false;
    return;
  }
  if (
    JSON.stringify({ ...oldTask.value }) !== JSON.stringify({ ...taskDetails.value }) &&
    oldTask.value.title &&
    mode.value !== "add"
  ) {
    isDisable.value = false;
    return;
  }
  if (mode.value === "add" && taskDetails.value.title !== "") {
    isDisable.value = false;
    return;
  }
  isDisable.value = true;
}
function closeModal() {
  router.go(-1);
}
</script>

<template>
  <Spinner v-if="isLoading" />
  <div v-if="dataLoaded" class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto">
    <div class="fade-up flex justify-center items-center w-[100%] h-[100%] text-secondary">
      <div class="itbkk-modal-task w-[75%] min-w-[300px] h-[90%] rounded-[15px] bg bg-primary">
        <header class="h-[10%] px-[25px] mb-[10px] pt-[10px] bg bg-primary border-b-2 rounded-t-[2px]">
          <div class="flex gap-[10px]" v-show="mode !== 'read'">
            <div>
              {{ mode === "add" ? "New Task" : "Edit Task" }}
            </div>
            <p
              v-if="mode !== 'read'"
              class="text-[15px]"
              :class="taskDetails.title.length > 100 ? 'text-red-500' : 'text-secondary'"
            >
              {{ taskDetails.title.length }}/100 characters
            </p>
          </div>

          <textarea
            class="itbkk-title h-[40px] w-[100%] text-[22px] font-[500] break-all bg-accent disabled:text-secondary disabled:opacity-100"
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
          <!-- DESCRIPTION  -->
          <div
            class="flex flex-col w-[70%] min-h-[200px] mobile-L:min-h-[500px] mob mobile-L:w-[100%] h-[80%] py-[10px]"
          >
            <p class="font-[600]">Description</p>
            <textarea
              v-if="mode !== 'read'"
              class="itbkk-description w-[95%] h-[60%] px-[15px] border-[2px] border-gray-400 rounded-[8px] bg-accent overflow-hidden"
              v-model="taskDetails.description"
              @input="saveBthHandler"
            ></textarea>
            <p
              v-if="mode !== 'read'"
              class="text-[15px]"
              :class="taskDetails.description?.length > 500 ? 'text-red-500' : 'text-[#AFAFAF]'"
            >
              {{ taskDetails.description?.length || "0" }}/500 characters
            </p>

            <div
              v-if="mode === 'read'"
              class="itbkk-description w-[95%] h-[60%] px-[15px] py-[10px] border-[2px] border-gray-400 rounded-[8px] break-all"
              :class="{ 'italic text-gray-500': !taskDetails.description }"
            >
              {{ taskDetails.description ? taskDetails.description : "No Description Provided" }}
            </div>

            <!-- ATTACHMENTS -->
            <!-- <div class="mt-[15px]">
              <p class="font-[600] mb-[5px]">
                Attachments
                <span
                  v-if="mode !== 'read'"
                  :class="taskDetails?.files?.length >= 10 ? 'text-red-500' : ''"
                  class="text-[14px] font-[400] text-[#AFAFAF]"
                >
                  {{ taskDetails.files?.length }}/10 files
                </span>
              </p>
              <UploadBtn
                @upload="handleFileUpload"
                @remove="removeFile"
                @open="openImageInNewTab"
                :files="taskDetails?.files"
                :mode="mode"
              />
            </div> -->

            <!-- <div class="outline-dashed outline-2 flex flex-col justify-center items-center mt-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-[65px]">
                <path
                  d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39L296 392c0 13.3 10.7 24 24 24s24-10.7 24-24l0-134.1 39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                />
              </svg>
              <h1>Upload a File</h1>
              <p class="text-gray-400">Drag and drop file here</p>
              
            </div> -->
            <!-- <div class="mt-10"> -->
            <div v-if="mode !== 'add'">
              <p class="font-[600]">Attachments</p>
              <UploadBtn
                @upload="handleFileUpload"
                @remove="removeFile"
                @open="openImageInNewTab"
                :files="taskDetails?.files"
                :mode="mode"
              />
            </div>

            <!-- </div> -->
          </div>
          <!-- RIGHT SECTION -->
          <div class="flex flex-col w-[30%] mobile-L:w-[100%] mobile-L: h-[65%]">
            <!-- ASSIGNEE -->
            <div class="flex flex-col h-[45%] py-[10px] mb-[70px] mobile-L:mb-[20px]">
              <p class="font-[650]">Assignees</p>
              <textarea
                v-if="mode !== 'read'"
                class="itbkk-assignees px-[10px] py-[12px] border-[2px] border-gray-300 rounded-[4px] break-all bg-accent"
                v-model="taskDetails.assignees"
                @input="saveBthHandler"
              ></textarea>
              <p
                v-if="mode !== 'read'"
                class="text-[15px] mt-[8px]"
                :class="taskDetails.assignees?.length > 30 ? 'text-red-500' : 'text-[#AFAFAF]'"
              >
                {{ taskDetails.assignees?.length || "0" }}/30 characters
              </p>
              <div
                v-if="mode === 'read'"
                class="itbkk-assignees min-h-[180px] px-[10px] py-[12px] border-[2px] border-gray-300 rounded-[4px] break-all mobile-L:min-h-[80px]"
                :class="{ 'italic text-gray-500': !taskDetails.assignees }"
              >
                {{ taskDetails.assignees ? taskDetails.assignees : "Unassigned" }}
              </div>
            </div>
            <div class="flex flex-col gap-[20px] h-[55%] mb-[170px]">
              <div>
                <p class="font-[600]">
                  Status
                  <span v-if="mode !== 'read'" class="text-red-500 text-[14px] font-[500] ml-[5px]">
                    (The limit is {{ taskManagement?.getIsLimit() ? "Enable" : "Disable" }})
                  </span>
                </p>
                <div class="border border-gray-300 min-h-[50px] rounded-[5px]">
                  <select
                    name="status"
                    class="itbkk-status w-full h-full min-h-[50px] px-[15px] bg-accent"
                    v-model="taskDetails.status.id"
                    @change="saveBthHandler(true)"
                    :required="true"
                    :disabled="mode === 'read'"
                  >
                    <option
                      v-for="(status, index) in statusManagement.getAllStatus()"
                      :key="index"
                      :value="status.id"
                      class="bg-accent"
                    >
                      {{ status.name }}
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
        <footer class="h-[10%] px-[25px] border-t-2 border-gray-300 bg bg-accent rounded-b-[7px]">
          <div class="flex flex-row justify-end items-center gap-[15px] mt-[10px]">
            <button
              class="itbkk-button itbkk-button-confirm flex w-[65px] h-[40px] font-[600] text-white bg bg-green-500 hover:bg-green-600"
              :class="isDisable ? 'opacity-50' : ''"
              @click="confirmHandeler"
              :disabled="isDisable || isLoading"
              v-show="mode !== 'read'"
            >
              <div v-if="!isLoading" class="m-[auto] disabled">
                {{ mode !== "read" ? "Save" : "Ok" }}
              </div>
              <BtnSpinner v-else class="m-[auto]" />
            </button>
            <div
              class="itbkk-button itbkk-button-cancel flex w-[80px] h-[40px] font-[600] text-white bg bg-gray-200 hover:bg-gray-300"
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
