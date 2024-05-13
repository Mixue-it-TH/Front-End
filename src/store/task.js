import { defineStore, acceptHMRUpdate } from "pinia"
import { ref } from "vue"

export const useTasks = defineStore("taskmanager", () => {
	const tasks = ref([])

	function getAllTask() {
		return tasks.value
	}

	function getTaskById(id) {
		return tasks.value.find((e) => e.id === id)
	}

	function addTask(newTask) {
		tasks.value.push(newTask)
	}

	function addTasks(newStatus) {
		newStatus.forEach((newTask) => {
			this.addTask(newTask)
		})
	}

	function editTask(taskId, updateTask) {
		console.log()
		const index = tasks.value.findIndex((e) => e.id === taskId)
		const currentTask = tasks.value[index]
		tasks.value[index] = { ...currentTask, ...updateTask }
		console.log(tasks.value[index])
	}
	function deleteTask(taskId) {
		tasks.value.splice(
			tasks.value.findIndex((task) => task.id === taskId),
			1
		)
	}
	function tranferStatus(id, newStatus) {
		console.log(tasks.value)
		console.log(newStatus)
		tasks.value
			.filter((st) => {
				return st.status.id === id
			})
			.forEach((st) => {
				console.log(st)
				console.log(newStatus)
				st.status = newStatus
			})
		console.log(tasks.value)
	}

	return {
		getAllTask,
		getTaskById,
		addTask,
		addTasks,
		editTask,
		deleteTask,
		tranferStatus,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useTasks, import.meta.hot))
}
