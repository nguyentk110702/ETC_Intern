<script setup>
import { Layout } from 'ant-design-vue';
</script>
<template>
  <Layout style="min-height: 100vh">
    <!-- Sidebar (Thanh điều hướng bên trái) -->
    <Sider theme="light" collapsible>
      <div class="logo">v-app</div>
      <Menu />
    </Sider>

    <!-- Layout chính -->
    <Layout>
      <!-- Header (Thanh trên cùng) -->
      <Header style="background: #fff; padding: 0 16px; font-weight: bold; display: flex; justify-content: space-between; align-items: center">
        <span style="margin-right: 8px; cursor: pointer;">
          <LeftOutlined /> Quay lại
        </span>
        <slot name="customHeader"></slot>

        <!-- Mặc định nếu không có customHeader -->
        <template>
          <div>
            <router-link :to="{ name: 'login' }">
              <Button>Đăng nhập</Button>
            </router-link>
            <router-link :to="{ name: 'register' }">
              <Button type="primary" style="margin-left: 8px">Đăng ký</Button>
            </router-link>
          </div>
        </template>
      </Header>

      <!-- Thanh điều hướng phụ -->
      <slot style="margin: 24px;" name="nav"></slot>

      <Layout>
        <!-- Nội dung chính -->
        <Content style="margin: 16px">
          <div style="padding: 24px; background: #fff; min-height: 460px">
            <slot name="content"></slot>
          </div>
        </Content>

        <!-- Sidebar phụ (nếu có) -->
        <Sider theme="light" width="40%" style="padding: 24px;background: #fff; margin: 16px 16px 16px 0">
          <slot name="aside"></slot>
        </Sider>
      </Layout>
    </Layout>
  </Layout>
</template>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
}
</style>
