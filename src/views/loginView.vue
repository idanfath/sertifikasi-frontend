<template>
    <div class="page center">
        <div class="card w-[400px] space-y-3">
            <p class="text-2xl font-bold text-center my-5">Welcome Back</p>
            <p class="input-label">Username</p>
            <x-input v-model="form.username" placeholder="Masukkan username" />
            <p class="input-label">Password</p>
            <x-input type="password" v-model="form.password" placeholder="Masukkan password" />
            <x-button useLoading @clicked="onSubmit" class="w-full ">Masuk</x-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
            v$: useVuelidate()
        }
    },
    methods: {
        onSubmit(resolveLoading) {
            useAuthStore().login(this.form).then((res) => {
                console.log(res)
                this.$router.replace({ name: 'home' })
            }).catch((er) => {
                console.log(er)
            }).finally(() => {
                resolveLoading()
            })
        }
    },
    validations() {
        return {
            form: {
                username: { required, minLength: minLength(3) },
                password: { required, minLength: minLength(8) },
            }
        }
    },
    mounted() {
        this.v$.$touch()
    },
}
</script>
