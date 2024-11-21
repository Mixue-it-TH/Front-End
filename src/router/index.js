import { createRouter, createWebHistory } from "vue-router";
import { useAccount } from "@/store/account";
import NotFound from "@/views/NotFound.vue";
import TaskModal from "@/components/Task/TaskModal.vue";
import StatusModal from "@/components/Status/StatusModal.vue";
import AppLayout from "@/components/Ui/AppLayout.vue";
import Board from "@/components/Board/BoardLayout.vue";
import Tasks from "@/components/Task/Tasks.vue";
import Statuses from "@/components/Status/Statuses.vue";
import CreateBoardModal from "@/components/Board/CreateBoardModal.vue";
import collaborator from "@/components/collaborator/Collaborator.vue";
import SignInView from "@/views/SignInView.vue";
import InviteView from "@/views/InviteView.vue";
import { login } from "@/util/accountFetchUtil";
const routes = [
  {
    path: "/",
    component: AppLayout,

    children: [
      { path: "", redirect: "/board" },
      {
        path: "/board",
        component: Board,
        children: [{ path: "add", name: "boardAdd", component: CreateBoardModal }],
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
          { path: "add", name: "statusAdd", component: StatusModal },
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
      },
    ],
  },
  {
    path: "/board/:id/collab/invitations",
    name: "invite",
    component: InviteView,
  },
  {
    path: "/login",
    name: "login",
    component: SignInView,
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

// Helper functions
function isLoginRoute(path) {
  return path === "/login";
}

function isBoardsPath(path) {
  const boardsPathPattern = /^\/(sy2\/)?board\/[a-zA-Z0-9\-_]+(\/(task(\/(\d+|add))?|status(\/(\d+|add))?)(\/edit)?)?$/;
  return boardsPathPattern.test(path);
}

function redirectToLogin(next) {
  next({ path: "/login" });
}

function proceedWithDecodedToken(token, accountStore, next) {
  accountStore.decodedToken(token);
  next();
}

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const accountStore = useAccount();

  if (isLoginRoute(to.path)) {
    next();
  } else if (to.path.includes("invitations")) {
    next();
  } else if (!token) {
    isBoardsPath(to.path) ? next() : redirectToLogin(next);
  } else {
    proceedWithDecodedToken(token, accountStore, next);
  }
});

export default router;
