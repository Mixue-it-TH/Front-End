<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStatus } from "@/store/status.js";
import { useAccount } from "@/store/account";
const router = useRouter();

const accountStore = useAccount();
const statusManagement = useStatus();

const permission = computed(() => accountStore.permission);
// function closeModal() {
//   router.push("/collab");
//   router.go(-1);
// }

console.log(accountStore.getData());
console.log(accountStore.getData().role);
console.log(accountStore.getData().name);
console.log(accountStore.getData().email);
</script>

<template>
  <div
    class="bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] flex items-center justify-center font-noto"
  >
    <div
      class="fade-up itbkk-modal-setting text-black flex flex-col w-[90%] min-w-[300px] max-w-[600px] rounded-lg bg-white shadow-lg overflow-hidden"
    >
      <div class="">
        <div
          class="border-b border-gray-500 px-[15px] py-[8px] mb-[15px] text-[30px] font-[500]"
        >
          <h2 class="">Add Collaborator</h2>
        </div>

        <div class="flex px-4 space-x-4">
          <div class="flex-1">
            <p>Collaborator Email</p>
            <input
              type="text"
              placeholder="Enter Your E-mail"
              class="w-full border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div class="flex-1">
            <p>Access Right</p>
            <select
              class="w-full border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Read</option>
              <option>Write</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 p-5">
        <button
          class="itbkk-button itbkk-button-confirm w-[80px] h-[40px] font-bold text-white bg-green-600 hover:bg-green-500 rounded-lg transition duration-200"
          @click="$emit('save')"
        >
          Add
        </button>
        <button
          class="itbkk-button itbkk-button-cancel w-[80px] h-[40px] font-bold bg-white text-red-600 border border-red-600 hover:bg-red-100 rounded-lg transition duration-200"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
