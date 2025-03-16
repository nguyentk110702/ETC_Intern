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
              <a-button type="primary" block @click="login">Đăng nhập</a-button>
            </a-form-item>

            <p class="register-link">
              Bạn chưa có tài khoản?
              <router-link to="/register">Đăng ký</router-link>
            </p>

            <div class="social-login">
              <span>Đăng nhập với</span>
              <a-button class="google-btn" block>
                <img src="/favicon.ico" alt="Google" class="google-icon"/>
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
import {reactive} from "vue";
import "../../assets/styles/login.css";

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const login = () => {
  console.log("Đăng nhập với:", form);
};
</script>


