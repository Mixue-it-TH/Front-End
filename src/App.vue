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

function statusHandler(title, action, data, type = "success") {
	console.log(title)
	console.log(action)
	console.log(data)
	if (type === "success" && typeof title !== "number") {
		message.value = `The ${data} has been  ${action} successfully`
	} else if (type === "error" && title !== "duplicate") {
		message.value = `An error has occurred, the status does not exist`
	} else if (typeof title === "number") {
		message.value = `${title} task(s) have been tranfer and the status has been deleted`
	} else if (title === "duplicate") {
		message.value = `An error has occurred, the status has duplicate status `
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
	<div class="w-screen h-[auto] overflow-x-hidden bg-[#F4F4F4]">
		<AlertMessage
			v-if="showAlertModal"
			@close="closeStatusModal"
			:message="message"
			:type="statusType"
		/>
		<HomeView @alert="statusHandler" />
		<RouterView @alert="statusHandler" />
	</div>
</template>

<style scoped></style>
