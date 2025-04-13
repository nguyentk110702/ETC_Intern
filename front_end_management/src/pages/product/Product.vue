<template>
  <div>
    <header>
      <div style="display: flex; gap: 8px; justify-content: flex-end">
        <router-link to="addProduct">
        <a-button type="primary" > + Thêm sản phẩm</a-button>
          </router-link>
      </div>
    </header>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; margin-top: 16px">
    <a-input
      v-model:value="searchQuery"
      placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
      style="width: 450px;"
      @pressEnter="() => fetchProducts()"
    />
  </div>

  <div>
    <TableComponent
  :columns="columns"
  :data="products"
  :loading="loading"
  :enableSelection="true"
>
  <template #bodyCell="{ column, record }">
    <template v-if="column.dataIndex === 'actions'">
      <a-space>
         <router-link :to="`/home/product/${record.id}/variants`">
        <a-button type="primary">Xem phiên bản</a-button>
      </router-link>
        <a-popconfirm title="Xác nhận xóa sản phẩm này?" @confirm="handleDelete(record.id)">
          <a-button type="link" danger>Xóa</a-button>
        </a-popconfirm>
      </a-space>
    </template>
    <template v-else-if="column.dataIndex === 'image'">
      <img :src="record.image" alt="product" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;" />
    </template>
  </template>
</TableComponent>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../../../axios.js";
import TableComponent from "@/components/TableComponent.vue";
import dayjs from "dayjs";

// Cột bảng
const columns = [
  { title: 'Ảnh', dataIndex: 'image', key: 'image' },
  { title: 'Sản phẩm', dataIndex: 'name', key: 'name' },
  { title: 'Có thể bán', dataIndex: 'quantity', key: 'sold' },
  { title: 'Nhãn hiệu', dataIndex: 'branch', key: 'branch' },
  { title: 'Ngày khởi tạo', dataIndex: 'created_at', key: 'created_at' },
    {
    title: 'Hành động',
    key: 'actions',
    dataIndex: 'actions',
  },
];

// Biến state
const products = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const filterRole = ref(null);
const filterStatus = ref(null);
const createAt = ref(null);
const baseImageUrl = 'http://localhost:3000/uploads'; // ✅ Khai báo biến ở đây, trước fetchProducts

const roles = ref([
  { id: 1, name: 'Quản trị viên' },
  { id: 2, name: 'Nhân viên bán hàng' },
  // bạn có thể thêm role từ API nếu muốn
]);

// Hàm gọi API
const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await axios.get("/product", {
      params: {
        search: searchQuery.value,
        role: filterRole.value,
        status: filterStatus.value,
        created_at: createAt.value ? dayjs(createAt.value).format("YYYY-MM-DD") : null,
      },
    });

    if (response.data && Array.isArray(response.data.data)) {
      products.value = response.data.data.map((product) => ({
        id: product.id,
        name: product.name,
image: product.image ? `${baseImageUrl}/${product.image}` : '/no-image.png',
        quantity: product.quantity,
        branch: product.branch,
        created_at: product.created_at ? dayjs(product.created_at).format("DD/MM/YYYY") : "N/A",
      }));
    } else {
      console.error("Dữ liệu không hợp lệ:", response.data);
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
  } finally {
    loading.value = false;
  }
};
const handleDelete = async (id) => {
  try {
    await axios.delete(`/product/${id}`); // đảm bảo có token nếu backend cần xác thực
    fetchProducts();
  } catch (error) {
    console.error("❌ Lỗi xóa sản phẩm:", error.response?.data || error);
  }
};

const handleViewVersions = (product) => {
  console.log("📦 Xem phiên bản sản phẩm:", product);
  // Ví dụ: router.push(`/product/${product.id}/versions`);
};
// Lưu bộ lọc
const emitSearch = () => {
  fetchProducts();
};

// Khởi động
onMounted(() => {
  fetchProducts();
});

// Modal thêm sản phẩm (placeholder)
const showModel = () => {
  console.log("Hiển thị modal thêm sản phẩm");
};
</script>
