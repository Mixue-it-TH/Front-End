export default class taskMangement {
	taskList = []
	statusList = []

	getAllTask() {
		return this.taskList
	}

	getTaskById(id) {
		return this.taskList.find((e) => e.id === id)
	}

	addTask(newTask) {
		this.taskList.push(newTask)
	}
	addTasks(newStatus) {
		newStatus.forEach((newTask) => {
			this.addTask(newTask)
		})
	}
	editTask(taskId, updateTask) {
		const index = this.taskList.findIndex((e) => e.id === taskId)
		this.taskList[index] = {
			...this.taskList[index],
			...updateTask,
		}
	}
	deleteTask(taskId) {
		this.taskList.splice(
			this.taskList.findIndex((task) => task.id === taskId),
			1
		)
	}
	getAllStatus() {
		return this.statusList
	}

	getStatusById(id) {
		return this.statusList.find((e) => e.id === id)
	}

	addStatus(newStatus) {
		this.statusList.push(newStatus)
	}

	addStatuses(newStatus) {
		newStatus.forEach((newSt) => {
			this.addStatus(newSt)
		})
	}

	editStatus(taskId, newStatus) {
		const index = this.statusList.findIndex((e) => e.id === taskId)
		this.statusList[index] = {
			...this.statusList[index],
			...newStatus,
		}
	}
	deleteStatus(statusId) {
		this.statusList.splice(
			this.statusList.findIndex((task) => task.id === statusId),
			1
		)
	}
}
