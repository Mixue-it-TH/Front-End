<script setup>
import { RouterView } from "vue-router"
import HomeView from "./views/HomeView.vue"
import { ref } from "vue"
import AlertMessage from "./components/AlertMessage.vue"

const message = ref("")
const statusType = ref("success")
const showAlertModal = ref(false)

function closeStatusModal(isClose) {
	showAlertModal.value = isClose
	message.value = ""
	statusType.value = ""
}
function statusHandler(type, text) {
	message.value = text
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

function statusHandler2(title, action, data, type = "success") {
	if (
		type === "success" &&
		typeof title !== "number" &&
		typeof action !== "number"
	) {
		message.value = `The ${data} has been  ${action} successfully`
	} else if (type === "error" && title !== "duplicate") {
		message.value = `An error has occurred, the ${data} does not exist`
	} else if (typeof title === "number") {
		message.value = `${title} task(s) have been tranfer and the status has been deleted`
	} else if (title === "duplicate") {
		message.value = `An error has occurred, the status has duplicate status `
	} else if (typeof action === "number") {
		message.value = `The Kanban board now limits ${title} tasks in each status`
	}
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
</script>

<template>
	<div class=" h-[auto] overflow-x-hidden bg-[#F4F4F4]">
		<AlertMessage v-if="showAlertModal" @close="closeStatusModal" :message="message" :type="statusType" />
		<HomeView @alert="statusHandler" />
		<RouterView @alert="statusHandler" />
	</div>
</template>

<style scoped></style>
