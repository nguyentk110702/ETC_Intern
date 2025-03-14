import {createRouter, createWebHistory} from "vue-router";
import Login from "/src/pages/auth/login.vue";
import Register from "/src/pages/auth/register.vue";

const routes = [
    {path: "/", component: Register},
    {path: "/login", component: Login},
    {path: "/register", component: Register},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
