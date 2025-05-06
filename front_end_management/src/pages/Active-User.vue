<template>
  <a-typography-title :level="5" style="margin-bottom: 16px;">
    Có {{ count }} tài khoản đang đăng nhập
  </a-typography-title>
  <TableComponent
      :columns="columns"
      :data="employees"
      :loading="loading"
      :enableSelection="true"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'actions'">
        <a-space>
          <!-- Nút Đăng xuất tài khoản -->
          <a-tooltip title="Đăng xuất tài khoản">
            <a-button type="link" danger @click="logoutUser(record.id)">
              Đăng xuất
            </a-button>
          </a-tooltip>
        </a-space>
      </template>
      <template v-else-if="column.dataIndex === 'status'">
        <a-tag :color="record.status === 'Đang làm việc' ? 'green' : 'red'">
          {{ record.status }}
        </a-tag>
      </template>
    </template>

  </TableComponent>



</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "../../axios.js";
import dayjs from "dayjs";
import TableComponent from "@/components/TableComponent.vue";
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';

import { EyeOutlined } from "@ant-design/icons-vue";

const router = useRouter();
const count = ref(0);

const columns = [
  { title: "Tên đăng nhập", dataIndex: "name" },
  { title: "Email", dataIndex: "email" },
  { title: "Vai trò", dataIndex: "role" },
  { title: "Thời gian tạo", dataIndex: "createdAt" },
  { title: "Hành động", dataIndex: "actions" }
];

const employees = ref([]);
const loading = ref(false);
const logoutUser = async (userId) => {
  try {
    const res = await axios.post(`/admin/logout-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    message.success(res.data.message);
    await fetchActiveUser();
  } catch (err) {
    message.error(err.response?.data?.message || 'Đăng xuất thất bại');
  }
};
const fetchActiveUser = async () => {
  loading.value = true;
  try {
    const response = await axios.get("/admin/active-users");
    count.value = response.data.count || 0;

    employees.value = (response.data.activeUsers || []).map((item) => ({
      id: item.id,
      name: item.fullName,
      phone: item.phone,
      email: item.email,
      status: item.status === "working" ? "Đang làm việc" : "Ngừng hoạt động",
      role: item.role?.name || "Chưa có",
      createdAt: item.created_at ? dayjs(item.created_at).format("DD/MM/YYYY") : "Chưa có dữ liệu",
      address: item.address || "Không có dữ liệu",
    }));
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách tài khoản đang đăng nhập:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  fetchActiveUser();
});


</script>
