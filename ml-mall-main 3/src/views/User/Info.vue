<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <main class="container">
    <van-nav-bar
      :title="$route.meta.title"
      placeholder
      fixed
      left-arrow
      @click-left="$router.back()"
    />
    <div class="content">
      <van-cell title="修改密码" is-link to="/edit-pwd" />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.container {
  .content {
    .edit_box {
      padding: 10px;
      .edit_btn {
        width: 100%;
      }
    }
  }
}
</style>
