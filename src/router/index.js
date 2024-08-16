import { createRouter, createWebHistory } from "vue-router"

import NotFound from "@/views/NotFound.vue"
import Empty from "@/components/Empty.vue"
import TaskModal from "@/components/TaskModal.vue"
import StatusModal from "@/components/StatusModal.vue"
import LoginModal from "@/components/LoginModal.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/task"
    },
    {
      path: "/task",
      name: "taskList	",
      component: Empty
    },
    {
      path: "/task/:id",
      name: "taskDetail",
      component: TaskModal
    },
    {
      path: "/task/add",
      name: "taskAdd",
      component: TaskModal
    },
    {
      path: "/task/:id/edit",
      name: "taskEdit",
      component: TaskModal
    },
    {
      path: "/status",
      name: "status",
      component: Empty
    },
    {
      path: "/status/add",
      name: "statusAdd",
      component: StatusModal
    },
    {
      path: "/status/:id",
      name: "statusDetail",
      component: StatusModal
    },
    {
      path: "/status/:id/edit",
      name: "statusEdit",
      component: StatusModal
    },
    {
      path: "/login",
      name: "login",
      component: LoginModal
    },
    {
      path: "/:notfound(.*)",
      component: NotFound
    }
  ]
})

export default router
