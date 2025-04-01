<template>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">

    <a-input
        v-model="searchQuery"
        placeholder="Tìm kiếm theo email, số điện thoại, tên nhân viên"
        style="width: 550px;"
        @pressEnter="fetchEmployees"
    />

    <div style="display: flex; gap: 8px;">
      <a-button>Phân quyền vai trò</a-button>
      <a-button type="primary">+ Thêm nhân viên khác</a-button>
    </div>
  </div>
  <a-table :row-selection="rowSelection" :columns="columns" :data-source="employees" :loading="loading">
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">
        <a>{{ text }}</a>
      </template>
      <template v-else-if="column.dataIndex === 'status'">
        <span :style="{ color: text === 'Đang làm việc' ? 'green' : 'red' }">{{ text }}</span>
      </template>
      <template v-else-if="column.dataIndex === 'role'">
        <a>{{ text }}</a>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "../../../axios.js";
import dayjs from "dayjs";
const columns = [
  {
    title: "Tên nhân viên",
    dataIndex: "name",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
  {
    title: "Vai trò",
    dataIndex: "role",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
  },
];

const employees = ref([]);
const loading = ref(false);

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const response = await axios.get("/employee", {
      params: {
        search: "",
        page: 1,
        limit: 10,
        role: "",
        createAt: "",
        status: "",
      },
      withCredentials: true,
    });

    console.log("Dữ liệu API trả về:", response.data);

    // Kiểm tra nếu API trả về đúng cấu trúc
    const employeeList = Array.isArray(response.data.listEmployee) ? response.data.listEmployee : [];

    employees.value = employeeList.map((item, index) => ({
      key: index.toString(),
      name: item.fullName,  // Đổi từ item.name -> item.fullName vì API dùng fullName
      phone: item.phone,
      email: item.email,
      status: item.status === "working" ? "Đang làm việc" : "Ngừng hoạt động",
      role: item.role?.name || "Chưa có",
      createdAt: item.created_at
          ? dayjs(item.created_at).format("DD/MM/YYYY")  // Chuyển đổi định dạng
          : "Chưa có dữ liệu", // API trả về created_at
      address: item.address || "Không có dữ liệu",
    }));
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
  } finally {
    loading.value = false;
  }
};



onMounted(fetchEmployees);

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
  },
};
</script>
