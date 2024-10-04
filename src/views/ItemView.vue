<template>
    <comp-crud-table model="item" :columns="columns" :hideEdit="false">
        <template #toolbar-start>
            <Button label="Add New" class="mr-2" icon="pi pi-plus-circle" size="small"
                @click="$router.push({ name: 'add products' })" />
        </template>
        <template #edit-modal="{ data }">
            <div class="flex flex-col gap-2">
                <div class="space-y-2">
                    <label for="name" class="text-xl font-semibold">Name</label>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-tag" />
                        </InputGroupAddon>
                        <InputText id="name" v-model="data.name" />
                    </InputGroup>
                </div>
                <div class="space-y-2">
                    <label for="stock" class="text-xl font-semibold">Stock</label>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-shopping-cart" />
                        </InputGroupAddon>
                        <InputNumber id="stock" v-model="data.stock" suffix=" pcs" showButtons
                            buttonLayout="horizontal" />
                    </InputGroup>
                </div>
                <div class="space-y-2">
                    <label for="sku" class="text-xl font-semibold">SKU</label>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-barcode" />
                        </InputGroupAddon>
                        <InputText id="sku" v-model="data.sku" />
                    </InputGroup>
                </div>
                <div class="space-y-2">
                    <label for="price" class="text-xl font-semibold">Price</label>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-money-bill" />
                        </InputGroupAddon>
                        <InputNumber id="price" v-model="data.price" :min="1000" :step="1000" mode="currency"
                            currency="IDR" locale="id-ID" showButtons buttonLayout="horizontal" />
                    </InputGroup>
                </div>
            </div>
        </template>
    </comp-crud-table>


</template>

<script>
export default {
    data() {
        return {
            columns: [
                { field: 'name', header: 'Nama' },
                { field: 'stock', header: 'Stock' },
                { field: 'sku', header: 'SKU' },
                { field: 'price', header: 'Harga', currency: true },
            ],
        }
    },
}
</script>
