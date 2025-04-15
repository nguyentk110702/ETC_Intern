<template>
  <a-layout-header class="header">
    <div class="left-section">
      <a-space>
        <a-button type="text" class="header-item">Vay vốn kinh doanh</a-button>
        <a-button type="text" class="header-item">Trợ giúp</a-button>
        <a-button type="text" class="header-item">Góp ý</a-button>
      </a-space>
    </div>

    <div class="right-section">
      <a-dropdown>
        <a-space>
          <a-avatar style="background-color: #c100fd; color: #fff">
            {{ initials }}
          </a-avatar>
          <span class="username">{{ user?.fullName }}</span>
        </a-space>
        <template #overlay>
          <a-menu>
            <a-menu-item key="logout" @click="logout">
              <LogoutOutlined />
              Đăng xuất
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>


<script setup>
import {ref, onMounted, computed, onUnmounted} from "vue";
import apiClient  from "../../axios.js";
import { useRouter } from "vue-router";
import {message} from "ant-design-vue";

const user = ref(null);
const router = useRouter();

// Hàm lấy dữ liệu user từ session
const fetchUserSession = async () => {
  try {
    const response = await apiClient.get("/session", { withCredentials: true });
    console.log("Dữ liệu từ API /session:", response.data);
    user.value = response.data.user?.data || response.data; // Cập nhật user nếu hợp lệ
  } catch (error) {
    console.error("❌ Không tìm thấy session hoặc tài khoản bị khóa:", error?.response?.status);

    if (error.response?.status === 403) {
      message.warning("Tài khoản của bạn đã bị khóa!");
    }

    router.push("/login");
  }
};


const logout = async () => {
  try {
    await apiClient.post("/logout", {}, { withCredentials: true });
    user.value = null;
    router.push("/login");
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};

const checkSessionLoop = async () => {
  try {
    console.log('🔄 Gửi request /session...');
    await apiClient.get("/session", { withCredentials: true });
    console.log('✅ Session hợp lệ');
  } catch (err) {
    console.log('⚠️ Session lỗi:', err?.response?.status);
    if (err.response?.status === 403) {
      message.warning("Tài khoản của bạn đã bị khóa!");
      router.push("/login");
      return;
    }
  }

  // Lặp lại sau 5s nếu vẫn còn hoạt động
  intervalId = setTimeout(checkSessionLoop, 5000);
};
// Tạo chữ cái đầu từ tên (ví dụ: Nguyễn Văn A -> "N")
const initials = computed(() => {
  return user.value?.fullName ? user.value.fullName.charAt(0).toUpperCase() : "U";
});
let intervalId = null;
onMounted(() => {
  fetchUserSession();
  // checkSessionLoop();
});
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

</script>

<style scoped>
.header {
  background: #fff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
}

.left-section {
  display: flex;
  align-items: center;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-item {
  font-size: 14px;
  color: #666;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .username {
    display: none; /* Ẩn tên user trên mobile */
  }
}
</style>

