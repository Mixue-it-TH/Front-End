<script setup>
import { onMounted, ref,watch } from "vue"
import { useRouter } from "vue-router"
import {
	getStatusById,
	addStatus,
	editStatus
} from "@/util/statusFetchUtils"
import { convertStatus, convertUtils } from "@/util/formatUtils"
import { useStatus } from "@/store/status"
import { useTasks } from "@/store/task"
const emit = defineEmits(["alert"])

const statusDetails = ref({ name: "", description: "", statusColor: "#6b7280" })
const router = useRouter()
const oldStatus = ref({})
const dataLoaded = ref(false)
const mode = ref("read")
const isDisable = ref(true)
const statusManagement = useStatus()
const taskManagement = useTasks()
const delState = ref(false)
const isMaxName = ref(false)
const isMaxDescript = ref(false)

onMounted(async () => {
	const data = router.currentRoute.value.fullPath.split("/")
	if (data.length === 3 && !data.includes("add")) {
		actionHandler(data[2], "read")
	} else if (data.includes("add")) {
		actionHandler(null, "add")
	} else if (data.includes("edit")) {
		actionHandler(data[2], "edit")
	} else if (data.includes("delete")) {
		actionHandler(data[2], "delete")
		delState.value = true
	}
	dataLoaded.value = true
})

async function actionHandler(id, action) {
	if (action === "read") {
		statusDetails.value = await getStatusById(
			import.meta.env.VITE_BASE_URL + "/statuses",
			id
		)

		if (typeof statusDetails.value === "object") {
			statusDetails.value.createdOn = convertUtils(
				statusDetails.value.createdOn
			)
			statusDetails.value.updatedOn = convertUtils(
				statusDetails.value.updatedOn
			)
			statusDetails.value.name = convertStatus(statusDetails.value.name)
			mode.value = "read"
		} else {
			window.alert("The requested statues does not exist")
			router.push("/task")
		}
	} else if (action === "add") {
		mode.value = "add"
	} else if (action === "edit") {
		statusDetails.value = await getStatusById(
			import.meta.env.VITE_BASE_URL + "/statuses",
			id
		);
		if (typeof statusDetails.value === "object") {
			statusDetails.value.createdOn = convertUtils(
				statusDetails.value.createdOn
			);
			statusDetails.value.updatedOn = convertUtils(
				statusDetails.value.updatedOn
			);
			oldStatus.value = { ...statusDetails.value }
			mode.value = "edit";
		} else {
			emit("alert", "error", "An error has occurred, the status does not exist")
			router.push("/status");
		}
	} else if (action === "delete") {
		mode.value = "delete"
		if (id === 1) {
			window.alert("The requested statuses can't delete default status")
			router.push("/status")
		}
		statusDetails.value = await getStatusById(
			import.meta.env.VITE_BASE_URL + "/statuses",
			id
		)
	}
}

async function confirmHandeler() {
	if (mode.value === "add") {
		const duplicateName = statusManagement.getAllStatus().filter((status) => {
			return convertStatus(status.name) === convertStatus(statusDetails.value.name)
		})
		if (duplicateName.length === 0) {
			const respone = await addStatus(
				import.meta.env.VITE_BASE_URL + "/statuses",
				statusDetails.value
			)
			emit("alert", "success", "The status has been added successfully")
			statusManagement.addStatus(respone)
		} else {
			emit("alert", "error", "Status name must be uniques, please choose another name.")
			return
		}
	}
	if (mode.value === "edit") {
		const duplicateName = statusManagement.getAllStatus().filter((status) => {
			return ((convertStatus(status.name) === convertStatus(statusDetails.value.name)) && status.id !== statusDetails.value.id)
		})
		if (duplicateName.length === 0) {
			const respone = await editStatus(
				import.meta.env.VITE_BASE_URL + "/statuses",
				statusDetails.value
			);
			console.log(respone)
			if (respone === 404) {
				emit("alert", "error", "An error has occurred, the status does not exist")
				statusManagement.deleteStatus(statusDetails.value.id)
			} else {
				statusManagement.editStatus(statusDetails.value);
				taskManagement.tranferStatus(statusDetails.value.id, statusDetails.value)// เล้งเพิ่ม
				emit("alert", "success", "The status has been updated successfully");
			}
		} else {
			emit("alert", "error", "An error has occurred, the status has duplicate status name")
		}
	}
	closeModal()
}
function saveBthHandler() {
	if (
		JSON.stringify({ ...oldStatus.value }) !==
		JSON.stringify({ ...statusDetails.value }) &&
		oldStatus.value.name
	) {
		isDisable.value = false
		return
	}
	if (mode.value === "add" && statusDetails.value.name) {
		isDisable.value = false
		return
	}
	isDisable.value = true
}

