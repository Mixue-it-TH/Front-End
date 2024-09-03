<script setup>
import Navbar from "../Navbar/Navbar.vue";

const emit = defineEmits(["alert"]);

function alertMessage(type, message) {
  emit("alert", type, message);
}
</script>

<template>
  <Navbar @alert="alertMessage" />
  <RouterView @alert="alertMessage" />
</template>

<style scoped></style>
