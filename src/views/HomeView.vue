<script setup>
import { onMounted, ref } from "vue"
import { RouterLink, useRouter } from "vue-router"
import { getTaskById, getTaskList, addTask, editTask, deleteTaskById } from "@/util/fetchUtils"
import TaskModal from "@/components/TaskModal.vue"
import Listmodel from "@/components/ListModel.vue"
import taskMangement from "@/libs/taskMangement"
import DeleteModal from "@/components/DeleteModal.vue"
import AlertMessage from "@/components/AlertMessage.vue"

const router = useRouter()
const modalOpen = ref(false)
const isEmptyTask = ref(false)
const taskDetails = ref({})
const showDeleteModal = ref(false)
const showAlertModal = ref(false)
const taskNumber = ref()
const message = ref()
const statusType = ref()
const mode = ref("read")
const taskManagement = ref(new taskMangement())

onMounted(async () => {
	console.log("ON MOUNTED")
	const fullPath = router.currentRoute.value.fullPath
	const id = fullPath.split('/')[2]
	if (fullPath.includes('edit')) {
		modalHandler(id, 'edit')
	} else if (id) modalHandler(id, 'read')

	const listTasks = await getTaskList(import.meta.env.VITE_BASE_URL + "/tasks")
	if (listTasks.length === 0) isEmptyTask.value = true
	taskManagement.value.addTasks(listTasks)
});

async function modalHandler(id, action) {
	if (action === 'read') {
		taskDetails.value = await getTaskById(
			import.meta.env.VITE_BASE_URL + "/tasks",
			id
		)
		if (typeof taskDetails.value === 'object') {
			taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn)
			taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn)
			mode.value = "read"
			modalOpen.value = true
		} else {
			window.alert("The requested task does not exist")
			router.push("/")
		}
	} else if (action === 'add') {
		mode.value = "add"
		taskDetails.value = { status: "NO_STATUS" }
		modalOpen.value = true

	} else if (action === 'edit') {
		taskDetails.value = await getTaskById(
			import.meta.env.VITE_BASE_URL + "/tasks",
			id
		)
		if (typeof taskDetails.value === 'object') {
			taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn)
			taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn)
			mode.value = "edit"
			modalOpen.value = true
		} else {
			window.alert("The requested task does not exist")
			router.push("/")
		}
	}

}

function closeDeleteModal(isClose) {
	taskDetails.value = {}
	showDeleteModal.value = isClose
}
function deleteModalHandler(tasks, number) {
	taskDetails.value = tasks
	taskNumber.value = number
	showDeleteModal.value = true;
}
async function confirmDelete(id) {
	console.log(id)
	const response = await deleteTaskById(import.meta.env.VITE_BASE_URL + "/tasks", id)
	console.log(response)
	if (response.status === 200) {
		taskManagement.value.deleteTask(id)
		showDeleteModal.value = false
		statusHandler(taskDetails.value.title, 'deleted')
		taskDetails.value = {}
	}
	if (response.status === 404) {
		statusHandler(taskDetails.value.title, 'deleting', 'error')
		taskManagement.value.deleteTask(id)
		showDeleteModal.value = false
		taskDetails.value = {}
	}
}

async function confirmHandeler(action, taskDetails) {
	if (!taskDetails.title) {
		window.alert("You must input title !!!")
		return
	}
	if (action === 'add') {
		if (!taskDetails?.status) taskDetails.status = 'NO_STATUS';
		console.log(taskDetails)
		const respone = await addTask(import.meta.env.VITE_BASE_URL + "/tasks", taskDetails)
		console.log(respone)
		statusHandler(respone.title, 'added')
		taskManagement.value.addTask(respone)
	}
	if (action === 'edit') {
		const respone = await editTask(import.meta.env.VITE_BASE_URL + "/tasks", taskDetails)
		console.log(respone)
		statusHandler(respone.title, 'updated')
		taskManagement.value.editTask(taskDetails.id, taskDetails)

	}
	closeModal(false)
}
function closeModal(isClose) {
	modalOpen.value = isClose
	taskDetails.value = {}
	router.go(-1)
}
function statusHandler(title, status, type = 'success') {
	if (type === 'success') {
		message.value = `The task has been  ${status} successfully`
	} else message.value = `An error occurred ${status} the task "${title}" dose not exist`
	statusType.value = type
	showAlertModal.value = true
	let seconds = 10
	let timer = setInterval(function () {
		seconds--
		if (seconds < 0) {
			clearInterval(timer)
			closeStatusModal(false)
		}
	}, 1000)
}

