<script setup>
import { computed, ref, onMounted } from "vue";
import { getStatusList } from "@/util/fetchUtils";

import { RouterLink, RouterView, useRoute } from "vue-router";
import { useStatus } from "@/store/status.js";
import ListModel from "../Ui/ListModel.vue";
import TooltipBtn from "../Ui/TooltipBtn.vue";
import { useAccount } from "@/store/account";

const accountStore = useAccount();
const statusManagement = useStatus();
const route = useRoute();
const permission = computed(() => accountStore.permission);

console.log(accountStore.getData());
console.log(accountStore.getData().role);
console.log(accountStore.getData().name);
console.log(accountStore.getData().email);
console.log(accountStore.getData().email);
// onMounted(async () => {
//   const listStatuses = await handleRequestWithTokenRefresh(
//     getStatusList,
//     route.params.id
//   );

//   if (listStatuses === 404) {
//     router.push("/login");
//   }
//   if (statusManagement.getAllStatus().length === 0) {
//     statusManagement.addStatuses(listStatuses);
//   }
// });
</script>

<template>
  <div>
    <div class="mt-[20px] text-gray-700 min-w-[740px]">
      <div
        class="flex justify-between items-center w-full px-5 min-h-[45px] font-medium"
      >
        <div class="w-[10%] text-center">
          <p>No</p>
        </div>
        <div class="w-[35%] text-center">
          <p>Name</p>
        </div>
        <div class="w-[25%] text-center">
          <p>E-mail</p>
        </div>
        <div class="w-[20%] text-center">
          <p>Access Right</p>
        </div>
        <div class="w-[10%] text-center">
          <p>Action</p>
        </div>
      </div>

      <ListModel :jobs="statusManagement.getAllStatus()">
        <template #default="slotprop">
          <div
            class="transition itbkk-item flex justify-between w-full min-h-[55px] px-[20px] py-[10px] mb-[3px] border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] hover:drop-shadow-2xl"
          >
            <div class="w-[10%] text-center">
              <p>{{ slotprop.key + 1 }}</p>
            </div>

            <div class="w-[35%]">
              <p class="itbkk-status-name text-center">
                {{ slotprop.job.name }}
              </p>
            </div>

            <div class="w-[25%]">
              <p class="itbkk-status-email text-center">
                {{ slotprop.job.name }}
              </p>
            </div>

            <div class="w-[20%] text-center">
              <select
                class="border p-2 rounded text-center w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Read">Read</option>
                <option value="Write">Write</option>
              </select>
            </div>

            <div class="w-[10%] flex justify-center">
              <TooltipBtn>
                <div class="flex gap-4 justify-center">
                  <router-link
                    :to="{
                      name: 'statusEdit',
                      params: { statusId: slotprop.job.id },
                    }"
                  ></router-link>
                  <button
                    class="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow-lg hover:scale-105 transition duration-200 ease-in-out border border-transparent"
                  >
                    Remove
                  </button>
                </div>
              </TooltipBtn>
            </div>
          </div>
        </template>
      </ListModel>
    </div>
  </div>
  <RouterView></RouterView>
</template>

<style scoped></style>
