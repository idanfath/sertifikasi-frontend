<template>
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
</template>
<script>
export default {
    name: 'Item',
    data() {
        return {
            table: {
                fetchdata: {
                    items: []
                },
                edit: {
                    _editmode: true,
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
                ]
            },
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
    },
    mounted() {
        this.onLoad()
    },
};
</script>
<style scoped></style>
