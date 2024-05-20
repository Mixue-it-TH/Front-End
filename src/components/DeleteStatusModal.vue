<script setup>
import { useStatus } from "@/store/status.js"
import { convertStatus } from "@/util/formatUtils"
import { ref } from "vue"
const emit = defineEmits(["cancel", "confirm"])

const props = defineProps({
	stDetail: {
		type: Object,
	},
	id: {
		type: Number,
	},
	stage: {
		type: String,
	},
	tranferData: {
		type: Array,
	},
	amountTasks: {
		type: Number,
	},
	limitExceed: {
		type: Array,
	},
})

const newStatus = ref({ id: 1, name: "", description: "", statusColor: "" })
console.log(props.limitExceed)
</script>

<template>
	<div
		class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[10] font-nonto"
	>
		<div class="flex justify-center items-center w-screen h-screen">
			<div class="fade-up flex flex-col bg bg-white w-[45%] min-h-[250px]">
				<div class="text-[28px] font-[600] h-[40%] px-[15px] py-[10px]">
					Delete a Status !!
				</div>
				<div
					class="itbkk-message border border-gray-300 min-h-[120px] px-[15px] py-[10px] break-all"
				>
					<div v-if="stage === 'delete'" class="pb-[20px]">
						Do you want to delete the
						<span class="text-red-600">"{{ stDetail.name }}" status ?</span>
					</div>
					<div v-else class="pb-[20px]">
						There is some task associated with the

						<span class="text-red-500">{{ amountTasks }}</span>
						status.
						<p class="break-all">
							These statuses that have reached the task limit. No additional
							tasks can be added to these statuses at this time.
						</p>
						<div
							v-show="limitExceed.length > 0"
							v-for="(task, index) in limitExceed"
							:key="index"
							class="itbkk-filter-item text-white border border-gray-400 rounded-md mt-2.5 flex flex-row gap-[5px] w-[100px] items-center justify-center p-0.5 me-2 text-sm font-medium bre"
							:style="{ backgroundColor: task.statusColor }"
						>
							<p>
								{{ task.name }} <span>{{ task.numOfTasks }}</span>
							</p>
						</div>
						<div class="mt-[15px]">
							<span class="">you need to transfer to</span>
							<div class="mt-[10px] border-2">
								<select
									name="status"
									class="itbkk-status w-full h-full min-h-[50px] px-[15px]"
									v-model="newStatus.id"
									:required="true"
									v-if="stage === 'tranfer'"
								>
									<option
										v-for="(status, index) in tranferData"
										:key="index"
										:value="status.id"
									>
										{{ convertStatus(status.name) }}
									</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div
					class="flex flex-row justify-end items-end gap-[20px] h-[25%] mt-[auto] px-[15px] py-[10px]"
				>
					<div
						@click="$emit('confirm', stDetail.id, newStatus.id)"
						class="itbkk-button-confirm flex items-center justify-center h-[50px] w-[100px] text-white bg-green-500 rounded-[5px]"
					>
						<button class="w-full h-full">Confirm</button>
					</div>
					<div
						class="itbkk-button-cancel flex items-center justify-center h-[50px] w-[100px] text-white bg-red-500 rounded-[5px]"
						@click="$emit('cancel', false)"
					>
						<button class="w-full h-full">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.fade-up {
	animation: fadeUp 0.5s ease-out;
}

@keyframes fadeUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
