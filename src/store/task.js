import { defineStore, acceptHMRUpdate } from "pinia"
import { ref } from "vue"

export const useTasks = defineStore("taskmanager", () => {
	const tasks = ref([])
	const originalTasks = ref([])
	let isLimt = true
	let filtered = false
	// let limitMaximum = 10

	function getAllTask() {
		return tasks.value
	}

	function getTaskById(id) {
		return tasks.value.find((e) => e.id === id)
	}

	function addTask(newTask) {
		tasks.value.push(newTask)
		originalTasks.value.push(newTask)
	}

	function addTaskV2(newTask) {
		clearAllTask()
		// console.log(newTask)
		this.addTasks(newTask)
		console.log(tasks.value)
	}

	function addFilter(listArr) {
		console.log(listArr)
		console.log(listArr)
		if (listArr === 0) {
			//ปัญหาแอดข้อมูลเดิมมาจาก func นี้เลยไปเพิ่มใน delTask
			console.log(555)
			isLimt = true
			filtered = false
			clearAllTask()
			originalTasks.value.forEach((e) => {
				tasks.value.push(e)
			})
		} else {
			isLimt = false
			filtered = true
			clearAllTask()
			listArr.forEach((e) => {
				tasks.value.push(e)
			})
		}
	}

	function addTasks(newStatus) {
		newStatus.forEach((newTask) => {
			this.addTask(newTask)
		})
		originalTasks.value = [...tasks.value]
	}

	function editTask(taskId, updateTask) {
		const index = tasks.value.findIndex((e) => e.id === taskId)
		const currentTask = tasks.value[index]
		tasks.value[index] = { ...currentTask, ...updateTask }

		const originalIndex = originalTasks.value.findIndex((e) => e.id === taskId)
		if (originalIndex !== -1) {
			originalTasks.value[originalIndex] = {
				...originalTasks.value[originalIndex],
				...updateTask,
			}
		}
	}
	function deleteTask(taskId) {
		tasks.value.splice(
			tasks.value.findIndex((task) => task.id === taskId),
			1
		)
		originalTasks.value.splice(
			//เพิ่มไอนี้มาเพราะตอนแอดข้อมูลละมีปัญหามันเอาข้อมูลเดิมจากตัวนี้มาแอดเพิ่มเข้าไปทำให้ทุกครั้งที่ลบกูต้องลบใน arr นี้ด้วย
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
	function sortTaskByStatusName(sortState) {
		console.log(isLimt)
		console.log(sortState)
		if (sortState === 0) {
			tasks.value.sort((a, b) => {
				return a.status.name.localeCompare(b.status.name)
			})
			console.log("state 0" + tasks.value)
			return 1
		} else if (sortState === 1) {
			tasks.value.sort((a, b) => {
				return b.status.name.localeCompare(a.status.name)
			})
			console.log("state 1" + tasks.value)
			return 2
		} else if (sortState === 2 && isLimt) {
			tasks.value = [...originalTasks.value]
			return 0
		} else if (sortState === 2 && filtered) {
			console.log(tasks.value)
			tasks.value = [...tasks.value]
			return 0
		}
	}

	function clearAllTask() {
		tasks.value = []
	}

	// function setLimitMaximumTask(isEnble, amount) {
	// 	isLimt = isEnble
	// 	limitMaximum = amount
	// }

	// function checkAddEditMaximum(taskdetail) {
	// 	if (isLimt) {
	// 		const statusLimit = tasks.value.filter(
	// 			(e) => e.status.name === taskdetail.status.name
	// 		)
	// 		if (statusLimit.length > limitMaximum) {
	// 			return false
	// 		} else return true
	// 	} else return true
	// }
	return {
		getAllTask,
		getTaskById,
		addTask,
		addTasks,
		editTask,
		deleteTask,
		tranferStatus,
		sortTaskByStatusName,
		addFilter,
		clearAllTask,
		// setLimitMaximumTask,
		addTaskV2,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useTasks, import.meta.hot))
}
