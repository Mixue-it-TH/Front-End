<script setup>
const emit = defineEmits(["cancel", "confirm"]);
const props = defineProps({
  objectDetail: {
    type: Object,
  },
  mode: {
    type: String,
  },
});
</script>

<template>
  <div class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto">
    <div class="flex justify-center items-center w-screen h-screen">
      <div class="fade-up flex flex-col bg bg-white w-[45%] min-w-[300px] min-h-[250px] rounded-[7px]">
        <div class="text-[28px] font-[600] h-[40%] px-[15px] py-[10px]">
          {{ mode === "delete" ? "Remove Collaborator" : mode === "edit" ? "Change Access Right" : "Leave Board" }}
        </div>
        <div
          v-if="mode === 'delete'"
          class="itbkk-message border border-gray-300 min-h-[120px] px-[15px] py-[10px] break-all"
        >
          Do you want to
          <span>{{ objectDetail.status ? "cancel" : "remove" }}</span>
          invitation to "{{ objectDetail.name }}"
        </div>

        <div
          v-else-if="mode === 'edit'"
          class="itbkk-message border border-gray-300 min-h-[120px] px-[15px] py-[10px] break-all"
        >
          Do you want to change access right of "{{ objectDetail.name }}" to
          {{ objectDetail.accessRight === "READ" ? "READ" : "WRITE" }}
        </div>

        <div v-else class="itbkk-message border border-gray-300 min-h-[120px] px-[15px] py-[10px] break-all">
          Do you want to leave this "{{ objectDetail.name }} personal board" board?
          <!-- {{ collabDetail.access_right === "READ" ? "READ" : "WRITE" }} -->
        </div>

        <div class="flex flex-row justify-end items-end gap-[20px] h-[25%] mt-[auto] px-[15px] py-[10px]">
          <div
            @click="$emit('confirm', objectDetail.oid, objectDetail)"
            class="itbkk-button-confirm flex items-center justify-center h-[50px] w-[100px] text-white bg-green-500 rounded-[5px]"
          >
            <button class="w-full h-full">Confirm</button>
          </div>
          <div
            class="itbkk-button-cancel flex items-center justify-center h-[50px] w-[100px] text-white bg-red-500 rounded-[5px]"
            @click="$emit('cancel', false, objectDetail.oid, objectDetail)"
          >
            <button class="w-full h-full">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