function closeModal() {
	router.go(-1)
}
function checkMaxLength(field, maxLength) {//เล้งเพิ่ม
	if (field) {
		return field.length > maxLength
	}
}

watch(
	() => statusDetails.value,
	(newStatusDetail) => {
		isMaxName.value = checkMaxLength(newStatusDetail.name, 50)
		isMaxDescript.value = checkMaxLength(newStatusDetail.description, 200)
	},
	{ deep: true }
)
</script>

<template>
	<div v-if="dataLoaded"
		class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed flex justify-center items-center top-0 left-0 z-[10] font-nonto">
		<div
			class="fade-up itbkk-modal-status flex flex-col w-[full] h-[60%] min-h-[500px] min-w-[350px] rounded-[15px] bg bg-[#F8F8F8] text-[#333333]">
			<header class="flex items-center h-[15%] px-[14px] bg bg-[#F8F8F8]  rounded-t-[7px] border-b-2 border">
				<p class="text-[20px] font-[600]">{{ mode === 'read' ? 'Status Details' : (mode === 'add' ? 'Add Status'
		: 'Edit Status') }}
				</p>
			</header>
			<main class="flex flex-col h-full">
				<div class="mt-[30px]  px-[14px]">
					<p class="text-[17px] font-[550] mb-[10px]">Name</p>
					<textarea
						class="itbkk-status-name bg-white w-[400px] h-[40px] px-[5px] border-gray-400 border-2 text-black rounded-[5px]"
						v-model="statusDetails.name" :disabled="mode === 'read'" @input="saveBthHandler"
						></textarea>
						<p v-if="isMaxName" class="text-red-600 pt-[5px]">
							Status name exceeded ({{
								statusDetails.name.length - 50 < 0
									? 0
									: statusDetails.name.length - 50
							}}) if you save the error has occure
						</p>
				</div>
				<div class="flex flex-row gap-[20px] mt-[25px] px-[14px]">
					<div class="">
						<p class="text-[17px] font-[550] mb-[10px]">Description</p>
						<textarea
							class="itbkk-status-description w-[400px] h-[120px] px-[5px] bg-white border-gray-400 border-2 rounded-[5px]"
							v-model="statusDetails.description" :disabled="mode === 'read'" @input="saveBthHandler"
							></textarea>
							<!-- เล้งเพิ่ม -->
							<p v-if="isMaxDescript" class="text-red-600 pt-[5px]">
							Description exceeded ({{
								statusDetails.description.length - 200 < 0
									? 0
									: statusDetails.description.length - 200
							}}) if you save the error has occure
						</p>
					</div>
					<div class="">
						<p class="text-[17px] font-[550] mb-[10px]">Color</p>
						<div class="flex flex-col gap-[10px]">
							<input type="text" v-model="statusDetails.statusColor" :disabled="mode === 'read'"></input>
							<input type="color"
								class="w-[150px] h-[75px] rounded-[5px] cursor-pointer focus:ring-2 focus:ring-blue-500"
								v-model="statusDetails.statusColor" :disabled="mode === 'read'"
								@input="saveBthHandler" />
						</div>
					</div>
				</div>

				<div class="timezone flex flex-row justify-between px-[15px] pb-[7px] mt-[auto] mb-[5px]"
					v-if="mode !== 'add'">
					<div class="itbkk-timezone">
						<p class="font-[550]">TimeZone:</p>
						<p>{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}</p>
					</div>
					<div class="itbkk-created-on">
						<p class="font-[550]">Created On:</p>
						<p>
							{{ statusDetails.createdOn }}
						</p>
					</div>
					<div class="itbkk-updated-on">
						<p class="font-[550]">Updated On:</p>
						<p>
							{{ statusDetails.updatedOn }}
						</p>
					</div>
				</div>


			</main>
			<footer class="flex justify-end mt-[auto] h-[17%] gap-5 items-center border-t-2">
				<button
					class="itbkk-button itbkk-button-confirm disabled flex w-[65px] h-[40px] font-[600] text-white bg bg-green-500 hover:bg-green-600 rounded-lg"
					:class="isDisable ? 'opacity-50' : ''" v-show="mode !== 'read'" @click="confirmHandeler()"
					:disabled="isDisable">
					<button class="m-[auto]">
						{{ mode !== "read" ? "Save" : "Ok" }}
					</button>
				</button>
				<div class="itbkk-button itbkk-button-cancel flex w-[80px] h-[40px] font-[600] text-gary-800 bg bg-gray-200 hover:bg-gray-300 rounded-lg mr-5"
					@click="closeModal">
					<button class="m-[auto]">Cancel</button>
				</div>

			</footer>
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
