<template>
  <header>
    <div style="display: flex; gap: 8px; justify-content: flex-end">

      <a-button type="primary" @click="goToAddVariant"> + Thêm Phiên Bản</a-button>
    </div>
  </header>
  <div>
     <div style="margin-bottom: 16px">
      <a-button type="default" @click="Back">← Quay lại danh sách sản phẩm</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="variants"
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'image'">
          <img
            v-if="record.image"
            :src="`${baseImageUrl}/${record.image}`"
            alt="Ảnh phiên bản"
            style="width: 80px"
          />
          <span v-else>Không có ảnh</span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" danger @click="deleteVariant(record.id)">
            Xóa
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from 'ant-design-vue';

import axios from "../../../axios.js";
import router from "@/router/router.js";
const variants = ref([]);
const loading = ref(false);
const route = useRoute();
const productId = route.params.id; // từ URL: /productvariant/:id
const baseImageUrl = 'http://localhost:3000/uploads'; // hoặc nơi lưu ảnh backend

const columns = [
  { title: 'SKU', dataIndex: 'skuCode', key: 'skuCode' },
  { title: 'Barcode', dataIndex: 'barCode', key: 'barCode' },
  { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
  { title: 'Giá bán', dataIndex: 'sellPrice', key: 'sellPrice' },
  { title: 'Giá so sánh', dataIndex: 'comparePrice', key: 'comparePrice' },
  { title: 'Giá vốn', dataIndex: 'cost', key: 'cost' },
  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Ảnh', dataIndex: 'image', key: 'image' },
  {
    title: 'Hành động',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
];

const fetchVariants = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/product-variant/${productId}`);
    variants.value = response.data;
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách phiên bản:', error);
  } finally {
    loading.value = false;
  }
};
const deleteVariant = (id) => {
  Modal.confirm({
    title: 'Bạn có chắc muốn xóa phiên bản này không?',
    content: 'Hành động này không thể hoàn tác.',
    okText: 'Xóa',
    okType: 'danger',
    cancelText: 'Hủy',
    onOk: async () => {
      try {
        await axios.delete(`/product-variant/${id}`);
        variants.value = variants.value.filter(v => v.id !== id);
      } catch (err) {
        console.error('❌ Lỗi xoá phiên bản:', err);
        alert('Xóa phiên bản thất bại!');
      }
    }
  });
};

const goToAddVariant = () => {
  router.push(`/home/productvariant/create/${productId}`);
};
const Back = () => {
  router.push('/home/product')
}
onMounted(() => {
  fetchVariants();
});
</script>
