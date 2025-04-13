<template>
  <header>
    <div style="display: flex; gap: 8px; justify-content: flex-end">
      <a-button type="primary" @click="goToCreateOrder">Thêm Đơn Hàng</a-button>
    </div>
  </header>

  <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0">
    <a-input
        v-model:value="searchOrder"
        placeholder="Tìm kiếm theo mã đơn, tên khách, SĐT"
        style="width: 450px"
        @pressEnter="fetchOrders"
    />
    <div style="display: flex; gap: 8px; align-items: center;">
      <a-select v-model:value="filterStatus" placeholder="Trạng thái đơn" style="width: 200px;">
        <a-select-option value="pending">Chờ xác nhận</a-select-option>
        <a-select-option value="processing">Đang xử lý</a-select-option>
        <a-select-option value="completed">Hoàn thành</a-select-option>
        <a-select-option value="cancelled">Đã hủy</a-select-option>
      </a-select>
      <a-button type="primary" @click="fetchOrders">Lọc</a-button>
    </div>
  </div>

  <TableComponent
      :columns="columns"
      :data="orders"
      :loading="loading"
      :enableSelection="false"
      :enablePaymentTag="true"
      :enableOrderStatusTag="true"
  />
  <a-modal
      v-model:open="isModalVisible"
      title="Cập nhật đơn hàng"
      @ok="handleUpdate"
      okText="Lưu"
      cancelText="Hủy"
  >
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <a-select v-model:value="updateForm.payment" placeholder="Trạng thái thanh toán">
        <a-select-option :value="0">Chưa thanh toán</a-select-option>
        <a-select-option :value="1">Đã thanh toán</a-select-option>
      </a-select>

      <a-select v-model:value="updateForm.orderStatus" placeholder="Trạng thái đơn hàng">
        <a-select-option :value="0">Đang giao hàng</a-select-option>
        <a-select-option :value="1">Đang lưu kho</a-select-option>
        <a-select-option :value="2">Đã hủy</a-select-option>
      </a-select>
    </div>
  </a-modal>
</template>

<script setup>
import {ref, onMounted, h, reactive} from "vue";
import axios from "../../../axios.js";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {message, Tag} from "ant-design-vue";



const router = useRouter();
const orders = ref([]);
const loading = ref(false);
const searchOrder = ref("");
const filterStatus = ref(null);

const columns = [
  { title: "Mã đơn hàng", dataIndex: "orderCode", key: "orderCode" },
  { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
  { title: "Khách hàng", dataIndex: "customer", key: "customer" },
  { title: "Thành tiền", dataIndex: "totalPrice", key: "totalPrice" },
  {
    title: 'Trạng thái thanh toán',
    dataIndex: 'payment',
    key: 'payment',
    width: 180,
    customRender: ({ record }) => {
      const paymentKey = Number(record.payment);
      const status = paymentStatusMapping[paymentKey] || {
        label: 'Không xác định',
        color: 'default',
      };
      return h(Tag, { color: status.color }, () => status.label);
    },
  },
  {
    title: 'Trạng thái đơn hàng',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
    width: 180,
    customRender: ({ text }) => {
      const status = orderStatusMapping[Number(text)] || { label: 'Không xác định', color: 'default' };
      return h(Tag, { color: status.color }, () => status.label);
    },
  },


  { title: "Khu vực", dataIndex: "area", key: "area" },
  { title: "Địa chỉ giao hàng", dataIndex: "addressShipping", key: "addressShipping" },
 
];


const orderStatusMapping = {
  0: { label: 'Đang giao hàng', color: 'green' },
  1: { label: 'Đang lưu kho', color: 'blue' },
  2: { label: 'Đã hủy', color: 'red' },
};
const paymentStatusMapping = reactive({
  0: { label: 'Chưa thanh toán', color: 'yellow' },
  1: { label: 'Đã thanh toán', color: 'green' },
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/order');
    console.log('Danh sách đơn hàng từ API:', response.data);
    orders.value = response.data.map(order => ({

      ...order,
      createdAt: dayjs(order.createdAt).format('DD/MM/YYYY'),
    }));
  } catch (error) {
    console.error('Không thể tải danh sách đơn hàng', error);
    message.error('Lỗi khi tải danh sách đơn hàng!');
  } finally {
    loading.value = false;
  }
};
const isModalVisible = ref(false);
const selectedOrder = ref(null);
const updateForm = {
  payment: 1,  // Kiểu number
  orderStatus: 0,  // Kiểu number
};

const openUpdateModal = (record) => {
  selectedOrder.value = record;
  updateForm.payment = Number(record.payment);  // Sửa lại kiểu thành number
  updateForm.orderStatus = Number(record.orderStatus);
  isModalVisible.value = true;
};

const handleUpdate = async () => {
  try {
    await axios.put(`/order/${selectedOrder.value.id}`, {
      payment: updateForm.payment,
      orderStatus: updateForm.orderStatus,
    });
    console.log({
      payment: updateForm.payment,
      orderStatus: updateForm.orderStatus
    });
    message.success('Cập nhật đơn hàng thành công');
    isModalVisible.value = false;
    fetchOrders(); // làm mới danh sách
  } catch (err) {
    message.error('Lỗi khi cập nhật đơn hàng');
  }
};
const goToCreateOrder = () => {
  router.push('/home/createorder');
};
onMounted(() => {
  fetchOrders();
});
</script>
<style scoped>
.table-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
</style>