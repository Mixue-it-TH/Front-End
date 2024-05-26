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
const limitReached = ref([])

onMounted(async () => {
	const listTasks = await getTaskList(import.meta.env.VITE_BASE_URL + "/tasks")
	const listStatuses = await getStatusList(
		import.meta.env.VITE_BASE_URL + "/statuses"
	)
	const isEnbleLimit = await getTaskList(
		import.meta.env.VITE_BASE_URL + "/statuses/islimit"
	)

	//ปัญหาคือจะต้องเช็คตัวแปรพร้อมจำนวน task ยังไงเพื่อที่จะได้ส่งตัวแปรไปให้ ListStatus เช็ค

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
	console.log(response)
	if (response.status === 200) {
		taskManagement.deleteTask(id)
		showDeleteModal.value = false
		taskDetails.value = {}
		emit("alert", "success", "The task has been deleted successfully")
	}
	if (response.status === 404) {
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
		toggleManage.value = " Mannage Status"
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
	// limitReached คือค่าที่นำไปบอก user ว่า status นี้ถึง taskLimit แล้ว
	limitReached.value = responese.statusList
	limitMaximux.value = amountLimit
	showLimitModal.value = false
	isLimit.value = enable
}
function alertMessageHandler(type = "success", text) {
	emit("alert", type, text)
}
</script>

<template>
	<Teleport to="body" v-if="showDeleteModal">
		<DeleteTaskModal @cancel="closeDeleteModal" @confirm="confirmDelete" :taskDetails="taskDetails"
			:taskNumber="taskNumber" />
	</Teleport>
	<Teleport to="body" v-if="showLimitModal">
		<LimitTaskModal @cancel="limitModalHandler" @save="handelLimit" :isLimit="isLimit"
			:limitMaximum="limitMaximux" />
	</Teleport>
	<div class="w-full h-[auto] bg-[#F4F4F4] text-gray-700 px-[2%] py-[25px] font-nonto ">
		<div class="flex flex-row  justify-between tablet:h-[auto] tablet:flex-col  w-[100%] h-[75px] mb-[15px]0">
			<div class="h-[75%] mt-[20px] mb-[20px]">
				<h1 class="text-[24px] text-gray-700 font-[800]">
					IT-Bangmod Kradan Kanban
				</h1>
			</div>
			<div class="flex mobile:flex-col tablet:justify-between gap-[15px] h-[75%]">
				<div class="flex mobile:items-center mobile-L:flex-col">
					<div class="itbkk-manage-status itbkk-button-home mobile-L:w-[235px] hover:bg-gray-200 duration-100 bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px] w-[200px] h-[45px] m-[7px] py-[7px] px-[5px] text-center "
						@click="toggleMode">
						<h1>
							{{ toggleManage }}
						</h1>
					</div>
					<div
						class="itbkk-status-filter flex justify-between w-[202px] mobile-L:w-[235px] h-[45px] px-[10px] m-[auto] hover:bg-gray-200 duration-100 bg-[#F9F9F9] border border-[#BDBDBD] rounded-[4px]">
						<div class="dropdown dropdown-bottom text-xs font-medium cursor-pointer">
							<div tabindex="0" role="" class="cursor-pointer w-full flex items-center">
								<div class="mt-2 overflow-auto">
									<div v-if="statusFilter.length === 0">
										<p class="pl-8 pt-[5px]">Filter by status(es)</p>
									</div>

									<div v-else
										class="flex gap-[8px] w-[150px] absolute mb-5s max-h-[55px] overflow-y-hidden"
										tabindex="0" role="">
										<div v-for="(status, index) in statusFilter" :key="index"
											class="itbkk-filter-item min-w-[120px] max-h-[60px] mb-5 pt-6 hover:bg-gray-100 text-gray-400 border border-gray-400 rounded-md flex flex-row gap-[5px] w-auto items-center justify-center p-0.5 me-2 text-sm font-normal">
											<div
												class="relative mb-5 transition-all text-sm duration-75 rounded-md flex">
												{{ status }}
												<div @click="filterDeleteSelection(status)"
													class="itbkk-filter-item-clear z-[10]">
													<p class="itbkk-item-clear pr-1 hover:text-red-500 text-gray-400">
														&nbsp;&nbsp;&nbsp;&nbsp; X
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<ul tabindex="0"
								class="dropdown-content z-[1] menu shadow rounded-[10px] w-[150px] bg-white">
								<li v-for="(status, index) in statusManagement.getAllStatus()" :key="index"
									class="break-all itbkk-status-choice" @click="filterSelection(status.name)">
									<a :class="statusFilter.includes(status.name) ? 'bg-[#D7D7D7]' : ''">{{ status.name
										}}</a>
								</li>
							</ul>
						</div>
						<div @click="filterClearSelection" class="flex justify-center items-center cursor-pointer">
							<p class="hover:text-red-600 border-6 rounded-md border-gray-50 pr-1.5">
								X
							</p>
						</div>
					</div>
				</div>
				<div class="flex mobile:flex-row l gap-[10px]">
					<div @click="sortTask"
						class="itbkk-status-sort bg-[#F9F9F9]  hover:bg-gray-200 w-[45px] min-w-[px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px] duration-100">
						<div v-if="sortState === 0" class="flex justify-center mt-[5px]">
							<img src="/image/up-and-down-icon.png" class="w-[30px] h-[30px]" />
						</div>
						<div v-if="sortState === 1" class="flex justify-center mt-[5.5px] mr-1">
							<img src="/image/a-z-blue.png" class="w-[30px] h-[30px]" />
						</div>
						<div v-if="sortState === 2" class="flex justify-center mt-[6px]">
							<img src="/image/z-a-blue.png" class="w-[30px] h-[30px]" />
						</div>
					</div>
					<div @click="limitModalHandler(true)"
						class="itbkk-status-setting flex justify-center items-center bg-[#F9F9F9] hover:bg-gray-200 duration-100 w-[45px] min-w-[40px] h-[45px] m-[auto] cursor-pointer border border-[#BDBDBD] rounded-[4px]">
						<div class="flex justify-center">
							<img src="/image/setting-icon.png" class="w-[25px] h-[25px]" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<ListTask v-if="showTask" @delete="deleteModalHandler" :listTasks="taskManagement.getAllTask()" />
		<ListStatus v-else @alert="alertMessageHandler" :limitExceed="limitReached" />
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
