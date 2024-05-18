import { defineStore, acceptHMRUpdate } from "pinia"
import { ref } from "vue"

export const useTasks = defineStore("taskmanager", () => {
	const tasks = ref([])
	const originalTasks = ref([])
	let isLimt = true
	let filtered = false
	let limitMaximum = 10
	let arr
	let state
	function getAllTask() {
		return tasks.value
	}

	function getTaskById(id) {
		return tasks.value.find((e) => e.id === id)
	}

	function addTask(newTask) {
		tasks.value.push(newTask)
		originalTasks.value.push(newTask)
		sortTaskByStatusName(state)
	}

	// function addTaskV2(newTask) {
	// 	clearAllTask()
	// 	// console.log(newTask)
	// 	this.addTasks(newTask)
	// 	console.log(tasks.value)
	// }

	function addFilter(listArr) {
		console.log(listArr)
		arr = listArr
		if (listArr === 0) {
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
			sortTaskByStatusName(state)
		}
	}

	function addTasks(newStatus) {
		newStatus.forEach((newTask) => {
			this.addTask(newTask)
		})
		originalTasks.value = [...tasks.value]
	}

	function editTask(taskId, updateTask) {
		console.log(updateTask)
		const index = tasks.value.findIndex((e) => e.id === taskId)
		const currentTask = tasks.value[index]
		tasks.value[index] = { ...currentTask, ...updateTask }

		const originalIndex = originalTasks.value.findIndex((e) => e.id === taskId)
		if (originalIndex !== -1) {
			originalTasks.value[originalIndex] = {
				...originalTasks.value[originalIndex],
				...updateTask,
			}
			console.log(originalTasks.value)
			console.log(tasks.value)
			console.log(arr)
			if (filtered) {
				const test = arr.filter((e) => {
					return e.title !== updateTask.title
				})
				console.log(test)
				addFilter(test)
				sortTaskByStatusName(state)
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
		state = sortState
		console.log(state)
		if (sortState === 0) {
			tasks.value.sort((a, b) => {
				return a.status.name.localeCompare(b.status.name)
			})

			return 1
		} else if (sortState === 1) {
			tasks.value.sort((a, b) => {
				return b.status.name.localeCompare(a.status.name)
			})

			return 2
		} else if (sortState === 2 && isLimt) {
			tasks.value = [...originalTasks.value]
			return 0
		} else if (sortState === 2 && filtered) {
			console.log(tasks.value)
			console.log(arr)
			tasks.value = [...arr]
			return 0
		}
	}

	function clearAllTask() {
		tasks.value = []
	}

	function setLimitMaximumTask(isEnble, amount) {
		isLimt = isEnble
		limitMaximum = amount
	}

	function checkAddEditMaximum(taskdetail) {
		if (isLimt) {
			const statusLimit = tasks.value.filter(
				(e) => e.status.name === taskdetail.status.name
			)
			if (statusLimit.length > limitMaximum) {
				return false
			} else return true
		} else return true
	}
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
		setLimitMaximumTask,
		checkAddEditMaximum,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useTasks, import.meta.hot))
}
