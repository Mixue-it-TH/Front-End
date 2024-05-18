<script setup>
import router from "@/router"
import { onMounted, ref, watchEffect } from "vue"
import { RouterLink } from "vue-router"
import { getTaskList, deleteTaskById } from "@/util/fetchUtils"
import { convertStatus } from "@/util/formatUtils"
import { getStatusList, handelLimitMaximum } from "@/util/statusFetchUtils"
import { useTasks } from "@/store/task.js"
import { useStatus } from "@/store/status.js"
import ListTask from "@/components/ListTask.vue"
import DeleteTaskModal from "@/components/DeleteTaskModal.vue"
import LimitTaskModal from "@/components/LimitTaskModal.vue"
import ListStatus from "@/components/ListStatus.vue"

const emit = defineEmits(["alert"])

const taskManagement = useTasks()
const statusManagement = useStatus()
const isEmptyTask = ref(false)
const taskDetails = ref({})
const showDeleteModal = ref(false)
const showLimitModal = ref(false)
const taskNumber = ref()
const showTask = ref(true)
const toggleManage = ref(" Mannage Status")
const sortState = ref(0)
const statusFilter = ref([])
const limitMaximux = ref(10)
const isLimit = ref(false)
// const dataLoaded = ref(false)
onMounted(async () => {
	const listTasks = await getTaskList(import.meta.env.VITE_BASE_URL + "/tasks")
	const listStatuses = await getStatusList(
		import.meta.env.VITE_BASE_URL + "/statuses"
	)
	const isEnbleLimit = await getTaskList(
		import.meta.env.VITE_BASE_URL + "/tasks/islimit"
	)

	isLimit.value = isEnbleLimit.limit
	limitMaximux.value = isEnbleLimit.number
	console.log(limitMaximux.value)
	console.log(isLimit.value)
	if (listTasks.length === 0) isEmptyTask.value = true
	taskManagement.addTasks(listTasks)
	statusManagement.addStatuses(listStatuses)
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
	console.log(response)
	if (response.status === 200) {
		taskManagement.deleteTask(id)
		showDeleteModal.value = false
		taskDetails.value = {}
		emit("alert", taskDetails.value.title, "deleted", "task")
	}
	if (response.status === 404) {
		emit("alert", taskDetails.value.title, "deleting", "task", "error")
		taskManagement.deleteTask(id)
		showDeleteModal.value = false
		taskDetails.value = {}
	}
}
function limitModalHandler(isClose) {
	showLimitModal.value = isClose
}

function filterSelection(statusName) {
	const isDuplicate = statusFilter.value.filter((status) => {
		console.log(status)
		return status === statusName
	})
	if (isDuplicate.length === 0) statusFilter.value.push(statusName)
}
function filterDeleteSelection(statusName) {
	console.log(statusName)
	statusFilter.value = statusFilter.value.filter((status) => {
		return status !== statusName
	})
}

function filterClearSelection() {
	statusFilter.value = []
}

function toggleMode() {
	if (showTask.value) {
		showTask.value = false
		toggleManage.value = "Home"
		if (!router.currentRoute.value.fullPath.includes("status"))
			router.push("/status")
	} else {
		showTask.value = true
		toggleManage.value = " Mannage Status"
		router.push("/task")
	}
}
function sortTask() {
	sortState.value = taskManagement.sortTaskByStatusName(sortState.value)
}

async function handelLimit(enable, amountLimit) {
	const respone = await handelLimitMaximum(
		import.meta.env.VITE_BASE_URL + `/statuses/maximum-task`,
		enable,
		amountLimit
	)
	console.log(enable, amountLimit)
	alertMessageHandler("limit", respone.number, null)
	taskManagement.setLimitMaximumTask(enable, amountLimit)
	showLimitModal.value = false
	isLimit.value = enable
}

function alertMessageHandler(title, status, data, type = "success") {
	emit("alert", title, status, data, type)
}

watchEffect(async () => {
	//back up
	let ss

	let arr = []
	if (statusFilter.value.length !== 0) {
		ss = statusFilter.value.toString()
		console.log(ss)
	}
	arr = await getTaskList(
		import.meta.env.VITE_BASE_URL + `/tasks?filterStatuses=${ss}`
	)

	if (arr.length !== 0) {
		taskManagement.addFilter(arr)
	} else {
		taskManagement.addFilter(0)
	}
})
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
		class="w-screen min-h-screen h-auto bg-[#F4F4F4] px-[35px] py-[25px] font-nonto"
	>
		<div
			class="flex flex-row justify-between items-center w-[100%] h-[75px] mb-[15px]"
		>
			<div class="h-[75%] mt-[20px] mb-20px">
				<h1 class="text-[24px] text-gray-700 font-[800]">
					IT-Bangmod Kradan Kanban
				</h1>
			</div>
			<div class="flex flex-row gap-[15px] h-[75%]">
				<div
					class="itbkk-manage-status itbkk-button-home cursor-pointer hover:bg-gray-100 bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px] w-[200px] h-[40px] m-[7px] py-[7px] px-[5px] text-center"
					@click="toggleMode"
				>
					<h1>
						{{ toggleManage }}
					</h1>
				</div>
				<div
					class="itbkk-status-filter flex justify-between w-[202px] h-[45px] px-[10px] m-[auto] hover:bg-gray-100 bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px]"
				>
					<div
						class="dropdown dropdown-bottom text-xs font-medium cursor-pointer"
					>
						<div
							tabindex="0"
							role=""
							class="h-full cursor-pointer w-full flex items-center pb-3"
						>
							<div class="">
								<div v-if="statusFilter.length === 0">
									<p class="pl-8 pt-3.5">Filter by status(es)</p>
								</div>

								<div
									v-else
									class="flex gap-[8px] w-[150px] pb-[30px] overflow-auto pt-[30px]"
									tabindex="0"
									role=""
								>
									<div
										v-for="(status, index) in statusFilter"
										:key="index"
										class="itbkk-filter-item hover:bg-gray-100 text-gray-400 border border-gray-400 rounded-md mt-2.5 flex flex-row gap-[5px] w-auto items-center justify-center p-0.5 me-2 text-sm font-medium"
									>
										<div
											class="relative transition-all text-sm duration-75 rounded-md flex"
										>
											{{ status }}
											<div
												@click="filterDeleteSelection(status)"
												class="itbkk-filter-item-clear z-[10]"
											>
												<p
													class="itbkk-item-clear pr-1 hover:text-red-500 text-gray-400"
												>
													&nbsp;&nbsp;X
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
								class="break-all"
								@click="filterSelection(status.name)"
							>
								<a>{{ status.name }}</a>
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
				<div
					@click="sortTask"
					class="itbkk-status-sort bg-[#F9F9F9] hover:bg-gray-100 w-[45px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px]"
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
				<div
					@click="limitModalHandler(true)"
					class="flex justify-center items-center bg-[#F9F9F9] hover:bg-gray-100 w-[45px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px]"
				>
					<div class="flex justify-center">
						<img src="/image/setting-icon.png" class="w-[25px] h-[25px]" />
					</div>
				</div>
			</div>
		</div>
		<ListTask
			v-if="showTask"
			@delete="deleteModalHandler"
			:sortState="sortState"
		/>
		<ListStatus v-else @alert="alertMessageHandler" />
	</div>
</template>

<style scoped></style>
@/store/task
