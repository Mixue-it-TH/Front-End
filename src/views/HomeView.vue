<script setup>
import router from "@/router"
import { onMounted, ref } from "vue"
import { RouterLink } from "vue-router"
import { getTaskList, deleteTaskById } from "@/util/fetchUtils"
import { convertStatus } from "@/util/formatUtils"
import { getStatusList } from "@/util/statusFetchUtils"
import { useTasks } from "@/store/task.js"
import { useStatus } from "@/store/status.js"
import ListTask from "@/components/ListTask.vue"
import DeleteTaskModal from "@/components/DeleteTaskModal.vue"
import ListStatus from "@/components/ListStatus.vue"

const emit = defineEmits(["alert"])

const taskManagement = useTasks()
const statusManagement = useStatus()
const isEmptyTask = ref(false)
const taskDetails = ref({})
const showDeleteModal = ref(false)
const taskNumber = ref()
const showTask = ref(true)
const toggleManage = ref(" Mannage Status")

onMounted(async () => {
	const listTasks = await getTaskList(
		import.meta.env.VITE_BASE_URL + "/v1/tasks"
	)
	const listStatuses = await getStatusList(
		import.meta.env.VITE_BASE_URL + "/v2/statuses"
	)
	if (listTasks.length === 0) isEmptyTask.value = true
	taskManagement.addTasks(listTasks)
	statusManagement.addStatuses(listStatuses)
	if (router.currentRoute.value.fullPath.includes('status')) toggleMode()

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
		import.meta.env.VITE_BASE_URL + "/v1/tasks",
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

function toggleMode() {
	if (showTask.value) {
		showTask.value = false
		toggleManage.value = "Home"
		if (!router.currentRoute.value.fullPath.includes('status')) router.push("/status")
	} else {
		showTask.value = true
		toggleManage.value = " Mannage Status"
		router.push("/task")
	}
}

function alertMessageHandler(title, status, data, type = "success") {
	emit("alert", title, status, data, type)

}

</script>

<template>
	<Teleport to="body" v-if="showDeleteModal">
		<DeleteTaskModal @cancel="closeDeleteModal" @confirm="confirmDelete" :taskDetails="taskDetails"
			:taskNumber="taskNumber" />
	</Teleport>
	<div class="w-screen h-screen bg bg-[#F4F4F4] px-[35px] py-[25px] font-nonto">
		<div class="flex flex-row justify-between items-center w-[100%] h-[75px] mb-[15px]">
			<div class="h-[75%] mt-[20px]">
				<h1 class="text-[24px] text-gray-700 font-[800]">
					IT-Bangmod Kradan Kanban
				</h1>
			</div>
			<div class="flex flex-row gap-[15px] h-[75%]">
				<div class="itbkk-manage-status itbkk-button-home cursor-pointer border border-[#BDBDBD] rounded-[4px] w-[200px] h-[40px] m-[7px] py-[7px] px-[5px] text-center"
					@click="toggleMode">
					<h1>{{ toggleManage }}</h1>
				</div>
				<div class="flex w-[202px] h-[45px] px-[5px] m-[auto] border border-[#BDBDBD] rounded-[4px]">
					<select class="w-[200px]">
						<option>Show: All</option>
						<option>Show: Test</option>
						<option>Show: Test</option>
					</select>
				</div>
				<div class="w-[45px] h-[45px] m-[auto] border border-[#BDBDBD] rounded-[4px]">
					<div class="flex justify-center mt-[5px]">
						<img src="/image/up-and-down-icon.png" class="w-[30px] h-[30px]" />
					</div>
				</div>
				<div class="w-[45px] h-[45px] m-[auto] border border-[#BDBDBD] rounded-[4px]">
					<div class="flex justify-center mt-[5px]">
						<img src="/image/filter-icon.png" class="w-[30px] h-[30px]" />
					</div>
				</div>
			</div>
		</div>
		<ListTask v-if="showTask" @delete="deleteModalHandler" />
		<ListStatus v-else @alert="alertMessageHandler" />
	</div>
</template>

<style scoped></style>
@/store/task
