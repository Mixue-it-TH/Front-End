<script setup>
import { ref } from "vue"
import router from "@/router"
import { login } from "@/util/accountFetchUtil"
import { useAccount } from "@/store/account"
const emit = defineEmits(["alert"])
const userName = ref("")
const password = ref("")
const accountStore = useAccount()
const isValid = ref(false)

async function register(e) {
  e.preventDefault()
  // fetch api
  const response = await login(
    import.meta.env.VITE_BASE_URL + "/authentications/login",
    userName.value,
    password.value
  )
  if (response.access_token) {
    accountStore.decodedToken(response.access_token)
    console.log("data", accountStore.getData())
    accountStore.setToken(response.access_token)
    router.push("/task")
  } else {
    emit(
      "alert",
      "error",
      "An error has occurred, Username or Password is incorrect"
    )
    password.value = ""
    isValid.value = true
  }
  // localStorage.setItem("token", token)
  console.log("response", response)
}
</script>

<template>
  <div>
    <div class="hero bg-gray-200 max-h-screen z-50 absolute inset-0">
      <div class="hero-content flex-col lg:flex-row-reverse mb-[500px]">
        <div class="text-center lg:text-left">
          <img
            class="ml-[10px] tablet:w-[15%] laptop:w-[100px] mobile:w-[5%]"
            src="/image/SIT-logo.png"
          />
          <h1>Sign in Kanban</h1>
        </div>

        <div class="card bg-white w-[250%] shrink-0 shadow-2xl">
          <form class="card-body">
            <div class="form-control">
              <label class="label">
                <span class="label-text">UserName </span>
              </label>

              <input
                v-model="userName"
                type="text"
                placeholder="username"
                class="input input-bordered bg-gray-200"
                @click="isValid = false"
                :class="isValid === true ? 'border border-red-600' : ''"
                maxlength="50"
                required
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Password</span>
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="password"
                class="input input-bordered bg-gray-200"
                :class="
                  isValid === true && password === ''
                    ? 'border border-red-600'
                    : ''
                "
                maxlength="14"
                required
              />

              <label class="label">
                <a href="#" class="label-text-alt link link-hover"
                  >Forgot password?</a
                >
              </label>
            </div>
            <div class="form-control mt-6">
              <button
                class="btn btn-primary text-xl"
                @click="register"
                :disabled="userName === '' || password === ''"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <footer
        class="footer flex justify-center bg-gray-200 text-neutral-content mt-[100px] w-screen"
      >
        <nav
          class="grid-flow-col gap-4 md:place-self-center md:justify-self-end"
        >
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
              ></path>
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
              ></path>
            </svg>
          </a>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              class="fill-current"
            >
              <path
                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
              ></path>
            </svg>
          </a>
        </nav>
      </footer>
    </div>

    <!-- footer -->
  </div>
</template>

<style scoped></style>
