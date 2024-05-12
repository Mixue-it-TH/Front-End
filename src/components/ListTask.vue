<script setup>
import { RouterLink } from "vue-router"
import { useTasks } from "@/store/task.js"
import { convertStatus } from "@/util/formatUtils"
import Listmodel from "@/components/ListModel.vue"

const emit = defineEmits(["delete"])

const taskManagement = useTasks();
</script>

<template>
    <div class="h-[500px]">
        <div class="flex justify-between items-center w-[100%] px-[20px] min-h-[45px] font-[550]">
            <div class="w-[10%]">
                <p>No</p>
            </div>
            <div class="w-[50%] px-[15px]">
                <p>Title</p>
            </div>
            <div class="w-[10%]">
                <p>Status</p>
            </div>
            <div class="w-[30%]">
                <p class="">Assignees</p>
            </div>
        </div>
        <router-link :to="{ name: 'taskAdd' }">
            <div
                class="itbkk-button-add flex items-center min-h-[55px] mb-[5px] px-[15px] border-dashed border-[3px] border-[#FFCB45] rounded-[8px]">
                <div class="flex flex-row w-[50%]">
                    <div class="mr-[10px]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6L12 18" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
                            <path d="M18 12L6 12" stroke="#E2A300" stroke-width="2" stroke-linecap="round" />
                        </svg>
                    </div>
                    <div class="font-[430]">Add New Task</div>
                </div>
            </div>
        </router-link>

        <Listmodel :jobs="taskManagement.getAllTask()" v-if="taskManagement.getAllTask().length != 0">
            <template #default="slotprop">
                <div
                    class="itbkk-item flex justify-between w-[100%] min-h-[55px] px-[28px] py-[10px] mb-[3px] break-all border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] hover:drop-shadow-2xl">
                    <router-link :to="{ name: 'taskDetail', params: { id: slotprop.job.id } }" class="w-full h-full">
                        <div class="flex w-full min-h-[55px]">
                            <div class="w-[10%] font-[350]">
                                <p class="m-[auto]">
                                    {{ slotprop.key + 1 }}
                                </p>
                            </div>
                            <div class="w-[50%]">
                                <div class="itbkk-title px-[15px] font-[430]">
                                    {{ slotprop.job.title }}
                                </div>
                            </div>
                            <div class="w-[10%]">
                                <div class="w-[100px] rounded-[5px] flex items-center justify-center" :style="{
            backgroundColor: slotprop.job.status.statusColor,
        }">
                                    <p class="itbkk-status text-white">
                                        {{ convertStatus(slotprop.job.status.name) }}
                                    </p>
                                </div>
                            </div>
                            <div class="w-[30%] font-[350]">
                                <p class="itbkk-assignees" :class="{
            'italic text-gray-500': !slotprop.job.assignees,
        }">
                                    {{
            slotprop.job.assignees
                ? slotprop.job.assignees
                : "Unassigned"
        }}
                                </p>
                            </div>
                        </div>
                    </router-link>
                    <div class="itbkk-button-action dropdown dropdown-end dropdown-hover ">
                        <div tabindex="0" role="button" class="btn m-1 z-[0] ">
                            <svg width="7" height="30" viewBox="0 0 7 30" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="3.5" r="3.5" fill="#969696" />
                                <circle cx="3.5" cy="26.5" r="3.5" fill="#969696" />
                                <circle cx="3.5" cy="14.8335" r="3.5" fill="#969696" />
                            </svg>
                        </div>
                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            <router-link :to="{ name: 'taskEdit',params: {id: slotprop.job.id}}">
                                <li class="itbkk-button-edit">
                                    <a>Edit</a>
                                </li>
                            </router-link>
                            <li class="itbkk-button-delete" @click="emit('delete',slotprop.job, slotprop.key + 1)">
                                <a>Delete</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
        </Listmodel>
        <div v-else
            class="w-[100%] border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] min-h-[45px] flex items-center justify-center">
            <div class="m-[auto]">NO TASK LIST</div>
        </div>
    </div>
</template>

<style scoped></style>