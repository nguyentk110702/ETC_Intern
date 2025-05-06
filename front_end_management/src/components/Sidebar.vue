<template>
  <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      breakpoint="md"
      @collapse="onCollapse"
  >
    <div class="logo">
      <img src="../assets/img.png" alt="Logo" class="logo-img" />
    </div>
    <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
      <a-menu-item key="employees">
        <template #icon><UserOutlined /></template>
        <router-link to="/home/employee">Nhân viên</router-link>
      </a-menu-item>
      <a-menu-item key="products">
        <template #icon><ShoppingOutlined /></template>
        <router-link to="/home/product">Sản phẩm</router-link>
      </a-menu-item>

      <a-menu-item key="orders">
        <template #icon><ShoppingCartOutlined /></template>
        <router-link to="/home/order">Đơn hàng</router-link>
      </a-menu-item>
      <a-menu-item key="active">
        <template #icon><UserOutlined /></template>
        <router-link to="/home/active">Tài Khoản Đang Đăng Nhập</router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { HomeOutlined, UserOutlined, ShoppingOutlined, ShoppingCartOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";

export default {
  components: {
    HomeOutlined,
    UserOutlined,
    ShoppingOutlined,
    ShoppingCartOutlined,
  },
  setup() {
    const collapsed = ref(false);

    const onCollapse = (collapsedValue) => {
      collapsed.value = collapsedValue;
    };

    return {
      collapsed,
      onCollapse,
    };
  },
};
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.logo-img {
  width: 80px;
  height: auto;
}

.logo-text {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
}

/* Ẩn chữ khi sidebar bị thu nhỏ */
a-layout-sider.collapsed .logo-text {
  display: none;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .logo {
    justify-content: flex-start;
    padding-left: 10px;
  }
}
</style>
