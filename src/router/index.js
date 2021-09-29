import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'chat/:uid',
                name: 'Chat',
                props: true,
                component: () => import('../components/Chat.vue')
            },
            {
                path: 'profile/:uid',
                name: 'Profile',
                props: true,
                component: () => import('../components/Profile.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('user')

    if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
        next('/login')
    }
    else {
        next()
    }
})

export default router