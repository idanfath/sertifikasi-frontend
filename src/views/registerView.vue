<template>
    <main class="w-full flex max-lg:justify-center">
        <form @submit.prevent class="lg:w-[400px] space-y-3">
            <p class="text-2xl font-bold max-lg:text-center">Register</p>
            <p class="input-label">Username</p>
            <x-input v-model="form.username" placeholder="Username" />
            <p class="input-label">Password</p>
            <x-input type="password" v-model="form.password" placeholder="Password" />
            <p class="input-label">Password Confirmation</p>
            <x-input type="password" v-model="form.password_confirmation" placeholder="Password Confirmation" />
            <x-button useLoading @clicked="onSubmit" :disabled="v$.form.$invalid" class="w-full">Register</x-button>
        </form>
    </main>
</template>
<script>
export default {
    name: 'register',
    data() {
        return {
            form: {
                username: '',
                password: '',
                password_confirmation: '',
            },
            reset: {},
            v$: useVuelidate()
        }
    },
    validations() {
        return {
            form: {
                username: { required, minLength: minLength(3) },
                password: { required, minLength: minLength(8) },
                password_confirmation: { required, sameAs: sameAs(this.form.password) }
            },
        }
    },
    mounted() {
        this.v$.$touch();
        this.reset = { ...this.form };
    },
    methods: {
        onSubmit(resolveLoading) {
            useAuthStore().register(this.form).then((res) => {
                uptoast(this.$toast).preset('success')
                this.form = { ...this.reset }
            }).catch((er) => {
                try {
                    uptoast(this.$toast, 'error', er.response.data.message)
                } catch (error) {
                    uptoast(this.$toast).preset('error')
                }
            }).finally(() => {
                resolveLoading()
            })
        },
    },
};
</script>
<style scoped></style>
