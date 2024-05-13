<script setup>
const props = defineProps({
	jobs: {
		type: Array,
	},
	statuses: {
		type: Array,
	},
});
</script>
<template>
	<div>
		<slot v-for="(job, index) in jobs" :key="index" :job="job"> </slot>
		<slot name="notask"></slot>
		<slot name="status" v-for="(status, index) in statuses" :key="index" :status="status"></slot>
	</div>
</template>

<style scoped></style>
