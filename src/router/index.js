import { createRouter, createWebHistory } from "vue-router"

import NotFound from "@/views/NotFound.vue"
import TaskModal from "@/components/Task/TaskModal.vue"
import StatusModal from "@/components/Status/StatusModal.vue"
import LoginView from "@/views/LoginView.vue"
import AppLayout from "@/components/Ui/AppLayout.vue"
import Board from "@/components/Board/Board.vue"
import Tasks from "@/components/Task/Tasks.vue"
import Statuses from "@/components/Status/Statuses.vue"
import CreateBoardModal from "@/components/Board/CreateBoardModal.vue"

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", redirect: "/board" },
      {
        path: "board",
        component: Board,
        children: [
          { path: "add", name: "boardAdd", component: CreateBoardModal },
          {
            path: ":id",
            component: Tasks,
            children: [
              { path: "task/add", name: "taskAdd", component: TaskModal },
              {
                path: "task/:taskId",
                name: "taskDetail",
                component: TaskModal
              },
              {
                path: "task/:taskId/edit",
                name: "taskEdit",
                component: TaskModal
              }
            ]
          },
          {
            path: ":id/status",
            component: Statuses,
            children: [
              { path: "add", name: "statusAdd", component: StatusModal },
              {
                path: ":statusId",
                name: "statusDetail",
                component: StatusModal
              },
              {
                path: ":statusId/edit",
                name: "statusEdit",
                component: StatusModal
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: LoginView
  },
  {
    path: "/:notfound(.*)",
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    const token = localStorage.getItem("token")

    if (!token) {
      next({
        path: "/login"
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
