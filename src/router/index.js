import {createRouter, createWebHistory} from "vue-router";

import NotFound from "@/views/NotFound.vue";
import TaskModal from "@/components/Task/TaskModal.vue";
import StatusModal from "@/components/Status/StatusModal.vue";
import LoginView from "@/views/LoginView.vue";
import AppLayout from "@/components/Ui/AppLayout.vue";
import Board from "@/components/Board/BoardLayout.vue";
import Tasks from "@/components/Task/Tasks.vue";
import Statuses from "@/components/Status/Statuses.vue";
import CreateBoardModal from "@/components/Board/CreateBoardModal.vue";
import {useAccount} from "@/store/account";
import {useAlert} from "@/store/alert";

import collaborator from "@/components/collaborator/Collaborator.vue";
import collaboratorModal from "@/components/collaborator/CollaboratorAddModal.vue";
const routes = [
  {
    path: "/",
    component: AppLayout,

    children: [
      {path: "", redirect: "/board"},
      {
        path: "/board",
        component: Board,
        children: [
          {path: "add", name: "boardAdd", component: CreateBoardModal},
        ],
      },

      {
        path: "/board/:id",
        name: "boardTask",
        component: Tasks,
        children: [
          {path: "task/add", name: "taskAdd", component: TaskModal},
          {
            path: "task/:taskId",
            name: "taskDetail",
            component: TaskModal,
          },
          {
            path: "task/:taskId/edit",
            name: "taskEdit",
            component: TaskModal,
          },
        ],
      },

      {
        path: "/board/:id/status",
        component: Statuses,
        children: [
          {path: "add", name: "statusAdd", component: StatusModal},
          {
            path: ":statusId",
            name: "statusDetail",
            component: StatusModal,
          },
          {
            path: ":statusId/edit",
            name: "statusEdit",
            component: StatusModal,
          },
        ],
      },
      {
        path: "/board/:id/collab",
        name: "collaborator",
        component: collaborator,
        children: [
          // {
          //   path: ":collabId",
          //   name: "collaboratorDetail",
          //   component: collaboratorModal,
          // },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/:notfound(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const accountStore = useAccount();
  const boardsPathPattern =
    /^\/(sy2\/)?board\/[a-zA-Z0-9\-_]+(\/(task(\/(\d+|add))?|status(\/(\d+|add))?)(\/edit)?)?$/;

  if (to.path !== "/login") {
    if (!token) {
      if (boardsPathPattern.test(to.path)) {
        next();
      } else {
        next({
          path: "/login",
        });
      }
    } else {
      accountStore.decodedToken(token);
      next();
    }
  } else {
    next();
  }
});

export default router;
