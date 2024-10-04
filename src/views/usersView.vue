<template>
    <comp-crud-table ref="crudtable" :columns="table.columns" modelPrefix="admin" model="user">
        <template #toolbar-start>
            <Button label="Add New" class="mr-2" icon="pi pi-user-plus" size="small"
                @click="$router.push({ name: 'register' })" />
        </template>
        <template #additional-actions="{ slotProps }">
            <Button icon="pi pi-pencil" class=" p-button-outlined" severity="warn"
                @click="toggleEdit(slotProps.data)" />
        </template>
    </comp-crud-table>
    <comp-modal :isOpen="table.edit._editmode" title="Edit Data" @close="toggleEdit" @confirm="commitEdit">
        <slot name="edit-modal" :data="table.edit.edit">
            <div class="flex flex-col gap-2">
                <div class="font-semibold">Username</div>
                <InputText v-model="table.edit.edit.username" placeholder="Username" />
                <Fieldset legend="Password" :toggleable="true" collapsed>
                    <p class="my-2">Leave blank if you don't want to change the password</p>
                    <div class="space-y-2">
                        <label for="password" class=" font-semibold ">New Password</label>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-key" />
                            </InputGroupAddon>
                            <Password v-model="table.edit.edit.password" placeholder="New Password" toggleMask />
                        </InputGroup>
                    </div>
                    <div class="space-y-2 mt-2">
                        <label for="password" class=" font-semibold ">Confirm Password</label>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-key" />
                            </InputGroupAddon>
                            <Password v-model="table.edit.edit.password_confirmation" placeholder="Confirm New Password"
                                toggleMask />
                        </InputGroup>
                    </div>
                </Fieldset>
            </div>
        </slot>
    </comp-modal>
</template>
<script>
export default {
    name: 'register',
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
                    { field: 'id', header: 'ID' },
                    { field: 'username', header: 'Username' },
                    { field: 'role', header: 'Role' },
                    { field: 'created_at', header: 'Created', date: true },
                    { field: 'updated_at', header: 'Updated', date: true },
                ]
            },
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
            table: {
                edit: {
                    edit: {
                        username: { required, minLength: minLength(3) },
                        password: { minLength: minLength(8) },
                        password_confirmation: { sameAs: sameAs(this.form.password) }
                    }
                }
            }
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
        toggleEdit(data) {
            if (data) {
                this.table.edit.edit = { ...data, password: '', password_confirmation: '' }
                this.table.edit._editmode = true
                return
            }
            this.table.edit.edit = {}
            this.table.edit._editmode = false
        },
        commitEdit() {
            const submitForm = { ...this.table.edit.edit };
            if (!submitForm.password) {
                delete submitForm.password
                delete submitForm.password_confirmation
            }
            axios.put(`/admin/user/${submitForm.id}`, submitForm).then(() => {
                uptoast(this.$toast).preset('success')
                this.toggleEdit()
                this.$refs.crudtable.onLoad()
            }).catch(() => {
                uptoast(this.$toast).preset('error')
            })
        }
    },
};
</script>
<style scoped></style>
