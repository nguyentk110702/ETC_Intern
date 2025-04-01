<template>
  <a-layout style="min-height: 100vh">
    <Sidebar />
    <a-layout>
      <Header />
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";

export default {
  components: {
    Sidebar,
    Header,
  },
};
</script>

<style scoped>
.content {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}
</style>
