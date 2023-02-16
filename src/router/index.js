//import vue router
import { createRouter, createWebHistory } from 'vue-router'
import axios from "@/httpAxios.js"

//define a routes
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import( /* webpackChunkName: "login" */ '@/views/landing/Index.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( /* webpackChunkName: "login" */ '@/views/auth/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import( /* webpackChunkName: "register" */ '@/views/auth/Register.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import( /* webpackChunkName: "dashboard" */ '@/views/dashboard/Index.vue'),
        meta: {
            authRequired: true,
            isAdmin: true
        },
    },
    {
        path: '/products',
        name: 'products',
        component: () => import( /* webpackChunkName: "dashboard" */ '@/views/dashboard/Products.vue'),
        meta: {
            authRequired: true,
            isAdmin: true
        },
    },
    {
        path: '/users',
        name: 'users',
        component: () => import( /* webpackChunkName: "dashboard" */ '@/views/dashboard/Users.vue'),
        meta: {
            authRequired: true,
            isAdmin: true
        },
    },
    {
        path: '/history',
        name: 'history',
        component: () => import( /* webpackChunkName: "dashboard" */ '@/views/history/Index.vue'),
        meta: {
            authRequired: true,
            isAdmin: false
        },
    },
]

//create router
const router = createRouter({
    history: createWebHistory(),
    routes  // config routes
})

router.beforeEach((routeTo, routeFrom, next) => {
    const authRequired = routeTo.matched.some((route) => route.meta.authRequired)
    if (!authRequired) return next()

    const isAdmin = routeTo.matched.some((route) => route.meta.isAdmin)

    let token = localStorage.getItem("token")
    if (token) {
        axios
            .get("/profile")
            .then((response) => {
                if (response.data.success) {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.data));
                    localStorage.setItem("role", response.data.role);

                    if (isAdmin == true) {
                        let role = localStorage.getItem("role")
                        if (role == "admin") {
                            return next()
                        } else {
                            return next({ name: 'home' })
                        }
                    } else {
                        return next()
                    }
                }
            })
            .catch((error) => {
                console.log(error)
                return next({ name: 'login' })
            });
    } else {
        return next({ name: 'login' })
    }
})

export default router