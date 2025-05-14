<template>
  <header>
    <div style="display: flex; gap: 8px; justify-content: flex-end">

      <a-button type="primary" @click="showModel"> + Thêm nhân viên khác</a-button>
    </div>
  </header>

  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; margin-top: 16px">
    <a-input
        v-model:value="searchQuery"
        placeholder="Tìm kiếm theo email, số điện thoại, tên nhân viên"
        style="width: 450px;"
        @pressEnter="fetchEmployees"
    />
    <div style="display: flex; gap: 8px; align-items: center; ">
      <a-select v-model:value="filterRole" @change="fetchEmployees" placeholder="Chọn vai trò" style="width: 200px;">
        <a-select-option v-for="role in roles" :key="role.id" :value="role.name">
          {{ role.name }}
        </a-select-option>
      </a-select>
      <a-select v-model:value="filterStatus" @change="fetchEmployees" placeholder="Chọn trạng thái" style="width: 200px;">
        <a-select-option :value="0">Đang làm việc</a-select-option>
        <a-select-option :value="1">Nghỉ việc</a-select-option>
      </a-select>
      <a-range-picker
          v-model:value="dateRange"
          :format="dateFormat"
          @change="fetchEmployees"
      />
      <a-button @click="emitSearch" type="primary" style="margin-left: 5px">Lưu bộ lọc</a-button>
      <a-button @click="clearFilters">Xoá bộ lọc</a-button>
    </div>
  </div>

  <TableComponent
      :columns="columns"
      :data="employees"
      :loading="loading"
      :enableSelection="true"
      :pagination="{
    current: currentPage > 0 ? currentPage : 1,  // Đảm bảo current luôn >= 1
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total) => `Tổng ${total} nhân viên`,
  }"
      @change="handlePageChange"

  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'actions'">
        <a-space>
          <!-- Nút Xem chi tiết -->
          <a-tooltip title="Xem chi tiết">
            <a-button type="link" @click="viewDetail(record.id)">
              <EyeOutlined />
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

  <a-modal
      v-model:open="isShowModel"
      title="Thêm nhân viên"
      @cancel="handleCancel"
      :footer="null"
      width="700px"
      centered
  >
    <form @submit.prevent="handleOk">
      <a-row :gutter="[16, 16]">
        <a-col :span="24" :md="12">
          <a-form-item label="Tên nhân viên">
            <a-input v-model:value="newEmployee.fullname" placeholder="Nhập tên nhân viên" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12">
          <a-form-item label="Số điện thoại">
            <a-input v-model:value="newEmployee.phone" placeholder="Nhập số điện thoại" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12">
          <a-form-item label="Địa chỉ">
            <a-input v-model:value="newEmployee.address" placeholder="Nhập địa chỉ" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12">
          <a-form-item label="Mật khẩu">
            <a-input v-model:value="newEmployee.password" type="password" placeholder="Nhập mật khẩu" />
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12">
          <a-form-item label="Trạng thái">
            <a-select v-model:value="newEmployee.status" placeholder="Chọn trạng thái">
              <a-select-option :value="0">Đang làm việc</a-select-option>
              <a-select-option :value="1">Nghỉ việc</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24" :md="12">
          <a-form-item label="Vai trò">
            <a-select v-model:value="newEmployee.id_role" placeholder="Chọn vai trò">
              <a-select-option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item style="text-align: right; margin-top: 24px;">
        <a-space>
          <a-button @click="handleCancel">Hủy</a-button>
          <a-button type="primary" html-type="submit">Thêm nhân viên</a-button>
        </a-space>
      </a-form-item>
    </form>
  </a-modal>

</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "../../../axios.js";
import dayjs from "dayjs";
import TableComponent from "@/components/TableComponent.vue";
import { useRoute, useRouter } from "vue-router";
import { EyeOutlined } from "@ant-design/icons-vue";
import {message} from "ant-design-vue";

const route = useRoute();
const router = useRouter();
const dateFormat = 'YYYY-MM-DD';
const dateRange = ref([]); // [startDate, endDate]

const columns = [
  { title: "Tên nhân viên", dataIndex: "name" },
  { title: "Số điện thoại", dataIndex: "phone" },
  { title: "Email", dataIndex: "email" },
  { title: "Trạng thái", dataIndex: "status" },
  { title: "Vai trò", dataIndex: "role" },
  { title: "Ngày tạo", dataIndex: "createdAt" },
  { title: "Địa chỉ", dataIndex: "address" },
  { title: "Hành động", dataIndex: "actions"} // ✅ Thêm cột mới
];

const employees = ref([]);
const loading = ref(false);
const isShowModel = ref(false);
const roles = ref([]);
const searchQuery = ref("");
const filterRole = ref(null);
const filterStatus = ref(null);
const createAt = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const pagination = ref({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showTotal: (total) => `Tổng ${total} nhân viên`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});
const fetchRoles = async () => {
  loading.value = true;
  try {
    const response = await axios.get("/roles");
    roles.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vai trò:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRoles();
});

const showModel = () => {
  isShowModel.value = true;
};

const newEmployee = ref({
  fullname: "",
  phone: "",
  address: "",
  id_role: null,
  password: "",
  status: 0,
});

const handleOk = async () => {
  try {
    await axios.post("/employee", newEmployee.value);
    isShowModel.value = false;
    fetchEmployees();
    message.success("Thêm nhân viên thành công!");

  } catch (error) {
    message.error("Lỗi khi thêm nhân viên: " + (error.response?.data?.message || "Đã xảy ra lỗi"));
  }
};

const handleCancel = () => {
  isShowModel.value = false;
};

const fetchEmployees = async () => {
  loading.value = true;
  const [start, end] = dateRange.value || [];
  try {
    const trimmedSearch = searchQuery.value?.trim();
    const params = {
      search: trimmedSearch && trimmedSearch.length > 0 ? trimmedSearch : undefined,
      role: filterRole.value !== null ? filterRole.value : undefined,
      status: filterStatus.value !== null ? filterStatus.value : undefined,
      startDate: start ? dayjs(start).format(dateFormat) : undefined,
      endDate: end ? dayjs(end).format(dateFormat) : undefined,
      page: currentPage.value,    // Dùng giá trị từ state
      limit: pageSize.value,      // Dùng giá trị từ state
    };
    const response = await axios.get("/employee", { params });

    employees.value = (response.data.listEmployee || []).map((item) => ({
      id: item.id,
      name: item.fullName,
      phone: item.phone,
      email: item.email,
      status: item.status === "working" ? "Đang làm việc" : "Ngừng hoạt động",
      role: item.role?.name || "Chưa có",
      createdAt: item.created_at ? dayjs(item.created_at).format("DD/MM/YYYY") : "Chưa có dữ liệu",
      address: item.address || "Không có dữ liệu",
    }));
    total.value = response.data.totalItems || 0;

  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error);
  } finally {
    loading.value = false;
  }
};
const handlePageChange = (page, pageSize) => {
  currentPage.value = page;
  pageSize.value = pageSize;
  fetchEmployees();
};
const viewDetail = (id) => {
  router.push(`/home/employee/${id}`);
};
const emitSearch = () => {
  fetchEmployees();
};
onMounted(() => {
  searchQuery.value = route.query.search || "";
  fetchEmployees();
});
const clearFilters = () => {
  searchQuery.value = "";
  filterRole.value = null;
  filterStatus.value = null;
  createAt.value = null;
  fetchEmployees();
};

</script>
