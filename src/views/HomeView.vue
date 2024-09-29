<!-- dont put @blur on every input find another way -->

<template>
    <main class="p-5">

        <button>testbutton</button>

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
                <p>This is the modal content. You can put anything here.</p>
            </comp-modal>
        </main>

        <main>
            <x-button @clicked="showToast">showToast</x-button>
        </main>
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
            form: {
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            },
        }
    },
    methods: {
        showToast() {
            uptoast().preset('success')
        },
    },
}
</script>
