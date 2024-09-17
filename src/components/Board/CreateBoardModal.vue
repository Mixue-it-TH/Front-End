<script setup>
import { useRouter } from "vue-router"
import { ref } from "vue"
import { createBoard } from "@/util/fetchUtils"
import { useAlert } from "@/store/alert"
import { useAccount } from "@/store/account"

const router = useRouter()
const prop = defineProps({
  name: {
    type: String
  }
})

const alertManagement = useAlert()
const accountStore = useAccount()
const boardName = ref(accountStore.getData().name)

async function saveBoard(name) {
  const newBoard = await createBoard(name)
  console.log(newBoard)
  if (newBoard === 401) {
    alertManagement.statusHandler(
      "error",
      `For security reasons, your session has expired. Please log back in.`
    )
    accountStore.unAuthorizeHandle()
  } else {
    accountStore.addBoard(newBoard)
    console.log(accountStore.getBoardList())
    closeModal()
  }
} // ปิด modal}

function closeModal() {
  router.push("/board")
  // router.go(-1);
  // router.go(-1) // previous page
}
</script>

<template>
  <div
    class="itbkk-modal-task backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto"
  >
    <div class="flex justify-center items-center w-[100%] h-[100%]">
      <div
        class="fade-up itbkk-modal-setting flex flex-col w-[75%] min-w-[300px] h-[50%] max-w-[600px] min-h-[200px] rounded-[8px] mobile-L:mb-[70px] mobile-L:h-[490px] bg bg-white"
      >
        <div
          class="border-b-2 border-black text-xl h-[70px] font-semibold flex items-center justify-between"
        >
          <p class="pl-[5px] pt-[10px]">Create Your Board</p>
        </div>
        <div class="mx-[5px]">
          <div class="flex gap-1 my-2">
            <p class="font-bold">Name</p>
            <p class="text-[#AFAFAF] text-[15px]">{{ boardName.length }}/120</p>
          </div>

          <input
            v-model="boardName"
            type="text"
            @input="handleCreateBoard"
            maxlength="120"
            placeholder="Your board name here"
            class="itbkk-title mt-[10px] w-[100%] border-[2px] border-gray-200 rounded-[4px] bg-white placeholder-slate-200 h-[50px] pl-[10px]"
          />

          <div class="flex flex-row-reverse mt-[10px]">
            <button
              @click="closeModal"
              class="itbkk-button itbkk-button-cancel w-[80px] h-[40px] font-[600] text-gary-800 bg bg-red-600 text-white hover:bg-red-400 rounded-lg mr-5"
            >
              cancel
            </button>
            <button
              @click="saveBoard(boardName)"
              class="itbkk-button-add itbkk-button-confirm disabled w-[65px] h-[40px] font-[600] text-white bg bg-green-500 hover:bg-green-400 rounded-lg mr-5"
            >
              save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
