<script setup>
import { ref } from "vue";
import { useAccount } from "@/store/account";

const access = ref("READ");
const email = ref("");
const accountStore = useAccount();
const isDisable = ref(true);
const isSameEmail = ref(false);

function handleValidEmail() {
  const isInvalidEmail = !email.value.includes("@");
  const isExistingEmail = accountStore.getData().email === email.value;

  isDisable.value = isInvalidEmail || isExistingEmail;
  isSameEmail.value = isExistingEmail;
}
</script>

<template>
  <div class="bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] flex items-center justify-center font-noto">
    <div
      class="fade-up itbkk-modal-setting text-black flex flex-col w-[90%] min-w-[300px] max-w-[600px] rounded-lg bg-white shadow-lg overflow-hidden"
    >
      <div class="">
        <div class="border-b border-gray-500 px-[15px] py-[8px] mb-[15px] text-[30px] font-[500]">
          <h2 class="">Add Collaborator</h2>
        </div>

        <div class="flex px-4 space-x-4">
          <div class="flex-1">
            <p>Collaborator Email</p>
            <input
              type="text"
              @input="handleValidEmail"
              v-model="email"
              placeholder="Enter Your E-mail"
              class="w-full text-white border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div v-show="isSameEmail" class="text-red-500 font-semibold text-xs">
              You can't add yourself to collaborator
            </div>
          </div>

          <div class="flex-1">
            <p>Access Right</p>
            <select
              v-model="access"
              class="w-full text-white border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="READ">Read</option>
              <option value="WRITE">Write</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-5">
        <button
          class="itbkk-button itbkk-button-confirm w-[80px] h-[40px] font-bold text-white bg-green-600 hover:bg-green-500 rounded-lg transition duration-200"
          :class="isDisable ? 'opacity-50 cursor-not-allowed' : ''"
          :disabled="isDisable"
          @click="$emit('save', access, email)"
        >
          Add
        </button>
        <button
          class="itbkk-button itbkk-button-cancel w-[80px] h-[40px] font-bold bg-white text-red-600 border border-red-600 hover:bg-red-100 rounded-lg transition duration-200"
          @click="$emit('cancle')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
