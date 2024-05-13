<script setup>
const emit = defineEmits(["cancel", "confirm"]);

const props = defineProps({
    taskDetails: {
        type: Object,
    },
    taskNumber: {
        type: Number,
    }
});


</script>

<template>
    <div class="backdrop-blur-sm bg-black/50 w-screen h-screen fixed top-0 left-0 z-[30] font-nonto">
        <div class="flex justify-center items-center w-screen h-screen">
            <div class="fade-up flex flex-col bg bg-white w-[45%] min-h-[250px]">
                <div class="text-[28px] font-[600] h-[40%] px-[15px] py-[10px]">Delete a Task
                </div>
                <div class="itbkk-message border border-gray-300 min-h-[120px] px-[15px] py-[10px] break-all">
                    Do you want to delete the task number {{ taskNumber }} - <span class="text-red-600">"{{
                        taskDetails.title }}" ?</span>
                </div>
                <div class="flex flex-row justify-end items-end gap-[20px] h-[25%] mt-[auto] px-[15px] py-[10px]">
                    <div @click="$emit('confirm', taskDetails.id)"
                        class="itbkk-button-confirm flex items-center justify-center h-[50px] w-[100px] text-white bg-green-500 rounded-[5px]">
                        <button class="w-full h-full">Confirm</button>
                    </div>
                    <div class="itbkk-button-cancel flex items-center justify-center h-[50px] w-[100px] text-white bg-red-500 rounded-[5px]"
                        @click="$emit('cancel', false)">
                        <button class="w-full h-full">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-up {
    animation: fadeUp 0.5s ease-out;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>