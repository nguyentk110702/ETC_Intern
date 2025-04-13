import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import router from "./router/router.js";
import List from "ant-design-vue";

const app = createApp(App);
app.use(List);
app.use(router);
app.use(Antd);
window.$message = app.config.globalProperties.$message;
app.mount('#app');
