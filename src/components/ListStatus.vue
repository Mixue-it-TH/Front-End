<script setup>
import { ref } from "vue"
import { RouterLink } from "vue-router"
import ListModel from "./ListModel.vue"
import { useStatus } from "@/store/status.js"
import DeleteStatusModal from "@/components/DeleteStatusModal.vue"
import { deleteStatusById, deleteTaskAndTranfer } from "@/util/statusFetchUtils"
import { useTasks } from "@/store/task"
const emit = defineEmits(["alert"])
const prop = defineProps({
	limitExceed: {
		type: Array,
	},
})
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
	}
	statusId.value = id
	delState.value = true
}

async function delConfirm(id, tranferId) {
	let delRespond
	if (stage.value === "delete") {
		delRespond = await deleteStatusById(
			import.meta.env.VITE_BASE_URL + "/statuses",
			id
		)
		statusManagement.deleteStatus(id)
		if (delRespond.ok) {
			emit("alert", "success", "The status has been deleted successfully")
			closeDelModal(false)
		} else if (delRespond.status === 404) {
			emit("alert", "error", "An error has occurred, the status does not exist")
			closeDelModal(false)
		}
	} else if (stage.value === "tranfer") {
		delRespond = await deleteTaskAndTranfer(
			import.meta.env.VITE_BASE_URL + "/statuses",
			id,
			tranferId
		)
		if (delRespond.ok) {
			statusManagement.deleteStatus(id)
			taskManagement.tranferStatus(
				id,
				statusManagement.getStatusById(tranferId)
			)
			emit(
				"alert",
				"success",
				`${amoutTasks.value} task(s) have been tranfer and the status has been deleted`
			)
			closeDelModal(false)
		} else if (delRespond.status === 404 || delRespond.status === 400) {
			const status = statusManagement.getStatusById(tranferId)
			emit(
				"alert",
				"error",
				`Cannot transfer to ${status.name} status since it will exceed the limit. Please choose another status to transfer to.`
			)
		}
	}
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
	<div class="text-gray-700">
		<Teleport to="body" v-if="delState">
			<DeleteStatusModal :stDetail="statusDetail" :stage="stage" :tranferData="arrTranfer"
				:amountTasks="amoutTasks" :limitExceed="limitExceed" @cancel="closeDelModal" @confirm="delConfirm" />
		</Teleport>

		<div>
			<div class="flex justify-between items-center w-[100%] px-[20px] min-h-[45px] font-[550]">
				<div class="w-[10%]">
					<p>No</p>
				</div>
				<div class="w-[30%] px-[15px] ">
					<p>Name</p>
				</div>
				<div class="w-[50%]">
					<p>Description</p>
				</div>
				<div class="w-[10%]">
					<p>Action</p>
				</div>
			</div>
		</div>
		<router-link :to="{ name: 'statusAdd' }">
			<div
				class="transition itbkk-button-add flex items-center min-h-[55px] mb-[5px] px-[15px] bg bg-[#F6F6F6] hover:bg-white border-dashed border-[3px] border-[#FFCB45] rounded-[8px]">
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
					class="transition itbkk-item flex justify-between w-[100%] min-h-[55px] px-[20px] py-[10px] mb-[3px] break-all border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] reak-all hover:drop-shadow-2xl">
					<router-link :to="{ name: 'statusDetail', params: { id: slotprop.status.id } }" class="w-full">
						<div class="w-[100%] flex ">
							<div class="w-[11%] font-[350]">
								<p class="m-[auto]">{{ slotprop.key + 1 }}</p>
							</div>
							<div class="w-[33%]">
								<div class="text-white min-w-[80px] max-w-[150px] px-[10px] rounded-[5px] m-[auto] inline-block transition-icon duration-100 hover:drop-shadow-2xl"
									:style="{ backgroundColor: slotprop.status.statusColor }">
									<p class="itbkk-status-name">{{ slotprop.status.name }}</p>
								</div>
							</div>

							<div class="w-[50%]">
								<div class="">
									<p :class="{
			'italic text-gray-500': !slotprop.status.description,
		}" class="itbkk-status-description">
										{{
			slotprop.status.description
				? slotprop.status.description
				: "No description is provided"
		}}
									</p>
								</div>
							</div>
						</div>
					</router-link>
					<div class="w-[10%]">
						<!-- เล้งเพิ่มการเช็คด้วยชื่อ -->
						<div class="flex justify-between w-[100px]" v-if="slotprop.status.name.toLowerCase() !==
			'No Status'.toLowerCase() &&
			slotprop.status.name.toLowerCase() !== 'Done'.toLowerCase()
			">
							<router-link :to="{ name: 'statusEdit', params: { id: slotprop.status.id } }"
								class="itbkk-button-edit">
								<div
									class="transition-icon w-[50px] px-[6px] rounded-[10px] hover:drop-shadow-2xl duration-150">
									Edit
									<img src="/image/repair-icon-.png" class="w-[30px]" />
								</div>
							</router-link>
							<div
								class="transition-icon itbkk-button-deletew-[50px] rounded-[10px] hover:drop-shadow-2xl duration-150">
								Delete
								<img src="/image/delete-image.png" class="w-[30px] ml-[5px] cursor-pointer"
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
