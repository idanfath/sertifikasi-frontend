<template>
    <div class="flex flex-col w-fit mb-3">
        <p class="text-xl font-semibold">Add Item</p>
        <InputText v-model="form.name" placeholder="Masukkan nama" />
        <InputNumber v-model="form.stock" :min="0" :useGrouping="false" placeholder="Masukkan stock" />
        <InputNumber v-model="form.price" :min="0" placeholder="Masukkan harga" />
        <InputText v-model="form.sku" :min="0" :useGrouping="false" placeholder="Masukkan sku" />
        <x-button useLoading :disabled="v$.form.$invalid" @clicked="addData">Add</x-button>
    </div>

    <Toolbar>
        <template #start>
            <Button :label="table._select ? 'Hapus' : 'Pilih Item'"
                :disabled="table.selection.length == 0 && table._select"
                :icon="table._select ? 'pi pi-trash' : 'pi pi-check-square'" severity="danger"
                :outlined="!table._select" @click="($event) => {
                    if (this.table.selection.length > 0) {
                        const ids = this.table.selection.map((item) => item.id);
                        this.onDeleteItem(ids, $event);
                    } else {
                        this.table._select = !this.table._select;
                    }
                }" />
            <Button v-if="table._select" label="Batal" icon="pi pi-times" class="ml-2"
                @click="() => { table._select = !table._select; this.table.selection = [] }" />
        </template>
        <template #end>
            <InputText v-model="table.search" placeholder="Keyword Search" />
        </template>
    </Toolbar>
    <DataTable :value="table.fetchdata.items.data" :rows="10" v-model:selection="table.selection"
        :loading="table._fetchloading">
        <Column v-if="table._select" selectionMode="multiple" headerStyle="width: 3rem" />
        <Column v-for="col of table.columns" :key="col.field" :field="col.field" :header="col.header" />
        <Column header="Action" class="flex gap-2">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class=" p-button-outlined" severity="warn"
                    @click="toggleEditMode(slotProps.data)" />
                <Button icon="pi pi-trash" class=" p-button-outlined" severity="danger"
                    @click="onDeleteItem(slotProps.data.id, $event)" />
            </template>
        </Column>
        <template #footer>
            <Paginator @page="(page) => { onLoad(page.page + 1) }" :rows="10"
                :totalRecords="table.fetchdata.items.total" />
        </template>
        <template #empty>
            <div class="center">Empty</div>
        </template>
    </DataTable>

    <comp-modal :isOpen="table.edit._editmode" title="Edit Data" @close="toggleEditMode" @confirm="commitEdit">
        <InputText v-model="table.edit.edit.name" placeholder="Masukkan nama" />
        <InputNumber v-model="table.edit.edit.stock" :min="0" :useGrouping="false" placeholder="Masukkan stock" />
        <InputNumber v-model="table.edit.edit.price" :min="0" placeholder="Masukkan harga" />
        <InputText v-model="table.edit.edit.sku" :min="0" :useGrouping="false" placeholder="Masukkan sku" />
    </comp-modal>
</template>
<script>
import { minLength, minValue } from '@vuelidate/validators';
import InputText from 'primevue/inputtext';

export default {
    name: 'Item',
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
                name: '',
                stock: 1,
                sku: '',
                price: 1000,
            },
            v$: useVuelidate()
        }
    },
    validations() {
        return {
            form: {
                name: { required, minLength: minLength(3) },
                stock: { required, minValue: minValue(1) },
                sku: { required, minLength: minLength(3) },
                price: { required, minValue: minValue(1000) },
            }
        }
    },
    methods: {
        async onLoad(page = 1, search = this.table.search) {
            this.table._fetchloading = true
            const response = await axios.get(`/item?page=${page}&search=${search}`)
            this.table.fetchdata.items = response.data.data
            this.table._fetchloading = false
        },
        async onDeleteItem(ids, event) {
            ids = Array.isArray(ids) ? ids : [ids];
            const accept = async () => {
                event.target.disabled = true;
                await axios.delete('deleteItems', { data: { id: ids } })
                uptoast(this.$toast).preset('success')
                this.onLoad();
                event.target.disabled = false;
                this.table.selection = [];
                this.table._select = false;
            }
            const reject = () => {
                uptoast(this.$toast, 'info', 'Batal menghapus data');
            }
            upconfirm(this.$confirm, event, accept, reject);
        },
        toggleEditMode(data) {
            if (this.table.edit._editmode) {
                this.table.edit._editmode = false
                this.table.edit.edit = {}
                return
            }
            this.table.edit._editmode = true
            this.table.edit.edit = { ...data }
        },
        commitEdit() {
            axios.put(`item/${this.table.edit.edit.id}`, this.table.edit.edit).then(() => {
                this.onLoad()
                this.table.edit.edit = {}
            })
        },
        addData(ResolveLoading) {
            axios.post('item', this.form).then((res) => {
                console.log(res)
                this.onLoad()
                this.form = {}
            }).finally(() => {
                ResolveLoading()
            })
        }

    },
    mounted() {
        this.v$.$touch()
        this.onLoad()
    },
    watch: {
        'table.search': {
            handler: function (val) {
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.onLoad(1, val)
                }, 500);
            },
            deep: true,
        },
    },
};
</script>
<style scoped></style>
