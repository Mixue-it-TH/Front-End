<script setup>
import { onMounted, ref } from "vue"
import { RouterLink, useRouter } from "vue-router"
import TodoModal from "./TodoModal.vue"
import Listmodel from "./ListModel.vue"
import { getTodoById, getTodos } from "@/util/fetchUtils"

const route = useRouter()
const isTeleport = ref(false)
const isEmptyTask = ref(false)
const tasks = ref([])
const taskDetails = ref()

onMounted(async () => {
	const listTodo = await getTodos(import.meta.env.VITE_BASE_URL + "/tasks")
	if (listTodo.length === 0) isEmptyTask.value = true
	tasks.value = listTodo
	isTeleport.value = false
});

async function modalHandler(id) {
	taskDetails.value = await getTodoById(
		import.meta.env.VITE_BASE_URL + "/tasks",
		id
	)
	taskDetails.value.createdOn = convertUtils(taskDetails.value.createdOn)
	taskDetails.value.updatedOn = convertUtils(taskDetails.value.updatedOn)
	isTeleport.value = true
}


function convertUtils(yeahman) {
	console.log(yeahman)
	const wtf = Date(yeahman)
	console.log(wtf)
	const formattedTimeZone = formatTimeZone(yeahman)
	const [date, timeString] = formattedTimeZone.split(",")
	const dateformat = convertDateFormat(date)
	const timeformat = convertTimeTo24HourFormat(timeString.substring(1))
	console.log(dateformat, timeformat)
	return `${dateformat} ${timeformat}`
}

function convertTimeTo24HourFormat(timeString) {
	const [time, period] = timeString.split(" ")
	let [hour, minute, second] = time.split(":")

	if (period === "PM" && hour !== "12") {
		hour = String(Number(hour) + 12)
	}

	if (period === "AM" && hour === "12") {
		hour = "00"
	}

	return `${hour}:${minute}:${second}`
}

function convertDateFormat(dateString) {
	const parts = dateString.split('/');

	const month = parts[0].length === 1 ? `0${parts[0]}` : parts[0];

	const formattedDate = `${parts[1]}/${month}/${parts[2]}`;


	return formattedDate;
}

function formatTimeZone(timestampString) {
	const timestamp = new Date(timestampString)
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
	const formattedtimestamp = timestamp.toLocaleString("en-US", {
		timeZone: userTimeZone,
	})
	return formattedtimestamp
}

function closeModal(isClose) {
	isTeleport.value = isClose
	route.go(-1)
}

</script>

<template>
	<div class="flex flex-col justify-center w-full h-screen bg-gray-100">
		<div class="text-xl font-bold text-gray-800 mb-4 px-[10px]">
			<h1>IT-Bangmod Task Dashboard</h1>
		</div>
		<div class="w-full max-w-[90%] p-6 bg-gray-200 border border-black">
			<teleport to="body" v-if="isTeleport">
				<TodoModal @back="closeModal" :taskDetails="taskDetails"
					:timeZone="Intl.DateTimeFormat().resolvedOptions().timeZone" />
			</teleport>
			<div class="w-full overflow-auto border border-black">
				<table class="w-full text-gray-700">
					<thead class="flex justify-between p-[20px] text-lg">
						<tr class="flex justify-between w-full">
							<th class="px-4 py-2 border border-black">No</th>
							<th class="px-4 py-2 border border-black">Title</th>
							<th class="px-4 py-2 border border-black">Status</th>
							<th class="px-4 py-2 border border-black">Assignees</th>
						</tr>
					</thead>
					<!-- <tr>
						<td
							class="m-[100px] p-[10px] border border-dashed border-green-400 border-[2px]"
						>
							➕ Add
						</td>
					</tr> -->
					<Listmodel :jobs="tasks">
						<template #default="slotprop">
							<router-link :to="{ path: '/task/' + slotprop.job.id }">
								<tr class="itbkk-item flex justify-between my-[10px] p-[10px] text-[20px] border border-black hover:drop-shadow-2xl bg-white"
									:class="{
				Doing: 'hover:border-l-[20px] border-l-red-400 ',
				Done: 'hover:border-l-[20px] border-l-green-300',
				'To Do': 'hover:border-l-[20px] border-l-yellow-200',
			}[slotprop.job.taskStatus]
				" @click="modalHandler(slotprop.job.id)">
									<td class="px-4 py-2 border border-black w-1/1">
										{{ slotprop.job.id }}
									</td>

									<td
										class="itbkk-title px-4 py-2 w-1/2 text-blue-600 cursor-pointer border border-black break-all">
										{{ slotprop.job.taskTitle }}
									</td>

									<td class="itbkk-assignees 4px-4 py-2 border border-black w-1/3"
										:class="!slotprop.job.taskAssignees ? 'italic' : ''">
										{{
				slotprop.job.taskAssignees
					? slotprop.job.taskAssignees
					: "Unassigned"
			}}
									</td>
									<td class="itbkk-status px-4 py-2 p-1.5 w-[90px] text-sm text-center font-[20px] uppercase border border-black tracking-wider rounded-200 bg-opacity-50 rounded-[10px]"
										:class="{
					Doing: 'bg-red-200 text-red-800',
					Done: 'bg-green-200 text-green-800 ',
					'To Do': 'bg-yellow-200 text-yellow-800 ',
				}[slotprop.job.taskStatus]
				">
										{{ slotprop.job.taskStatus }}
									</td>
								</tr>
							</router-link>
						</template>
						<template #notask>
							<div v-show="isEmptyTask" class="text-[20px] text-center">
								<h2>No Task</h2>
							</div>
						</template>
					</Listmodel>
				</table>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
