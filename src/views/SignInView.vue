<script setup>
import SignIn from "@/components/SignIn/SignIn.vue";
import SignInFooter from "@/components/SignIn/SignInFooter.vue";
import SignInHeader from "@/components/SignIn/SignInHeader.vue";
</script>

<template>
  <div class="flex flex-col items-center justify-center w-auto h-[90vh]">
    <SignInHeader />
    <SignIn />
    <SignInFooter />
  </div>
</template>

<style scoped></style>
