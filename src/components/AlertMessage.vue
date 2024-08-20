<script setup>
const emit = defineEmits(["close"])

const props = defineProps({
  type: {
    type: String,
    default: "success"
  },
  message: {
    type: String,
    require: true,
    default: "undifiend"
  }
})
</script>

<template>
  <div
    class="fade-up fixed right-0 bottom-0 mr-[30px] mb-[30px] w-[280px] z-[100] flex justify-between px-[15px] py-[10px]"
    :class="type"
  >
    <div>
      <h1 class="font-[700]">{{ type === "success" ? "Success" : "Error" }}</h1>
      <p class="itbkk-message">
        {{ message }}
      </p>
    </div>
    <div class="cursor-pointer font-[700]" @click="$emit('close', false)">
      X
    </div>
  </div>
</template>

<style scoped>
.success {
  color: #047857;
  border-color: #047857;
  border-radius: 5px;
  background-color: #d1fae5;
}

.error {
  color: #dc2626;
  border-color: #dc2626;
  border-radius: 5px;
  background-color: #fee2e2;
}
</style>
