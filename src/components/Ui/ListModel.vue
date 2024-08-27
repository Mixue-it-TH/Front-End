<script setup>
const props = defineProps({
	jobs: {
		type: Array,
	},

});
</script>
<template>
	<div>
		<slot v-for="(job, index) in jobs" :key="index" :job="job"> </slot>
	</div>
</template>

<style scoped></style>
