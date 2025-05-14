<template>
  <header>
    <div style="display: flex; gap: 8px; justify-content: flex-end">
      <a-button type="primary" @click="goToCreateOrder">Thêm Đơn Hàng</a-button>
    </div>
  </header>

  <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0">
    <a-input
        v-model:value="searchOrder"
        placeholder="Tìm kiếm theo mã đơn, tên khách"
        style="width: 450px"
        @pressEnter="fetchOrders"
    />

  </div>

  <TableComponent
      :columns="columns"
      :data="orders"
      :loading="loading"
      :enableSelection="false"
      :enablePaymentTag="true"
      :enableOrderStatusTag="true"
  />

</template>

<script setup>
import {ref, onMounted, h, reactive} from "vue";
import axios from "../../../axios.js";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import TableComponent from "@/components/TableComponent.vue";
import {message, Tag} from "ant-design-vue";
import {EyeOutlined} from "@ant-design/icons-vue";



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
  {
    title: "Hành động",
    dataIndex: "actions",
    key: "actions",
    customRender: ({ record }) => {
      return h(
          EyeOutlined,
          {
            type: "link",
            onClick: () => router.push(`orderDetail/${record.id}`)
          },
          "Xem chi tiết"
      );
    },
  }

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
    const response = await axios.get('/order', {
      params: { search: searchOrder.value }
    });
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

const goToCreateOrder = () => {
  router.push('/home/createorder');
};
onMounted(() => {
  fetchOrders();
});
</script>
<style scoped>

</style>