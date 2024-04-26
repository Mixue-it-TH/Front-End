<script setup>
const emit = defineEmits(["back"])
const props = defineProps({
	taskDetails: {
		type: Object,
	},
	timeZone: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<div class="bg-grey-500 backdrop-blur-lg w-screen h-screen fixed top-0 left-0 pt-[100px]">
		<div class="itbkk-title w-full border-b-2 border-gray pl-6">
			<h1 class="p-2 text-2xl">Design Backend API for PBI 1</h1>
		</div>

		<br />
		<!-- description -->
		<div class="flex">
			<br />
			<div>
				<p class="ml-7">Description</p>
				<textarea class="itbkk-description ml-7 w-[950px] h-[450px] border border-black rounded-lg"
					:class="!taskDetails.taskDescription ? 'italic' : ''">
				{{
						taskDetails.taskDescription
							? taskDetails.taskDescription
							: "No Description Provided" }} </textarea>
			</div>
			<div class="flex flex-col ml-10">
				<div>
					<p>Assignees</p>
				</div>
				<div class="itbkk-assignees w-[400px] h-[200px] border border-black rounded-lg"
					:class="!taskDetails.taskAssignees ? 'italic' : ''">
					{{
						taskDetails.taskAssignees ? taskDetails.taskAssignees : "Unassigned" }} </div>
				<!-- status -->
				<div class="itbkk-status w-[200px] h-[45px] mt-5">
					<label class="" for="cars">
						<p class="pl-1">Status</p>
					</label>

					<select name="status">
						<option value="no_status">No Status</option>
						<option value="to_do">To Do</option>
						<option value="doing">Doing</option>
						<option value="done">Done</option>
					</select>
				</div>

				<!-- timezone -->
				<div class="ml-3 mt-5 flex flex-col">
					<div class="flex flex-wrap">
						<p>Time Zone</p>
						<div class="itbkk-timezone w-[300px] h-[40px] border border-black rounded-lg ml-8">
							{{ timeZone }}
						</div>
					</div>
					<div class="flex flex-wrap mt-6">
						<p>Created On</p>
						<div class="itbkk-created-on w-[300px] h-[40px] border border-black rounded-lg ml-6">
							{{ taskDetails.createdOn}}
						</div>
					</div>
					<div class="flex flex-wrap mt-6">
						<p>Updated On</p>
						<div class="itbkk-updated-on w-[300px] h-[40px] border border-black rounded-lg ml-4">
							{{ taskDetails.updatedOn }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="itbkk-* border-t-2 mt-6 flex flex-row-reverse">
			<div class="flex mt-5 mr-10">
				<button class="itbkk-button border-white border-2 rounded-2 text-white bg-green-400">
					ok
				</button>
				<button @click="$emit('back', false)"
					class="itbkk-button border-white border-2 rounded-2 text-white bg-gray-400">
					Close
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
