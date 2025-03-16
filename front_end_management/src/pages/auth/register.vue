<template>

  <div class="login-container">
    <div class="login-form">
      <a-card class="login-card">
        <div class="logo">
          <span class="logo-icon">X</span>
          <span class="logo-text">BEST</span>
        </div>
        <h2>Chào mừng quay lại!</h2>
        <a-form layout="vertical">
          <a-form-item label="Họ tên">
            <a-input v-model:value="form.fullname" placeholder="Tên hiển thị trong hệ thống"/>
          </a-form-item>
          <a-form-item label="Email">
            <a-input v-model:value="form.email" placeholder="Email đăng ký tài khoản"/>
          </a-form-item>
          <a-form-item label="Mật khẩu">
            <a-input-password v-model:value="form.password" placeholder="Nhập mật khẩu"/>
          </a-form-item>
          <a-form-item label="Mật khẩu">
            <a-input-password v-model:value="form. confirmPassword" placeholder="Nhập lại mật khẩu"/>
          </a-form-item>
          <div class="flex items-start mb-4">
            <a-checkbox v-model:checked="form.agree"/>
            <span class="ml-2 text-sm">
              Tôi đã đọc và đồng ý với
              <a href="#" class="text-blue-500">Chính sách bảo vệ dữ liệu cá nhân & Quy định sử dụng</a>
              của XBEST
            </span>
          </div>
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
import {reactive} from "vue";
import "../../assets/styles/login.css";

const form = reactive({
  fullname: "",
  email: "",
  confirmPassword: "",
  agree: false,
});

const register = () => {
  console.log("Đăng ký với:", form);
};
const debugClick = () => {
  console.log("Click vào link Đăng nhập");
};
</script>


