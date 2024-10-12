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
console.log("access", props.access);

const accountStore = useAccount();

const permission = computed(() => accountStore.permission);
console.log("permission", permission.value);
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
