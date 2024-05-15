<script setup>
const emit = defineEmits(["cancel",]);

</script>

<template>
    <div class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto">
        <div class="fade-up flex justify-center items-center w-[100%] h-[100%]">
            <div class="itbkk-modal-task w-[75%] h-[90%] rounded-[15px] bg bg-white">

                <div @click="$emit('cancel', false)">
                    Cancle
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>