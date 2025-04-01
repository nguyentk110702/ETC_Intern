import {createRouter, createWebHistory} from "vue-router";
import Login from "/src/pages/auth/login.vue";
import Register from "/src/pages/auth/register.vue";
import Dashboard from "@/components/Dashboard.vue";
import Employee from "@/pages/employee/Employee.vue";
import Product from "@/pages/product/Product.vue";
import Productvariant from "@/pages/product_variant/Productvariant.vue";
import Order from "@/pages/order/Order.vue";
import Home from "@/pages/Home.vue";

const routes = [
    {
        path: "/home",
        component: Dashboard, // Dùng layout chung cho dashboard
        children: [
            { path: "employee", component: Employee },
            { path: "employee", component: Employee },
            { path: "product", component: Product },
            { path: "productvariant", component: Productvariant },
            { path: "order", component: Order },
            { path: "home", component: Home },

        ],
    },
    {
        path: "/login",
        component: Login, // Không bọc trong layout
    },
    {
        path: "/",
        component: Register, // Không bọc trong layout
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
