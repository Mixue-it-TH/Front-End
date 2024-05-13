<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useTasks } from "@/store/task.js"
import { useStatus } from "@/store/status.js"
import { getTaskById, addTask, editTask } from "@/util/fetchUtils"
import { convertUtils, convertStatus } from "@/util/formatUtils"
const emit = defineEmits(["alert"])

const taskManagement = useTasks()
const statusManagement = useStatus()
const router = useRouter()
const taskDetails = ref({
	title: "",
	assignees: "",
	description: "",
	status: { id: 1 },
})
const oldTask = ref({
	title: "",
	assignees: "",
	description: "",
	status: { id: 1 },
})
const isDisable = ref(true)
const mode = ref("read")
const dataLoaded = ref(false)

onMounted(async () => {
	const fullPath = router.currentRoute.value.fullPath
	const data = fullPath.split("/")
	if (data.length === 3 && !data.includes("add")) {
		actionHandler(data[2], "read")
	} else if (data.includes("add")) {
		actionHandler(null, "add")
	} else if (data.includes("edit")) {
		actionHandler(data[2], "edit")
	}
	dataLoaded.value = true
})

async function actionHandler(id, action) {
	if (action === "read") {
		taskDetails.value = await getTaskById(
			import.meta.env.VITE_BASE_URL + "/tasks",
			id
		)
		if (typeof taskDetails.value === "object") {
			taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn)
			taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn)
			mode.value = "read"
		} else {
			window.alert("The requested task does not exist")
			router.push("/task")
		}
	} else if (action === "add") {
		mode.value = "add"
	} else if (action === "edit") {
		taskDetails.value = await getTaskById(
			import.meta.env.VITE_BASE_URL + "/tasks",
			id
		)
		if (typeof taskDetails.value === "object") {
			taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn)
			taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn)
			oldTask.value = { ...taskDetails.value }
			mode.value = "edit"
		} else {
			window.alert("The requested task does not exist")
			router.push("/")
		}
	}
}
async function confirmHandeler() {
	if (!taskDetails.value.title) {
		window.alert("You must input title !!!")
		return
	}
	if (mode.value === "add") {
		if (!taskDetails.value?.status) taskDetails.value.status = 1
		const respone = await addTask(
			import.meta.env.VITE_BASE_URL + "/tasks",
			taskDetails.value
		)
		emit("alert", respone.title, "added", "task")
		taskManagement.addTask(respone)
		closeModal()
		return
	}
	if (mode.value === "edit") {
		const respone = await editTask(
			import.meta.env.VITE_BASE_URL + "/tasks",
			taskDetails.value
		)
		emit("alert", respone.title, "updated", "task")
		taskManagement.editTask(taskDetails.value.id, respone)
		closeModal()
		return
	}
}
function saveBthHandler(isTrue = false) {
	if (
		(JSON.stringify({ ...oldTask.value }) !==
			JSON.stringify({ ...taskDetails.value }) &&
			oldTask.value.title) || isTrue
	) {
		isDisable.value = false
		return
	}
	if (mode.value === "add" && taskDetails.value.title) {
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
	<div v-if="dataLoaded" class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto">
		<div class="fade-up flex justify-center items-center w-[100%] h-[100%]">
			<div class="w-[75%] h-[90%] rounded-[15px] bg bg-white">
				<header class="h-[10%] px-[25px] mb-[10px] pt-[10px] bg bg-[#F8F8F8] border-b-2 rounded-t-[7px]">
					<div v-show="mode !== 'read'">
						{{ mode === "add" ? "New Task" : "Edit Task" }}
					</div>
					<textarea class="itbkk-title h-[40px] w-[100%] text-[22px] font-[500] break-all"
						:disabled="mode === 'read'" placeholder="input some title" v-model="taskDetails.title"
						@input="saveBthHandler">{{ taskDetails.title }}</textarea>
				</header>
				<main class="flex flex-row h-[80%] px-[25px]">
					<div class="w-[70%] h-[100%] py-[10px]">
						<p class="font-[600]">Description</p>
						<textarea v-if="mode !== 'read'"
							class="itbkk-description w-[95%] h-[90%] px-[15px] border-[2px] border-gray-400 rounded-[8px]"
							v-model="taskDetails.description" @input="saveBthHandler">
						</textarea>
						<div v-if="mode === 'read'"
							class="itbkk-description w-[95%] h-[90%] px-[15px] py-[10px] border-[2px] border-gray-400 rounded-[8px] break-all"
							:class="{ 'italic text-gray-500': !taskDetails.description }">
							{{
		taskDetails.description
			? taskDetails.description
			: "No Description Provided"
	}}
						</div>
					</div>
					<div class="flex flex-col w-[30%] h-[94%]">
						<div class="flex flex-col h-[45%] py-[10px] mb-[15px]">
							<p class="font-[650]">Assignees</p>
							<textarea v-if="mode !== 'read'"
								class="itbkk-assignees px-[10px] py-[12px] border-[2px] border-gray-300 rounded-[4px] break-all"
								v-model="taskDetails.assignees" @input="saveBthHandler"></textarea>
							<div v-if="mode === 'read'"
								class="itbkk-assignees min-h-[180px] px-[10px] py-[12px] border-[2px] border-gray-300 rounded-[4px] break-all"
								:class="{ 'italic text-gray-500': !taskDetails.assignees }">
								{{
		taskDetails.assignees ? taskDetails.assignees : "Unassigned"
	}}
							</div>
						</div>
						<div class="flex flex-col justify-between h-[55%]">
							<div>
								<p class="font-[600]">Status</p>
								<div class="border border-gray-300 min-h-[50px] rounded-[5px]">
									<select name="status" class="itbkk-status w-full h-full min-h-[50px] px-[15px]"
										v-model="taskDetails.status.id" @change="saveBthHandler(true)" :required="true">
										<option v-for="(status, index) in  statusManagement.getAllStatus() "
											:key="index" :value="status.id">
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
				<footer class="h-[10%] px-[25px] border-t-2 border-gray-300 bg bg-[#F8F8F8] rounded-b-[7px]">
					<div class="flex flex-row justify-end items-center gap-[15px] mt-[10px]">
						<button
							class="itbkk-button itbkk-button-confirm flex w-[65px] h-[40px] font-[600] text-white bg bg-green-500 hover:bg-green-600"
							:class="isDisable ? 'opacity-50' : ''" @click="confirmHandeler" :disabled="isDisable"
							v-show="mode !== 'read'">
							<div class="m-[auto] disabled">
								{{ mode !== "read" ? "Save" : "Ok" }}
							</div>
						</button>
						<div class="itbkk-button itbkk-button-cancel flex w-[80px] h-[40px] font-[600] text-gary-800 bg bg-gray-200 hover:bg-gray-300"
							@click="closeModal">
							<button class="m-[auto]">Cancel</button>
						</div>
					</div>
				</footer>
			</div>
		</div>
	</div>
</template>

<style scoped>
.fade-up {
	animation: fadeUp 0.5s ease-out;
}

@keyframes fadeUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
