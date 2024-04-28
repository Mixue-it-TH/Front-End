import { createRouter, createWebHistory } from "vue-router"

import ListTodo from "@/components/ListTodo.vue"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			redirect: "/task",
		},
		{
			path: "/task",
			name: "task	",
			component: ListTodo,
			// component: backup,
		},
		{
			path: "/task/:id",
			name: "id",
			component: ListTodo,
			props: true,
		},
	],
})

export default router
