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
import { useAccount } from "@/store/account"

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
          { path: "add", name: "boardAdd", component: CreateBoardModal }
        ]
      },

      {
        path: "/board/:id",
        name: "boardTask",
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
        path: "/board/:id/status",
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

const tokenValid = (token) => {
  if (!token) {
    return false
  }
  const currentTime = Date.now() / 1000
}

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")
  const accountStore = useAccount()

  if (to.path !== "/login") {
    if (!token) {
      next({
        path: "/login"
      })
    } else {
      accountStore.decodedToken(token)

      if (accountStore.getData()?.exp < Date.now() / 1000) {
        next({
          path: "/login"
        })
      }

      next()
    }
  } else {
    next()
  }
})

export default router
