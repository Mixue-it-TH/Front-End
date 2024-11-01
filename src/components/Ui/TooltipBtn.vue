<script setup>
import { useAccount } from "@/store/account";
import { computed } from "vue";

const props = defineProps({
  data: {
    type: String,
    default: "You need to be board owner to perform this action.",
  },
  access: {
    type: Boolean,
    default: false,
  },
});

const accountStore = useAccount();

const permission = computed(() => accountStore.permission);
console.log("access", props.access);
console.log("permiss", permission.value);
</script>

<template>
  <div v-if="!permission || access" class="tooltip" :data-tip="data">
    <slot></slot>
  </div>

  <div v-else>
    <slot></slot>
  </div>
</template>

<style scoped></style>
