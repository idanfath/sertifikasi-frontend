/**
 * @file router/index.js
 * @description This file contains the router configuration.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import appdata from '@/configs/appdata'
import mainShell from '@/shell/mainShell.vue'
import ItemView from '@/views/ItemView.vue'
import { useAuthStore } from '@/stores/auth'
import TransactionView from '@/views/TransactionView.vue'
/**
 * Create a new router instance.
 */
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [


        {
            path: '/',
            meta: { shell: true, auth: true },
            component: mainShell,
            children: [
                {
                    path: '',
                    name: 'home',
                    // dont lazy-load frequently visited or important routes, as it may cause a delay when navigating
                    component: HomeView
                },
                {
                    path: "item",
                    name: "item",
                    component: ItemView
                },
                {
                    path: "transaction",
                    name: "transaction",
                    component: TransactionView
                },
            ]
        },
        {
            path: "/login",
            name: "login",
            component: () => import('../views/loginView.vue')
        },
        {
            path: "/:pathMatch(.*)*",
            name: "notfound",
            component: () => import('../views/notfoundView.vue')
        }
    ]
})

/**
 * This function is called before every route change.
 */


router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    document.title = `${to.name} - ${appdata.title}`
    console.log('From router/index.js | Navigating to:', to.name)
    if (to.meta.auth && !authStore.isAuth) {
        next({ name: 'login' })
        return
    }
    next()
})

export default router
