<template>
  <div class="login-container">
    <div class="login-form">
      <a-card class="login-card">
        <div class="logo">
          <span class="logo-icon">X</span>
          <span class="logo-text">BEST</span>
        </div>
        <h2>Chào mừng quay lại!</h2>
        <a-form layout="vertical" @submit.prevent="register">
          <a-form-item label="Họ tên" :validate-status="errors.fullname ? 'error' : ''" :help="errors.fullname">
            <a-input v-model:value="form.fullname" placeholder="Tên hiển thị trong hệ thống"/>
          </a-form-item>
          <a-form-item label="Email" :validate-status="errors.email ? 'error' : ''" :help="errors.email">
            <a-input v-model:value="form.email" placeholder="Email đăng ký tài khoản"/>
          </a-form-item>
          <a-form-item label="Mật khẩu" :validate-status="errors.password ? 'error' : ''" :help="errors.password">
            <a-input-password v-model:value="form.password" placeholder="Nhập mật khẩu"/>
          </a-form-item>
          <a-form-item label="Nhập lại mật khẩu" :validate-status="errors.confirmPassword ? 'error' : ''" :help="errors.confirmPassword">
            <a-input-password v-model:value="form. confirmPassword" placeholder="Nhập lại mật khẩu"/>
          </a-form-item>
          <div class="flex items-start mb-4">
            <a-checkbox :checked="form.agree" @change="(e) => (form.agree = e.target.checked)"/>
            <span class="ml-2 text-sm">
              Tôi đã đọc và đồng ý với
              <a href="#" class="text-blue-500">Chính sách bảo vệ dữ liệu cá nhân & Quy định sử dụng</a>
              của XBEST
            </span>
          </div>
          <p v-if="errors.agree" class="text-red-500 text-sm">{{ errors.agree }}</p>

          <a-form-item>
            <a-button type="primary" block @click="register">Đăng kí</a-button>
          </a-form-item>
          <p class="text-center mt-3 text-sm">
            Bạn đã có tài khoản?
            <router-link to="/login" class="text-blue-500" @click="debugClick">Đăng nhập</router-link>
          </p>
        </a-form>
      </a-card>
    </div>
    <div class="login-bg"></div>
  </div>

</template>

<script setup>
import {reactive, ref} from "vue";
import "../../assets/styles/login.css";
import apiClient from "../../../axios.js";
const form = reactive({
  fullname: "",
  email: "",
  confirmPassword: "",
  agree: false,
});
const errors = reactive({});
const loading = ref(false);
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const register = async () => {
  // Kiểm tra dữ liệu đầu vào trước khi gọi API
  if (!form.fullname.trim() || !form.email.trim() || !form.password.trim()) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }
  if (form.password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự!");
    return;
  }
  if (form.password !== form.confirmPassword) {
    alert("Mật khẩu nhập lại không khớp!");
    return;
  }
  if (!form.agree) {
    alert("Bạn cần đồng ý với điều khoản sử dụng!");
    return;
  }

  try {
    const response = await apiClient.post("/register", {
      fullname: form.fullname.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    console.log("Đăng ký thành công:", response.data);
    alert("Đăng ký thành công! Hãy đăng nhập.");

    // Sau khi đăng ký thành công, có thể chuyển hướng sang trang đăng nhập
    window.location.href = "/login";
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          alert(error.response.data.message || "Email đã được đăng ký, hãy dùng email khác!");
          break;
        case 404:
          alert("Không tìm thấy quyền, vui lòng thử lại sau!");
          break;
        case 500:
          alert("Có lỗi hệ thống, thử lại sau!");
          break;
        default:
          alert("Đã có lỗi xảy ra!");
      }
    } else {
      alert("Lỗi kết nối đến server!");
    }
  }
};
const debugClick = () => {
  console.log("Click vào link Đăng nhập");
};
</script>


