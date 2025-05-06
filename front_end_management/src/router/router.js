import {createRouter, createWebHistory} from "vue-router";
import Login from "/src/pages/auth/login.vue";
import Register from "/src/pages/auth/register.vue";
import Dashboard from "@/components/Dashboard.vue";
import Employee from "@/pages/employee/Employee.vue";
import Product from "@/pages/product/Product.vue";
import Productvariant from "@/pages/product_variant/Productvariant.vue";
import Order from "@/pages/order/Order.vue";
import Home from "@/pages/Home.vue";
import EmployeeDetail from "@/pages/employee/EmployeeDetail.vue";
import AddProduct from "@/pages/product/AddProduct.vue";
import AddProductVariant from "@/pages/product_variant/AddProductVariant.vue";
import CreateOrder from "@/pages/order/CreateOrder.vue";
import OrderDetail from "@/pages/order/OrderDetail.vue";
import ActiveUser from "@/pages/Active-User.vue";

const routes = [
    {
        path: "/home",
        component: Dashboard, // Dùng layout chung cho dashboard
        children: [
            { path: "employee", component: Employee },
            { path: "employee/:id", component: EmployeeDetail },
            { path: "product", component: Product },
            { path: "product/:id/variants", component: Productvariant },
            { path: "order", component: Order },
            { path: "addProduct", component: AddProduct },
            { path: "productvariant/create/:productId", component: AddProductVariant },
            { path: "createorder", component: CreateOrder },
            { path: "home", component: Home },
            { path: "orderDetail/:id", component: OrderDetail },
            { path: "active", component: ActiveUser },



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
