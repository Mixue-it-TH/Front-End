import ListStatus from "@/components/ListStatus.vue";
import { defineStore, acceptHMRUpdate } from "pinia";
import { ref } from "vue";

export const useTasks = defineStore("taskmanager", () => {
  const tasks = ref([]);
  const originalTasks = ref([]);

  function getAllTask() {
    return tasks.value;
  }

  function getTaskById(id) {
    return tasks.value.find((e) => e.id === id);
  }

  function addTask(newTask) {
    tasks.value.push(newTask);
    originalTasks.value.push(newTask);
  }

  function addTasks(newStatus) {
    newStatus.forEach((newTask) => {
      this.addTask(newTask);
    });
    originalTasks.value = [...tasks.value];
  }

  function editTask(taskId, updateTask) {
    const index = tasks.value.findIndex((e) => e.id === taskId);
    const currentTask = tasks.value[index];
    tasks.value[index] = { ...currentTask, ...updateTask };

    const originalIndex = originalTasks.value.findIndex((e) => e.id === taskId);
    if (originalIndex !== -1) {
      originalTasks.value[originalIndex] = {
        ...originalTasks.value[originalIndex],
        ...updateTask,
      };
    }
  }
  function deleteTask(taskId) {
    tasks.value.splice(
      tasks.value.findIndex((task) => task.id === taskId),
      1
    );
  }
  function tranferStatus(id, newStatus) {
    console.log(tasks.value);
    console.log(newStatus);
    tasks.value
      .filter((st) => {
        return st.status.id === id;
      })
      .forEach((st) => {
        console.log(st);
        console.log(newStatus);
        st.status = newStatus;
      });
    console.log(tasks.value);
  }
  function sortTaskByStatusName(sortState) {
    console.log(sortState);
    if (sortState === 0) {
      tasks.value.sort((a, b) => {
        return a.status.name.localeCompare(b.status.name);
      });
      return 1;
    } else if (sortState === 1) {
      tasks.value.sort((a, b) => {
        return b.status.name.localeCompare(a.status.name);
      });
      return 2;
    } else if (sortState === 2) {
      tasks.value = [...originalTasks.value];
      return 0;
    }
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
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTasks, import.meta.hot));
}
