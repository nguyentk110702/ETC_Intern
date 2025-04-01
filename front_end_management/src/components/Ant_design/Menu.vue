<script setup>
import { h, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Menu } from 'ant-design-vue'
import {HomeOutlined,AppstoreOutlined,UnorderedListOutlined,ApartmentOutlined,ShopOutlined,ShoppingCartOutlined,PlusSquareOutlined,UserOutlined,RiseOutlined} from "@ant-design/icons-vue";

const route = useRoute()
const selectedKeys = ref([route.name])
const openKeys = ref([])


const menuMap = {
  products: 'sub',
  productVariant: 'sub',
  createOrder: 'sub1',
  viewOrder: 'sub1',
}

watch(
    () => route.name,
    (newName) => {
      selectedKeys.value = [newName]


      if (menuMap[newName]) {
        openKeys.value = [menuMap[newName]]
      }
    },
    { immediate: true }
)
</script>

<template>
  <Menu mode="inline" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
    <Menu.Item key="home" :icon="h(HomeOutlined)">
      <router-link :to="{ name: 'home' }">Trang chủ</router-link>
    </Menu.Item>
    <Menu.SubMenu key="sub" title="Sản phẩm" :icon="h(AppstoreOutlined)">
      <Menu.Item key="products" :icon="h(UnorderedListOutlined)">
        <router-link :to="{ name: 'products' }">Danh sách</router-link>
      </Menu.Item>
      <Menu.Item key="productVariant" :icon="h(ApartmentOutlined)">
        <router-link :to="{ name: 'productVariant' }">Biến thể</router-link>
      </Menu.Item>
    </Menu.SubMenu>

    <Menu.SubMenu key="sub1" title="Đơn hàng" :icon="h(ShopOutlined)">
      <Menu.Item key="viewOrder" :icon="h(ShoppingCartOutlined)">
        <router-link :to="{ name: 'viewOrder' }">Danh sách</router-link>
      </Menu.Item>
      <Menu.Item key="createOrder" :icon="h(PlusSquareOutlined)">
        <router-link :to="{ name: 'createOrder' }">Tạo đơn hàng</router-link>
      </Menu.Item>

    </Menu.SubMenu>

    <Menu.Item key="employee" :icon="h(UserOutlined)">
      <router-link :to="{ name: 'employee' }">Nhân viên</router-link>
    </Menu.Item>
    <Menu.Item key="role" :icon="h(RiseOutlined)">
      <router-link :to="{ name: 'role' }">Vai trò</router-link>
    </Menu.Item>

  </Menu>
</template>
