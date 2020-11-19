import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router