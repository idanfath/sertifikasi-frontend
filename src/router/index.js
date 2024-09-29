/**
 * @file router/index.js
 * @description This file contains the router configuration.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import appdata from '@/configs/appdata'
import mainShell from '@/shell/mainShell.vue'
/**
 * Create a new router instance.
 */
export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            meta: { shell: true },
            component: mainShell,
            children: [
                {
                    path: '',
                    name: 'home',
                    // dont lazy-load frequently visited or important routes, as it may cause a delay when navigating
                    component: HomeView
                },
                {
                    path: 'about',
                    name: 'about',
                    // route level code-splitting
                    // this generates a separate chunk (About.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import('../views/AboutView.vue'),
                }
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
    document.title = `${to.name} - ${appdata.title}`
    console.log('From router/index.js | Navigating to:', to.name)
    next()
})

export default router