function closeStatusModal(isClose) {
	showAlertModal.value = isClose
	message.value = ""
	statusType.value = ""
}

function convertUtils(timeUTC) {
	const formattedTimeZone = formatTimeZone(timeUTC)
	const [date, timeString] = formattedTimeZone.split(",")
	return `${date} ${timeString}`
}

function formatTimeZone(timestampString) {
	const timestamp = new Date(timestampString)
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
	const formattedtimestamp = timestamp.toLocaleString("en-GB", {
		timeZone: userTimeZone,
	})
	return formattedtimestamp
}

function kuy(event) {
	console.log(event.target.value)
}


</script>

<template>
	<Teleport to="body" v-if="showDeleteModal">
		<DeleteModal @cancel="closeDeleteModal" @confirm="confirmDelete" :taskDetails="taskDetails"
			:taskNumber="taskNumber" />
	</Teleport>
	<teleport to="body" v-if="modalOpen">
		<TaskModal @back="closeModal" @confirm="confirmHandeler" :taskDetails="taskDetails"
			:timeZone="Intl.DateTimeFormat().resolvedOptions().timeZone" :mode="mode" />
	</teleport>
	<input type="color" @input="kuy" />
	<div class="w-screen h-screen bg bg-[#FBFBFB] px-[35px] py-[25px] font-nonto">
		<div class=" flex flex-row justify-between items-center w-[100%] h-[75px] mb-[15px]">
			<div class="h-[75%] mt-[20px] ">
				<h1 class="text-[24px] text-gray-700 font-[800]">IT-Bangmod Kradan Kanban</h1>
			</div>
			<div class=" flex flex-row gap-[15px] h-[75%] ">
				<div class="flex w-[202px] h-[45px] px-[5px] m-[auto] border border-[#BDBDBD] rounded-[4px]">
					<select class="w-[200px]">
						<option>Show: All</option>
						<option>Show: Test</option>
						<option>Show: Test</option>
					</select>
				</div>
				<div class="w-[45px] h-[45px] m-[auto] border border-[#BDBDBD] rounded-[4px]">
					<div class="flex justify-center mt-[5px]">
						<img src="/image/up-and-down-icon.png" class="w-[30px] h-[30px]">
					</div>
				</div>
				<div class="w-[45px] h-[45px] m-[auto] border border-[#BDBDBD] rounded-[4px]">
					<div class="flex justify-center mt-[5px]">
						<img src="/image/filter-icon.png" class="w-[30px] h-[30px]">
					</div>
				</div>
			</div>
		</div>
		<AlertMessage v-show="showAlertModal" @close="closeStatusModal" :message="message" :type="statusType" />
		<div class=" h-[500px]">
			<div class="flex justify-between items-center w-[100%] px-[20px] min-h-[45px] font-[550]">
				<div class="w-[10%]">
					<p>No</p>
				</div>
				<div class="w-[50%] px-[15px]">
					<p>
						Title
					</p>
				</div>
				<div class="w-[10%]">
					<p>
						Status
					</p>
				</div>
				<div class="w-[30%]">
					<p class="">
						Assignees
					</p>
				</div>
			</div>
			<router-link :to="{ path: '/task/add' }">
				<div class="itbkk-button-add flex items-center min-h-[55px] mb-[5px] px-[15px] border-dashed border-[3px] border-[#FFCB45] rounded-[8px]"
					@click="modalHandler(null, 'add')">
					<div class="flex flex-row w-[50%] ">
						<div class="mr-[10px]">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M12 6L12 18" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
								<path d="M18 12L6 12" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
							</svg>
						</div>
						<div class="font-[430]">Add New Task</div>
					</div>
				</div>
			</router-link>
			<Listmodel :jobs="taskManagement.getAllTask()" v-if="taskManagement.getAllTask().length != 0">
				<template #default="slotprop">
					<div class="itbkk-item flex justify-between w-[100%] min-h-[55px] px-[28px] py-[10px] mb-[3px] break-all border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] reak-all hover:drop-shadow-2xl"
						:class="{
		'DOING': 'hover:border-l-[7px] hover:border-l-[#F55D30] ',
		'DONE': 'hover:border-l-[7px] hover:border-l-[#30F558]',
		'TO_DO': 'hover:border-l-[7px] hover:border-l-[#F5C330]',
		'NO_STATUS': 'hover:border-l-[7px] hover:border-l-[#6b7280]'
	}[slotprop.job.taskStatus]">
						<router-link :to="{ path: '/task/' + slotprop.job.id }" class="w-full h-full">
							<div class="flex w-full min-h-[55px]" @click="modalHandler(slotprop.job.id, 'read')">
								<div class="w-[10%] font-[350]">
									<p class="m-[auto]">
										{{ slotprop.key + 1 }}
									</p>
								</div>
								<div class="w-[50%]">
									<div class="itbkk-title px-[15px] font-[430] ">
										{{ slotprop.job.title }}
									</div>
								</div>
								<div class="w-[10%]">
									<div class="w-[100px] rounded-[5px] flex items-center justify-center" :class="{
		'DOING': 'bg-[#F55D30] ',
		'DONE': 'bg-[#30F558]  ',
		'TO_DO': 'bg-[#F5C330]  ',
		'NO_STATUS': 'bg-[#6b7280]'
	}[slotprop.job.status]
		">
										<p class="itbkk-status text-white">
											<template v-if="slotprop.job.status === 'DOING'">Doing</template>
											<template v-else-if="slotprop.job.status === 'DONE'">Done</template>
											<template v-else-if="slotprop.job.status === 'TO_DO'">To Do</template>
											<template v-else-if="slotprop.job.status === 'NO_STATUS'">No
												Status</template>
										</p>
									</div>
								</div>
								<div class="w-[30%] font-[350]">
									<p class="itbkk-assignees" :class="{ 'italic': !slotprop.job.assignees }">
										{{
		slotprop.job.assignees
			? slotprop.job.assignees
			: "Unassigned"
	}}
									</p>

								</div>
							</div>
						</router-link>
						<div class="itbkk-button-action dropdown dropdown-end dropdown-hover">
							<div tabindex="0" role="button" class="btn m-1 z-0">
								<svg width="7" height="30" viewBox="0 0 7 30" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<circle cx="3.5" cy="3.5" r="3.5" fill="#969696" />
									<circle cx="3.5" cy="26.5" r="3.5" fill="#969696" />
									<circle cx="3.5" cy="14.8335" r="3.5" fill="#969696" />
								</svg>
							</div>
							<ul tabindex="0"
								class="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52 absolute">
								<router-link :to="{ path: '/task/' + slotprop.job.id + '/edit' }">
									<li class="itbkk-button-edit" @click="modalHandler(slotprop.job.id, 'edit')">
										<a>Edit</a>
									</li>
								</router-link>
								<li class="itbkk-button-delete"
									@click="deleteModalHandler(slotprop.job,slotprop.key + 1)">
									<a>Delete</a>
								</li>
							</ul>
						</div>

					</div>
				</template>
			</Listmodel>
			<div v-else>
				<div
					class="w-[100%] border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] min-h-[45px] flex items-center justify-center">
					<div class="m-[auto]">NO TASK LIST</div>
				</div>
			</div>
		</div>
	</div>

</template>

<style scoped></style>
