<!-- dont put @blur on every input find another way -->

<template>
    <main>
        <div class="w-fit">home</div>
    </main>
    <main class="mt-4">
        <comp-counter></comp-counter>
    </main>

    <main>
        <x-button @clicked="state.isOpen = true">Open Modal</x-button>
        <comp-modal :isOpen="state.isOpen" @close="state.isOpen = false" @confirm="state.isOpen = false" swapButtons
            title="Custom Title">
            <img src="@/assets/logo.svg" alt="logo" class="w-20 h-20" />
        </comp-modal>
    </main>

    <main>
        <x-button @clicked="showToast">showToast</x-button>
    </main>
</template>

<script>

export default {
    data() {
        return {
            appdata,
            state: {
                isOpen: false
            },
        }
    },
    methods: {
        showToast() {
            uptoast(this.$toast).preset('success')
        },
    },
}
</script>
