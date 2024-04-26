<script setup>
import { defineProps } from "vue"
const props = defineProps({
	jobs: {
		type: Array,
	},
});
</script>
<template>
	<div>
		<slot v-for="(job, index) in jobs" :key="index" :job="job"> </slot>
		<slot name="notask"></slot>
	</div>
</template>

<style scoped></style>
