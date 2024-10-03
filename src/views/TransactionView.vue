<template>
    <div class="flex flex-col w-fit mb-3">
        <p class="text-xl font-semibold">Add Item</p>
        <InputText v-model="form.invoice" disabled />
        <InputNumber v-model="form.total" :useGrouping="false" disabled />
    </div>
</template>
<script>
import cryptoJs from 'crypto-js';

export default {
    name: 'Transaction',
    data() {
        return {
            table: {
                fetchdata: {
                    items: []
                },
                edit: {
                    _editmode: false,
                    edit: {},
                },
                search: '',
                selection: [],
                _fetchloading: false,
                _select: false,
                columns: [
                    { field: 'name', header: 'Nama' },
                    { field: 'stock', header: 'Stock' },
                    { field: 'sku', header: 'SKU' },
                    { field: 'price', header: 'Harga' },
                ],
            },
            form: {
                invoice: cryptoJs.MD5(new Date().toISOString()).toString(),
                total: 0,
                items: [],
            },
            v$: useVuelidate()
        }
    },
};
</script>
<style scoped></style>
