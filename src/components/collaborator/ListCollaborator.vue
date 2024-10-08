<script setup>
import { computed, ref, onMounted } from "vue"
import { getCollaborators } from "@/util/accountFetchUtil"
import { RouterLink, RouterView, useRoute } from "vue-router"
import { useStatus } from "@/store/status.js"
import ListModel from "../Ui/ListModel.vue"
import TooltipBtn from "../Ui/TooltipBtn.vue"
import { useAccount } from "@/store/account"
import { useCollaborator } from "@/store/collaborator"
import { handleRequestWithTokenRefresh } from "@/util/handleRequest"

const emit = defineEmits(["delete", "edit"])
const accountStore = useAccount()
const collabStore = useCollaborator()
const route = useRoute()
const access = ref("") //ใส่เป็นค่า default ไปก่อนค่อยกลับมาแก้

onMounted(async () => {
  const collaboratorList = await handleRequestWithTokenRefresh(
    getCollaborators,
    route.params.id
  )
  if (collaboratorList) {
    collabStore.setCollaborator(collaboratorList)
  }
})

function changeAccessRight(collabDetail) {
  emit("edit", collabDetail)
}
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

      <ListModel
        :jobs="collabStore.getCollaborator()"
        v-if="collabStore.getCollaborator().length !== 0"
      >
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
                {{ slotprop.job.email }}
              </p>
            </div>

            <div class="w-[20%] text-center">
              <select
                @change="changeAccessRight(slotprop.job)"
                v-model="slotprop.job.access_right"
                class="border p-2 rounded text-center w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option :value="slotprop.job.access_right">
                  {{ slotprop.job.access_right }}
                </option>
                <option
                  :value="
                    slotprop.job.access_right === 'WRITE' ? 'READ' : 'WRITE'
                  "
                >
                  {{ slotprop.job.access_right === "WRITE" ? "READ" : "WRITE" }}
                </option>
              </select>
            </div>

            <div class="w-[10%] flex justify-center">
              <TooltipBtn>
                <div class="flex gap-4 justify-center">
                  <button
                    @click="emit('delete', slotprop.job)"
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
      <div
        v-else
        class="w-[100%] border border-[#DDDDDD] rounded-[10px] bg-[#F9F9F9] min-h-[45px] flex items-center justify-center"
      >
        <div class="m-[auto]">NO Collaborator</div>
      </div>
    </div>
  </div>
  <RouterView />
</template>

<style scoped></style>
