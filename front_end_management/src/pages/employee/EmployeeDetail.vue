<template>
  <a-card class="employee-profile-card">
    <template #title>
      <div class="card-header">
        <a-button type="text" @click="handleBack" class="back-button">
          <template #icon>
            <LeftOutlined />
          </template>
        </a-button>
        <span class="card-title">{{ employee?.fullName || '...' }}</span>
        <div class="role-card" style="display: flex; gap: 8px; margin-left: 9cm">
          <div class="action-buttons">
            <a-button type="primary" @click="openEditModal">Chỉnh sửa thông tin</a-button>
          </div>

        </div>
      </div>
    </template>

    <div v-if="loading">Đang tải...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="employee-info-section">
      <div class="info-row">
        <span class="info-label">Họ và tên</span>
        <span class="info-value">{{ employee?.fullName }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Số điện thoại</span>
        <span class="info-value">{{ employee?.phone }}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Email</span>
        <span class="info-value">{{ employee?.email }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Địa chỉ</span>
        <span class="info-value">{{ employee?.address }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Vai trò </span>
        <span class="info-value">{{ employee?.role.name }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Trạng thái </span>
        <span class="info-value">{{employee?.status === "working" ? "Đang làm việc" : "Ngừng hoạt động" }}</span>
      </div>
    </div>
    <div class="update-instructions">
      <p>Để cập nhật thông tin nhân viên, bạn vui lòng bảo nhân viên vào "Tài khoản của tôi" trong trang quản trị Sapo hoặc truy cập đường dẫn
        <a href="https://profiles.sapo.vn" target="_blank">https://profiles.sapo.vn</a>
      </p>
    </div>
    <a-divider />

    <div class="notes-section">
      <h4>Ghi chú</h4>
      <a-textarea placeholder="Nhập ghi chú (nếu có)" :rows="3" />
    </div>

    <a-divider />

  </a-card>
  <a-modal v-model:visible="isEditModalVisible" title="Chỉnh sửa nhân viên" @ok="handleEditOk">
    <a-form layout="vertical">
      <a-form-item label="Họ và tên">
        <a-input v-model:value="editedEmployee.fullName" />
      </a-form-item>
      <a-form-item label="Số điện thoại">
        <a-input v-model:value="editedEmployee.phone" />
      </a-form-item>
      <a-form-item label="Email">
        <a-input v-model:value="editedEmployee.email" />
      </a-form-item>
      <a-form-item label="Địa chỉ">
        <a-input v-model:value="editedEmployee.address" />
      </a-form-item>
      <a-form-item label="Vai trò">
        <a-select v-model:value="editedEmployee.role" :options="roleOptions" placeholder="Chọn vai trò">
          <a-select-option v-for="role in roles" :key="role.id" :value= "role.id">
            {{ role.name }}
          </a-select-option>
        </a-select>

      </a-form-item>

      <a-form-item label="Trạng thái">
        <a-select v-model:value="editedEmployee.status" :options="statusOptions" placeholder="Chọn trạng thái" >
        <a-select-option :value=0>Đang làm việc</a-select-option>
        <a-select-option :value=1>Nghỉ việc</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import axios from "../../../axios.js";
import { message } from 'ant-design-vue'; // Thêm import nếu chưa có



const router = useRouter();
const route = useRoute();
const roles = ref([]);
const employee = ref(null);
const loading = ref(true);
const error = ref(null);
const isEditModalVisible = ref(false);
const editedEmployee = ref({});
const handleBack = () => {
  router.go(-1);
};
const openEditModal = () => {
  editedEmployee.value = {
    ...employee.value,
    role: employee.value.role?.id,
    status: employee.value.status === "working" ? 0 : 1, // Nếu dùng enum
  };
  console.log(editedEmployee.value);
  isEditModalVisible.value = true;
};
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
const handleEditOk = async () => {
  try {
    const { fullName, phone, email, address, role, status } = editedEmployee.value;

    const payload = {
      fullName,
      phone,
      email,
      address,
      role: Number(role),
      status: Number(status),
    };

    const response = await axios.put(`/employee/${route.params.id}`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },

    });

    if (response.status === 200) {
      message.success('Cập nhật thành công!');
      isEditModalVisible.value = false;
      fetchEmployeeDetail(); // reload lại employee
    }
  } catch (error) {
    console.error('Lỗi cập nhật nhân viên:', error);
    message.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra');
  }
};



const fetchEmployeeDetail = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await axios.get(`employee/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Nếu cần token
      },
    });

    employee.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Không thể lấy thông tin nhân viên';
  } finally {
    loading.value = false;
  }

};

onMounted(() => {
  fetchEmployeeDetail();
  fetchRoles();
});
</script>


<style scoped>
.employee-profile-card {
  max-width: 800px;
  margin: 20px auto;
}

.card-header {
  display: flex;
  align-items: center;
}

.back-button {
  margin-right: 12px;
  color: #1890ff;
}

.card-title {
  font-size: 1.2em;
  font-weight: 500;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-label {
  font-weight: 500;
  width: 120px;
  flex-shrink: 0;
}

.info-value {
  flex-grow: 1;
}

.update-instructions {
  margin: 20px 0;
  color: #666;
}

.notes-section {
  margin-bottom: 20px;
}

.employee-roles-section {
  margin-top: 20px;
}

</style>