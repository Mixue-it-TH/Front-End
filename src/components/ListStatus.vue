<script setup>
import { ref } from "vue"
import { RouterLink } from "vue-router"
import ListModel from "./ListModel.vue"
import { useStatus } from "@/store/status.js"
import { convertStatus } from "@/util/formatUtils"
import DeleteStatusModal from "@/components/DeleteStatusModal.vue"
import { deleteStatusById, deleteTaskAndTranfer } from "@/util/statusFetchUtils"
import { useTasks } from "@/store/task"
const emit = defineEmits(["alert"])


const statusManagement = useStatus()
const taskManagement = useTasks()
const mode = ref("read")
const statusDetail = ref()
const statusId = ref()
const delState = ref(false)
const stage = ref("delete")
const arrTranfer = ref([])
const amoutTasks = ref(0)


function delAction(status, id) {
	console.log(id)
	console.log(status)
	statusDetail.value = status
	const taskRelation = taskManagement.getAllTask().filter((task) => {
		return task.status.id === statusDetail.value.id
	})
	if (taskRelation.length >= 1) {
		stage.value = "tranfer"
		amoutTasks.value = taskRelation.length
		arrTranfer.value = statusManagement.getAllStatus().filter((st) => {
			return st.id !== id
		})
		console.log(arrTranfer.value)
	}
	statusId.value = id
	delState.value = true
}

async function delConfirm(id, tranferId) {
	let delRespond
	if (stage.value === "delete") {
		delRespond = await deleteStatusById(
			import.meta.env.VITE_BASE_URL + "/v2/statuses",
			id
		)
		statusManagement.deleteStatus(id)
		if (delRespond.ok) {
			emit("alert", statusDetail.value.name, "deleted", "status")
		} else if (delRespond.status === 404) {
			emit("alert", statusDetail.value.name, "deleted", "status", "error")
		}
	} else if (stage.value === "tranfer") {
		delRespond = await deleteTaskAndTranfer(
			import.meta.env.VITE_BASE_URL + "/v2/statuses",
			id,
			tranferId
		)
		if (delRespond.ok) {
			statusManagement.deleteStatus(id)
			taskManagement.tranferStatus(
				id,
				statusManagement.getStatusById(tranferId)
			)
			emit("alert", amoutTasks.value, "deleted", "status") // เล้งเพิ่ม
		} else if (delRespond.status === 404) {
			emit("alert", statusDetail.value.name, "deleted", "status", "error")
		}
	}
	closeDelModal(false)
}

function closeDelModal(isclose) {
	delState.value = isclose
	stage.value = "delete"
}

function modalHandler(id, action) {
	if (action === "add") {
		mode.value = "add"
	} else if (action === "read") {
	} else if (action === "edit") {
		mode.value = "edit"
	}
}
</script>

<template>
	<div class="">
		<Teleport to="body" v-if="delState">
			<DeleteStatusModal :id="statusId" :stDetail="statusDetail" :stage="stage" :tranferData="arrTranfer"
				:amountTasks="amoutTasks" @cancel="closeDelModal" @confirm="delConfirm" />
		</Teleport>

		<div>
			<div class="flex justify-between items-center w-[100%] px-[20px] min-h-[45px] font-[550]">
				<div class="w-[10%]">
					<p>No</p>
				</div>
				<div class="w-[30%] px-[15px]">
					<p>Name</p>
				</div>
				<div class="w-[60%]">
					<p>Description</p>
				</div>
			</div>
		</div>
		<router-link :to="{ name: 'statusAdd' }">
			<div
				class="itbkk-button-add flex items-center min-h-[55px] mb-[5px] px-[15px] bg bg-[#F6F6F6] border-dashed border-[3px] border-[#FFCB45] rounded-[8px]">
				<div class="flex flex-row w-[50%]">
					<div class="mr-[10px]">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 6L12 18" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
							<path d="M18 12L6 12" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
						</svg>
					</div>
					<div class="font-[430]" @click="modalHandler(null, 'add')">
						Add New Status
					</div>
				</div>
			</div>
		</router-link>
		<ListModel :statuses="statusManagement.getAllStatus()">
			<template #status="slotprop">
				<div
					class="itbkk-item flex justify-between w-[100%] min-h-[55px] px-[28px] py-[10px] mb-[3px] break-all border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] reak-all hover:drop-shadow-2xl">
					<router-link :to="{ name: 'statusDetail', params: { id: slotprop.status.id } }" class="w-full ">
						<div class="flex justify-between">
							<div class="w-[10%] font-[350]">
								<p class="m-[auto]">{{ slotprop.key + 1 }}</p>
							</div>
							<div class="w-[30%]">
								<div class="text-white min-w-[80px] max-w-[150px] px-[10px]  rounded-[5px] m-[auto] inline-block"
									:style="{ backgroundColor: slotprop.status.statusColor }">
									<p class="">{{ convertStatus(slotprop.status.name) }}</p>
								</div>
							</div>


							<div class="w-[60%]">
								<div class="px-[25px]">
									<p :class="{
			'italic text-gray-500': !slotprop.status.description,
		}">
										{{
			slotprop.status.description
				? slotprop.status.description
				: "Unassigned"
		}}
									</p>
								</div>
							</div>

						</div>
					</router-link>
					<div class="w-[100px]">
						<div class="flex justify-between w-[100px]" v-if="slotprop.status.id !== 1">
							<router-link :to="{ name: 'statusEdit', params: { id: slotprop.status.id } }">
								<div>
									<img src="/image/repair-icon-.png" class="w-[30px]" />
								</div>
							</router-link>
							<div>
								<img src="/image/delete-image.png" class="w-[30px]"
									@click="delAction(slotprop.status, slotprop.status.id)" />
							</div>
						</div>
					</div>
				</div>
			</template>
		</ListModel>
	</div>
</template>

<style scoped></style>
