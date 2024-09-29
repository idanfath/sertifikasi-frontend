
/**
 * @file core.js
 * @description This file contains core functions of helpers
 */

export const mstr = (str) => {
    return {
        capitalize: (eachword = false) => {
            if (eachword) {
                return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            } else {
                return str.charAt(0).toUpperCase() + str.slice(1)
            }
        },
    }
}

export const uptoast = (toast, severity, detail, summary = severity, life = 3000) => {
    if (!toast) return
    if (summary) summary = mstr(summary).capitalize(true)
    if (severity) {
        toast.add({ severity, summary, detail, life })
    } else {
        return {
            preset: (options) => {
                switch (options) {
                    case 'error':
                        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Terjadi kesalahan', life })
                        break;
                    case 'cancel':
                        toast.add({ severity: 'warn', summary: 'Dibatalkan', detail: 'Aksi dibatalkan', life })
                        break;
                    case 'success':
                    default:
                        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Aksi sukses dijalankan', life })
                        break;
                }
            }
        }
    }
}

export const upconfirm = (confirm, event, acceptCallBack = (() => { }), rejectCallBack = (() => { }), header, message,) => {
    confirm.require({
        target: event.currentTarget,
        icon: 'pi pi-exclamation-triangle',
        acceptProps: { label: 'Ya', severity: 'success' },
        rejectProps: { label: 'Tidak', severity: 'danger' },
        group: window.innerWidth < 1024 ? 'dialog' : 'popup',
        header: header || 'Konfirmasi',
        message: message || 'Apakah anda yakin?',
        accept: acceptCallBack,
        reject: rejectCallBack,
    })
}

export const coreTesting = (text) => {
    console.log(text)
}
