<script setup>
import {useAccount} from "@/store/account";
import {computed} from "vue";

const accountStore = useAccount();

const permission = computed(() => accountStore.permission);
</script>

<template>
  <div
    v-if="!permission"
    class="tooltip"
    data-tip="You need to be board owner to perform this action."
  >
    <slot></slot>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<style scoped></style>
