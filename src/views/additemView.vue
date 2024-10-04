<template>

    <Toolbar>
        <template #start>
            <Button label="View Users" icon="pi pi-user" size="small" @click="confirmSwitchPage('users', $event)" />
        </template>
        <template #end>
            <Button label="Clear All Field" icon="pi pi-trash" size="small" severity="danger" @click="onReset" />
        </template>
    </Toolbar>

    <div class="*:lg:max-w-[300px]">
        <div class="text-2xl font-semibold my-4">
            Add Products
        </div>
        <div>
            <label for="name" class="block  font-semibold  text-gray-700">Name</label>
            <InputText fluid v-model="form.name" id="name" placeholder="Product name" />
        </div>
        <div class="mt-2">
            <label for="price" class="block  font-semibold  text-gray-700">Price</label>
            <InputNumber fluid v-model="form.price" showButtons :step="1000" id="price" mode="currency" currency="IDR"
                locale="id-ID" />
        </div>
        <div class="mt-2">
            <label for="amount" class="block  font-semibold  text-gray-700">Stock</label>
            <InputNumber fluid v-model="form.stock" id="amount" showButtons :min="1" suffix=" pcs" />
        </div>
        <div class="mt-2">
            <label for="sku" class="block  font-semibold  text-gray-700">SKU</label>
            <InputText fluid v-model="form.sku" id="sku" :placeholder="slugify(form.name) || 'Product SKU'" />
            <div v-if="sku_taken" class="text-red-500 text-sm">SKU already taken</div>
        </div>

        <div class="mt-5 flex">
            <Button label="Add Item" icon="pi pi-plus" :disabled="sku_taken || isLoading || v$.$invalid"
                :loading="isLoading" @click="confirmSubmit($event)" />
        </div>
    </div>
</template>
<script>
import { upconfirm } from '@/modules/core';

export default {
    name: 'additem',
    data() {
        return {
            form: {
                name: '',
                price: 1000,
                stock: 1,
                sku: '',
            },
            reset: {},
            sku_taken: false,
            v$: useVuelidate(),
            isLoading: false,
        }
    },
    computed: {
        slugify() {
            return (text) => {
                return text
                    .toString()
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]+/g, '')
                    .replace(/--+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '')
            }
        },
    },
    validations() {
        return {
            form: {
                name: { required },
                price: { required, numeric },
                stock: { required, numeric, minValue: minValue(1) },
            }
        }
    },
    methods: {
        confirmSwitchPage(page, event) {
            const redirectTo = () => {
                this.$router.push({ name: page });
            }

            if (this.form !== this.reset) {
                redirectTo();
                return;
            }
            upconfirm(this.$confirm, event, redirectTo);
        },
        async skuCheck(sku) {
            if (sku) {
                const response = await axios.get(`/skucheck/${sku}`)
                this.sku_taken = response.data.data
                this.isLoading = false;
                return
            }
            this.sku_taken = false;
            this.isLoading = false;
        },
        onReset() {
            this.form = { ...this.reset };
            this.v$.$touch();
        },
        confirmSubmit(event) {
            const confirm = async () => {
                const submitForm = { ...this.form };
                submitForm.sku = this.slugify(submitForm.sku) || this.slugify(submitForm.name);

                axios.post('/item', submitForm).then(() => {
                    uptoast(this.$toast).preset('success')
                    this.onReset();
                    this.v$.$touch();
                }).catch(() => {
                    uptoast(this.$toast).preset('error')
                }).finally(() => {
                    this.isLoading = false;
                })
            }

            upconfirm(this.$confirm, event, confirm);

        },
    },
    mounted() {
        this.reset = { ...this.form };
        this.v$.$touch();
    },
    watch: {
        'form.sku': {
            handler: function (val) {
                this.isLoading = true;
                this.skuCheck(this.slugify(val));
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.skuCheck(this.slugify(val));
                }, 500);
            },
            deep: true,
        },
        'form.name': {
            handler: function (val) {
                this.isLoading = true;
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.skuCheck(this.slugify(val));
                }, 500);
            },
            deep: true,
        },
    },
};
</script>
<style scoped>
.addCard {
    transition: box-shadow 0.5s ease-in-out;
}

.addCard:hover,
.addCard:focus-within {
    box-shadow: -2px 10px 30px 0 rgba(0, 0, 0, 0.1);
}
</style>
