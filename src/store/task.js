import { defineStore, acceptHMRUpdate } from "pinia"
import { ref } from "vue"
import { getTaskList } from "@/util/fetchUtils"

export const useTasks = defineStore("taskmanager", () => {
  const tasks = ref([])
  const originalTasks = ref([])
  let isLimt = true
  let limitMaximum = 10
  let state = 2
  let currentState = 2
  let filteredArray = []

  function getState() {
    return state
  }
  function getCurrentState() {
    return currentState
  }
  function getIsLimit() {
    return isLimt
  }

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

  function addTasks(newTask) {
    console.log(tasks.value)

    newTask.forEach((newTask) => {
      addTask(newTask)
    })
    console.log(tasks.value)

    originalTasks.value = [...tasks.value]
    if (filteredArray.length !== 0) {
      addFilter(filteredArray)
    }
  }

  function addFilter(listArr) {
    filteredArray = listArr
    if (filteredArray.length === 0) {
      tasks.value = [...originalTasks.value]
    } else {
      tasks.value = originalTasks.value.filter((task) => {
        return filteredArray.includes(task.status.name)
      })
    }
    if (state !== 0) {
      sortTaskByStatusName(state)
    }
  }

  function editTask(taskId, updateTask) {
    const index = tasks.value.findIndex((e) => e.id === taskId)
    const currentTask = tasks.value[index]
    tasks.value[index] = { ...currentTask, ...updateTask }

    const originalIndex = originalTasks.value.findIndex((e) => e.id === taskId)
    if (originalIndex !== -1) {
      originalTasks.value[originalIndex] = {
        ...originalTasks.value[originalIndex],
        ...updateTask
      }
    }
    if (filteredArray.length !== 0) {
      addFilter(filteredArray)
    }
  }

  function deleteTask(taskId) {
    const index = tasks.value.findIndex((task) => task.id === taskId)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      const originalIndex = originalTasks.value.findIndex(
        (task) => task.id === taskId
      )
      if (originalIndex !== -1) {
        originalTasks.value.splice(originalIndex, 1)
      }
    }
  }

  function tranferStatus(id, newStatus) {
    tasks.value
      .filter((st) => st.status.id === id)
      .forEach((st) => {
        st.status = newStatus
      })
  }

  function sortTaskByStatusName(sortState) {
    state = sortState
    if (sortState === 0) {
      currentState = 0
      tasks.value.sort((a, b) => a.status.name.localeCompare(b.status.name))
      return 1
    } else if (sortState === 1) {
      currentState = 1
      tasks.value.sort((a, b) => b.status.name.localeCompare(a.status.name))
      return 2
    } else if (sortState === 2) {
      currentState = 2
      tasks.value = [...originalTasks.value]
      if (filteredArray.length !== 0) {
        state = 0
        addFilter(filteredArray)
      }
      return 0
    }
  }

  function clearAllTask() {
    tasks.value = []
    originalTasks.value = []
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
      return statusLimit.length <= limitMaximum
    }
    return true
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
    getState,
    getCurrentState,
    getIsLimit
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTasks, import.meta.hot))
}
