<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import {
	getStatusById,
	addStatus,
	editStatus
} from "@/util/statusFetchUtils"
import { convertStatus, convertUtils } from "@/util/formatUtils"
import { useStatus } from "@/store/status"
import { useTasks } from "@/store/task"
import { useAlert } from "@/store/alert"


const router = useRouter()
const statusDetails = ref({ name: "", description: "", statusColor: "#6b7280" })
const oldStatus = ref({})
const dataLoaded = ref(false)
const mode = ref("read")
const isDisable = ref(true)
const alertManagement = useAlert()
const statusManagement = useStatus()
const taskManagement = useTasks()
const delState = ref(false)

onMounted(async () => {
	const data = router.currentRoute.value.fullPath.split("/")
	if (data.length === 5 && !data.includes("add")) {
		actionHandler(data[4], "read")
	} else if (data.includes("add")) {
		actionHandler(null, "add")
	} else if (data.includes("edit")) {
		actionHandler(data[4], "edit")
	} else if (data.includes("delete")) {
		actionHandler(data[4], "delete")
		delState.value = true
	}
	dataLoaded.value = true
})

async function actionHandler(id, action) {
	if (action === "read") {
		statusDetails.value = await getStatusById(
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
			console.log(statusDetails.value);
			
			mode.value = "read"
		} else if (statusDetails.value === 404) {
			alertManagement.statusHandler("error", "An error has occurred, the request status does not exist")
			router.push("/task")
		} 
		
	} else if (action === "add") {
		mode.value = "add"
	} else if (action === "edit") {
		statusDetails.value = await getStatusById(
			
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
			alertManagement.statusHandler("error", "An error has occurred, the status does not exist")
			router.push("/status");
		}
	} else if (action === "delete") {
		mode.value = "delete"
		if (id === 1) {
			window.alert("The requested statuses can't delete default status")
			router.push("/status")
		}
		statusDetails.value = await getStatusById(
			
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
				statusDetails.value
			)
			if (typeof respone === "object") {
				alertManagement.statusHandler("success", "The status has been added successfully")
				statusManagement.addStatus(respone)
			} else if (respone === 400) alertManagement.statusHandler("error", "Internal server error")
		} else {
			
			alertManagement.statusHandler("error", "Status name must be uniques, please choose another name.")
			return
		}
	}
	if (mode.value === "edit") {
		const duplicateName = statusManagement.getAllStatus().filter((status) => {
			return ((convertStatus(status.name) === convertStatus(statusDetails.value.name)) && status.id !== statusDetails.value.id)
		})
		if (duplicateName.length === 0) {
			const respone = await editStatus(
				statusDetails.value
			);
			if (typeof respone === "object") {
				statusManagement.editStatus(statusDetails.value);
				taskManagement.tranferStatus(statusDetails.value.id, statusDetails.value)
				alertManagement.statusHandler( "success", "The status has been updated successfully");
			} else if (respone === 400) {
				alertManagement.statusHandler("error", "An error has occurred, the status has duplicate status name")
			} else if (respone === 404) {
				
				alertManagement.statusHandler("error", "An error has occurred, the status does not exist")
			}
		} else {
			alertManagement.statusHandler("error", "An error has occurred, the status has duplicate status name")
		}
	}
	closeModal()
}
function saveBthHandler() {
	if (statusDetails.value.name?.length > 50 || statusDetails.value.description?.length > 200) {
		isDisable.value = true
		return
	}
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


</script>

<template>
	<div v-if="dataLoaded"
		class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed flex justify-center items-center top-0 left-0 z-[10] font-nonto">
		<div
			class="fade-up itbkk-modal-status mobile-L:mb-[30px] mobile-L:h-[90%]  flex flex-col w-[full] h-[60%] min-h-[500px] min-w-[300px] rounded-[15px] bg bg-[#F8F8F8] text-[#333333]">
			<header class="flex items-center h-[15%] px-[14px] bg bg-[#F8F8F8]  rounded-t-[7px] border-b-2 border">
				<p class="text-[20px] font-[600]">{{ mode === 'read' ? 'Status Details' : (mode === 'add' ? 'Add Status'
		: 'Edit Status') }}
				</p>
			</header>
			<main class="flex flex-col h-full">
				<div class="mobile-L:mt-[0px] mt-[30px]  px-[14px]">
					<p class="text-[17px] font-[550] mb-[10px]">Name</p>
					<textarea
						class="itbkk-status-name bg-white w-[400px] mobile-M:w-[300px] h-[40px] px-[5px] border-gray-400 border-2 text-black rounded-[5px] disabled:text-black disabled:opacity-100"
						v-model="statusDetails.name" :disabled="mode === 'read'" @input="saveBthHandler"></textarea>
					<p v-if="mode !== 'read'" class="text-[15px]"
						:class="statusDetails.name.length > 50 ? 'text-red-500' : 'text-[#AFAFAF]'">
						{{ statusDetails.name.length }}/50 characters
					</p>
				</div>
				<div
					class="flex flex-row mobile-L:flex-col gap-[20px] mobile-L:gap-[5px] mt-[25px] mobile-L:mt-[5px] px-[14px]">
					<div class="">
						<p class="text-[17px] font-[550] mb-[10px]">Description</p>
						<textarea
							class="itbkk-status-description w-[400px] mobile-M:w-[300px] h-[120px] px-[5px] bg-white border-gray-400 border-2 rounded-[5px] disabled:text-black disabled:opacity-100"
							v-model="statusDetails.description" :disabled="mode === 'read'"
							@input="saveBthHandler"></textarea>
						<p v-if="mode !== 'read'" class="text-[15px]"
							:class="statusDetails.description?.length > 200 ? 'text-red-500' : 'text-[#AFAFAF]'">
							{{ statusDetails.description?.length || "0" }}/200 characters</p>
					</div>
					<div class="">
						<p class="text-[17px] font-[550] mb-[10px]">Color</p>
						<div class="flex mobile-L:flex-row flex-col gap-[10px] ">
							<input type="text" v-model="statusDetails.statusColor" :disabled="mode === 'read'"
								class="bg-white mobile-M:w-[135px] disabled:text-black disabled:opacity-100"></input>
							<input type="color"
								class="w-[150px] h-[75px] rounded-[5px] cursor-pointer focus:ring-2 focus:ring-blue-500"
								v-model="statusDetails.statusColor" :disabled="mode === 'read'"
								@input="saveBthHandler" />
							<div>{{ statusDetails.statusColor }}</div>
						</div>
					</div>
				</div>

				<div class="timezone flex flex-row justify-between px-[15px] pb-[7px] mt-[auto] mb-[5px]"
					v-if="mode !== 'add'">
					<div class="itbkk-timezone ">
						<p class="font-[550]">TimeZone:</p>
						<p>{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}</p>
					</div>
					<div class="itbkk-created-on mobile-M:ml-[10px] ">
						<p class="font-[550]">Created On:</p>
						<p>
							{{ statusDetails.createdOn }}
						</p>
					</div>
					<div class="itbkk-updated-on mobile-M:ml-[10px]">
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

<style scoped></style>
