<template>
  <router-view>
    <div class="login-container">
      <div class="login-form">
        <a-card class="login-card">
          <div class="logo">
            <span class="logo-icon">X</span>
            <span class="logo-text">BEST</span>
          </div>

          <h2>Chào mừng quay lại!</h2>
          <p>Hãy đăng nhập và khám phá bản thân ngay từ hôm nay</p>

          <a-form layout="vertical">
            <a-form-item label="Email">
              <a-input v-model:value="form.email" placeholder="Email"/>
            </a-form-item>

            <a-form-item label="Mật khẩu">
              <a-input-password v-model:value="form.password" placeholder="Mật khẩu"/>
            </a-form-item>

            <div class="login-options">
              <a-checkbox v-model:checked="form.remember">Lưu tài khoản</a-checkbox>
              <a href="#" class="forgot-password">Quên mật khẩu</a>
            </div>

            <a-form-item>
              <a-button type="primary" block @click="handleLogin" :loading="loading">Đăng nhập</a-button>
            </a-form-item>

            <p class="register-link">
              Bạn chưa có tài khoản?
              <router-link to="/">Đăng ký</router-link>
            </p>

            <div class="social-login">
              <span>Đăng nhập với</span>
              <a-button class="google-btn" block>
                <img src="https://khungnangluc.com/assets/google-e667d2f2.svg" alt="Google" class="google-icon"/>
                Google
              </a-button>
            </div>
          </a-form>
        </a-card>
      </div>

      <div class="login-bg"></div>
    </div>
  </router-view>
</template>

<script setup>
import {onMounted, onUnmounted, reactive, ref} from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import apiClient from "../../../axios.js";
const router = useRouter();
const loading = ref(false);

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const handleLogin = async () => {
  if (!form.email.trim() || !form.password.trim()) {
    message.error("Vui lòng nhập email và mật khẩu!");
    return;
  }

  loading.value = true;

  try {
    const response = await apiClient.post("/login", {
      email: form.email.trim(),
      password: form.password,
    });

    message.success("Đăng nhập thành công!");

    // Lưu thông tin vào localStorage nếu người dùng chọn "Lưu tài khoản"
    if (form.remember) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
    } else {
      sessionStorage.setItem("token", response.data.token);
    }

    // Chuyển hướng sau khi đăng nhập
    router.push("/home");
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message.error("Dữ liệu không hợp lệ, vui lòng kiểm tra lại!");
          break;
        case 401:
          message.error("Sai email hoặc mật khẩu!");
          break;
        case 500:
          message.error("Lỗi hệ thống, vui lòng thử lại sau!");
          break;
        default:
          message.error(error.response.data.message || "Đăng nhập thất bại!");
      }
    } else {
      message.error("Lỗi kết nối đến server!");
    }
  } finally {
    loading.value = false;
  }

};
// let intervalId = null;

// onMounted(() => {
//   intervalId = setInterval(async () => {
//     try {
//       await apiClient.get("/session", { withCredentials: true });
//     } catch (err) {
//       if (err.response?.status === 403) {
//         message.warning("Tài khoản đã bị khóa!");
//         router.push("/login");
//       }
//     }
//   }, 5000); // Kiểm tra mỗi 5 giây
// });
//
// onUnmounted(() => {
//   clearInterval(intervalId);
// });


</script>
