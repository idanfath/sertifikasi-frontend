<template>
    <transition name="modal-fade">
        <div v-if="isOpen" class="modal-overlay" @click="closeModal('backdrop')">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <slot name="header">
                        <h2 class="modal-title">{{ title }}</h2>
                        <x-button secondary class="!px-2" v-if="!hideClose" @click="closeModal">
                            <X class="close-icon" />
                        </x-button>
                    </slot>
                </div>
                <div class="modal-content">
                    <slot>
                        <!-- Default content, override by placing content here -->
                    </slot>
                </div>
                <div class="modal-footer flex gap-1" :class="{ 'flex-row-reverse': alignLeft }">
                    <x-button secondary @clicked="closeModal('cancel')"
                        :class="{ 'order-2': swapButtons }">Cancel</x-button>
                    <x-button @clicked="confirmAction">Confirm</x-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

import { X } from 'lucide-vue-next';

export default {
    name: 'Modal',
    components: {
        X
    },
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            default: 'Modal Title'
        },
        swapButtons: {
            type: Boolean,
            default: false
        },
        alignLeft: {
            type: Boolean,
            default: false
        },
        hideClose: {
            type: Boolean,
            default: false
        },
        persistent: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        closeModal(from) {
            if (this.persistent && from === 'backdrop') {
                console.log('Persistent modal cannot be closed by clicking outside');
                return;
            }

            this.$emit('close')
        },
        confirmAction() {
            this.$emit('confirm')
            this.closeModal()
        }
    }
}
</script>

<style scoped>
.close-icon {
    @apply w-5 h-5 text-gray-500;
}

.modal-overlay {
    @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-container {
    @apply bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ease-out;
}

.modal-header {
    @apply flex items-center justify-between p-4 border-b border-gray-300;
}

.modal-title {
    @apply text-xl font-semibold text-gray-800;
}


.modal-content {
    @apply py-3 px-4 text-gray-700;
}

.modal-footer {
    @apply flex justify-end p-4 border-t border-gray-300 space-x-3;
}


.cancel {
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500;
}


.modal-fade-enter-active,
.modal-fade-leave-active {
    @apply transition-opacity duration-300 ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    @apply opacity-0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
    @apply opacity-100;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
    @apply transition-all duration-300 ease-out;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
    @apply opacity-0 scale-95;
}

.modal-fade-enter-to .modal-container,
.modal-fade-leave-from .modal-container {
    @apply opacity-100 scale-100;
}
</style>
