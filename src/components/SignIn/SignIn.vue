<script setup>
import { onMounted, ref } from "vue";
import router from "@/router";
import { useTasks } from "@/store/task";
import { useStatus } from "@/store/status";
import { useAccount } from "@/store/account";
import { useAlert } from "@/store/alert";
import { login } from "@/util/accountFetchUtil";
import toggleIconShowHidePassword from "@/compasable/toggleIconShowHidePassword";
import TooltipBtn from "../Ui/TooltipBtn.vue";
const taskManagement = useTasks();
const statusManagement = useStatus();
const accountStore = useAccount();
const alertManagement = useAlert();
const user = ref({ username: "itbkk.olarn", password: "ip23/OLA" });
const isInvalid = ref();
const passwordField = ref(null);

function loginPopup() {
  localStorage.setItem("msal_Login", true);
  const redirectAfterLogin = encodeURIComponent(
    window.location.origin +
      `${import.meta.env.VITE_GROUP_CODE !== undefined ? import.meta.env.VITE_GROUP_CODE : ""}/login`
  );

  window.location.href = `${import.meta.env.VITE_LOGIN_URL}/login?redirect=${redirectAfterLogin}`;
}

onMounted(async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("theme");
  taskManagement.clearAllTask();
  statusManagement.clearAllStatus();
  if (localStorage.getItem("msal_logout")) {
    localStorage.removeItem("msal_logout");
    const redirectAfterLogin = encodeURIComponent(window.location.origin + "/login");
    window.location.href = `${import.meta.env.VITE_LOGIN_URL}/login?redirect=${redirectAfterLogin}`;
  }
});

async function signInHandler(e) {
  e.preventDefault();
  //CHECK

  // FETCH API
  const response = await login(user.value.username, user.value.password);

  if (response.access_token && response.refresh_token) {
    accountStore.decodedToken(response.access_token);
    accountStore.setToken(response.access_token, response.refresh_token);
    accountStore.setisLogin(true);

    const invitationLogIn = localStorage.getItem("invitationLogIn");

    if (invitationLogIn) {
      router.push(invitationLogIn);
      localStorage.removeItem("invitationLogIn");
    } else {
      router.push("/board");
    }
  } else {
    alertManagement.statusHandler("error", "An error has occurred, Username or Password is incorrect");
    user.value.password = "";
    isInvalid.value = true;
  }
}
</script>

<template>
  <div
    class="flex flex-col bg bg-white rounded-[10px] shadow-xl mobile:w-[320px] mobile-M:w-auto w-[400px] h-[500px] px-[20px] py-[20px]"
  >
    <div class="">
      <div class="text-[30px] font-[500]">Sign in</div>
      <div class="text-[14px]">This project is part of the Integrated project course</div>
    </div>

    <!-- FORM INPUT USERNAME & PASSWORD -->
    <form class="flex flex-col gap-[15px] mt-auto h-full" :onsubmit="signInHandler">
      <div class="flex flex-col gap-[20px] mt-[20px]">
        <div class="w-auto h-[50px] rounded-lg mb-[15px]">
          <div class="flex gap-[5px]">
            <div class="text-[14px] opacity-90">Username</div>
            <TooltipBtn :access="true" data="you need to fill username.">
              <div class="text text-red-500">*</div>
            </TooltipBtn>
          </div>
          <input
            @click="isInvalid = false"
            v-model="user.username"
            class="bg-white border border-gray-500 w-full h-full px-[10px] rounded-lg focus:outline-none focus:border-blue-500"
            :class="isInvalid ? 'border border-red-600' : ''"
            placeholder="Username"
          />
        </div>
        <div>
          <div class="flex flex-row gap-[5px]">
            <div class="text-[14px] opacity-90">Password</div>
            <TooltipBtn :access="true" data="you need to fill password.">
              <div class="text text-red-500">*</div>
            </TooltipBtn>
          </div>

          <div class="relative w-auto h-[50px] rounded-lg flex flex-row items-center justify-center">
            <input
              @click="isInvalid = false"
              v-model="user.password"
              class="bg-white border border-gray-500 w-full h-full px-[10px] rounded-lg focus:outline-none focus:border-blue-500"
              :class="isInvalid ? 'border border-red-600' : ''"
              placeholder="Password"
              type="password"
              ref="passwordField"
            />
            <img
              src="https://api.iconify.design/dashicons:hidden.svg?color=%23888888"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              @click="toggleIconShowHidePassword($event, passwordField)"
            />
          </div>
        </div>
        <div class="w-fit text-[14px] text-blue-700 hover:underline cursor-pointer">Forgot password?</div>
      </div>

      <!-- ACTION BUTTON -->
      <div class="flex flex-col mt-[10px] gap-[8px] mb-[10px]">
        <div>
          <button
            :disabled="!user.username || !user.password"
            type="submit"
            class="text-[18px] bg bg-blue-600 hover:bg-blue-800 disabled:bg-gray-300 border hover:border-blue-900 duration-150 w-full h-[55px] rounded-[50px] text-white"
          >
            Sign in
          </button>
        </div>
        <div class="flex items-center justify-center">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="mx-2 text-gray-500">or</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <div>
          <div
            @click="loginPopup"
            class="flex flex-row justify-center items-center gap-[10px] cursor-pointer w-full h-[55px] border rounded-[50px] duration-150 hover:bg-gray-100"
          >
            <svg width="35" height="35" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.522 44.5217H489.739V489.739H44.522V44.5217Z" fill="#F35325" />
              <path d="M534.261 44.5217H979.478V489.739H534.261V44.5217Z" fill="#81BC06" />
              <path d="M44.522 534.261H489.739V979.478H44.522V534.261Z" fill="#05A6F0" />
              <path d="M534.261 534.261H979.478V979.478H534.261V534.261Z" fill="#FFBA08" />
            </svg>

            Sign in with Microsoft
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
