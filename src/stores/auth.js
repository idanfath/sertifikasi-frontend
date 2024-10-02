/**
 * @file testing.js
 * @description This file contains the testing store.
 */
import axios from 'axios';
import { defineStore } from 'pinia'

function setAxiosAuth(token) {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('TOKEN', token)
        return
    }
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem('TOKEN')
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        TOKEN: null,
        USER: null,
    }),
    getters: {
        isAdmin() {
            return this.USER.role || undefined
        },
        isAuth() {
            return this.TOKEN ? true : false
        }
    },
    actions: {
        resetAll() {
            this.TOKEN = null
            this.USER = null
            setAxiosAuth()
        },
        async login(credentials) {
            const response = await axios.post('auth/login', credentials)
            await this.attempt(response.data.token)
            return response
        },
        async attempt(token) {
            if (token) this.TOKEN = token
            if (!this.TOKEN) {
                this.resetAll()
                return
            }
            setAxiosAuth(token)
            try {
                const response = await axios.get('auth/info')
                this.USER = response.data.user
            } catch (error) {
                this.resetAll()
            }
        }
    }
})
