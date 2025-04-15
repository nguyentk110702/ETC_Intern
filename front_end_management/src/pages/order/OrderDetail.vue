<template>
  <a-card title="Chi tiết đơn hàng" bordered v-if="orderDetail">
    <!-- Thông tin chung đơn hàng -->

    <a-row>
      <a-col span="12">
        <a-typography.Text strong>Mã đơn hàng:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ orderDetail.orderCode }}</a-typography.Text>
      </a-col>
      <a-col span="12">
        <a-typography.Text strong>Ngày tạo:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ formatDate(orderDetail.createdAt) }}</a-typography.Text>      </a-col>
    </a-row>

    <a-row>
      <a-col span="12">
        <a-typography.Text strong>Địa chỉ giao hàng:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ orderDetail.addressShipping }}</a-typography.Text>
      </a-col>
      <a-col span="12">
        <a-typography.Text strong>Khu vực:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ orderDetail.area }}</a-typography.Text>
      </a-col>
    </a-row>

    <a-row>
      <a-col span="12">
        <a-typography.Text strong>Khách hàng:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ orderDetail.customer }}</a-typography.Text>
      </a-col>
      <a-col span="12">
        <a-typography.Text strong>Trạng thái giao hàng:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ getShippingStatusLabel(orderDetail.shippingStatus) }}</a-typography.Text>
      </a-col>
    </a-row>

    <a-divider />

    <!-- Các khoản phí -->
    <a-row>
      <a-col span="12">
        <a-typography.Text strong>Giá trị sản phẩm:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ formatCurrency(orderDetail.price) }}</a-typography.Text>
      </a-col>
      <a-col span="12">
        <a-typography.Text strong>Giảm giá:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ formatCurrency(orderDetail.discount) }}</a-typography.Text>
      </a-col>
    </a-row>

    <a-row>
      <a-col span="12">
        <a-typography.Text strong>Phí giao hàng:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ formatCurrency(orderDetail.deliveryCost) }}</a-typography.Text>
      </a-col>
      <a-col span="12">
        <a-typography.Text strong>Thuế:</a-typography.Text>
        <a-typography.Text style="font-weight: bold">{{ formatCurrency(orderDetail.tax) }}</a-typography.Text>
      </a-col>
    </a-row>

    <a-row>
      <a-col span="12">
        <a-typography.Text strong>Tổng giá trị đơn hàng:</a-typography.Text>
        <a-typography.Text style="font-weight: bold" >{{ formatCurrency(orderDetail.totalPrice) }}</a-typography.Text>
      </a-col>
      <a-col span="12">
        <a-typography.Text strong>Trạng thái thanh toán:</a-typography.Text>
        <a-tag :color="orderDetail.payment === '0' ? 'yellow' : 'green'">
          {{ orderDetail.payment === '0' ? 'Chưa thanh toán' : 'Đã thanh toán' }}
        </a-tag>
      </a-col>
    </a-row>

    <a-divider />

    <!-- Chi tiết các mặt hàng -->
    <a-typography.Title level="4">Chi tiết các mặt hàng</a-typography.Title>
    <a-table :dataSource="orderDetail.orderItems" :columns="orderItemColumns" rowKey="variant.id" />
    <a-space style="margin-top: 20px">
      <a-button type="default" @click="goBack">Quay lại</a-button>
      <a-button type="primary" @click="updateOrder">Cập nhật trạng thái</a-button>
    </a-space>
  </a-card>
  <a-modal
      v-model:visible="isModalVisible"
      title="Cập nhật trạng thái đơn hàng"
      ok-text="Lưu"
      cancel-text="Hủy"
      @ok="handleUpdateStatus"
  >
    <a-form layout="vertical">
      <a-form-item label="Trạng thái giao hàng">
        <a-select v-model:value="updatedShippingStatus" placeholder="Chọn trạng thái giao hàng">
          <a-select-option value="0">Giao hàng sau</a-select-option>
          <a-select-option value="1">Đẩy qua hãng vận chuyển</a-select-option>
          <a-select-option value="2">Đã giao hàng</a-select-option>
<!--          0: { label: 'Đang giao hàng', color: 'green' },-->
<!--          1: { label: 'Đang lưu kho', color: 'blue' },-->
<!--          2: { label: 'Đã hủy', color: 'red' },-->
        </a-select>
      </a-form-item>

      <a-form-item label="Trạng thái thanh toán">
        <a-select v-model:value="updatedPaymentStatus" placeholder="Chọn trạng thái thanh toán">
          <a-select-option value="0">Chưa thanh toán</a-select-option>
          <a-select-option value="1">Đã thanh toán</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "../../../axios.js";
import router from "@/router/router.js";
import dayjs from "dayjs";
import {message} from "ant-design-vue";
const route = useRoute();
const orderDetail = ref(null);
const isModalVisible = ref(false);
const updatedShippingStatus = ref('');
const updatedPaymentStatus = ref('');

const updateOrder = () => {
  // Mở modal
  isModalVisible.value = true;

  // Gán giá trị hiện tại
  updatedShippingStatus.value = orderDetail.value.shippingStatus;
  updatedPaymentStatus.value = orderDetail.value.payment;
};

const handleUpdateStatus = async () => {
  try {
    const id = route.params.id;
    await axios.put(`/order/${id}`, {
      shippingStatus: updatedShippingStatus.value,
      payment: updatedPaymentStatus.value
    });

    message.success('Cập nhật trạng thái thành công');

    // Đóng modal
    isModalVisible.value = false;

    // Reload order
    const response = await axios.get(`/order/${id}`);
    orderDetail.value = response.data;
  } catch (error) {
    message.error('Cập nhật thất bại');
  }
};
const orderItemColumns = [
  { title: 'Mã biến thể', dataIndex: ['variant', 'id'], key: 'variantId' },
  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' }
];
const goBack = () => {
  router.push('/home/order');
};
const shippingStatusMap = {
  PENDING: 'Giao hàng sau',
  SHIPPED: 'Đẩy qua hãng vận chuyển',
  DELIVERED: 'Đã giao hàng'
};


const getShippingStatusLabel = (status) => {
  return shippingStatusMap[status] || status;
};
const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');
onMounted(async () => {
  const id = route.params.id;
  try {
    const response = await axios.get(`/order/${id}`);
    orderDetail.value = response.data;

  } catch (error) {

  }
});
</script>

<style scoped>
.ant-card {
  margin: 20px;
}
</style>
