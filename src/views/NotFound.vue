<script setup>
import { useRouter } from "vue-router"
const router = useRouter()

function back() {
    router.push("/")
}
</script>

<template>
    <div class="w-screen h-screen fixed top-0 left-0 bg-[#F4F4F4] z-[50]">
        <div class="flex flex-col justify-center items-center mt-[auto] h-screen">
            <div class="text-[55px] font-[650]">404 PAGE NOT FOUND
            </div>
            <button @click="back"
                class="transition border bg-red-500 w-[180px] h-[50px] mt-[20px] rounded-[10px] text-white font-[600] hover:bg-red-700">GO
                TO
                HOME
                PAGE</button>
        </div>
    </div>
</template>

<style scoped></style>