<script setup>
import { onMounted } from "vue";
import { getTokenByMicrosoftAuthen } from "@/util/accountFetchUtil";
import router from "@/router";
import SignIn from "@/components/SignIn/SignIn.vue";
import SignInFooter from "@/components/SignIn/SignInFooter.vue";
import SignInHeader from "@/components/SignIn/SignInHeader.vue";

onMounted(async () => {
  const msal_Login = localStorage.getItem("msal_Login");

  if (msal_Login) {
    const token = await getTokenByMicrosoftAuthen();
    localStorage.setItem("token", token.access_token);
    localStorage.setItem("refreshToken", token.refresh_token);
    localStorage.setItem("msal_logout", true);
    localStorage.removeItem("msal_Login");
    router.push("/board");
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center w-auto h-[90vh]">
    <SignInHeader />
    <SignIn />
    <SignInFooter />
  </div>
</template>

<style scoped></style>
