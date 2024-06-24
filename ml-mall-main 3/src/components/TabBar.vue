<script setup>
import { ref } from 'vue';

/**
 * 选中index
 */
const active = ref(0);

const props = defineProps({
  cartCount: {
    type: Number,
    default: null,
  },
});
</script>

<template>
  <van-tabbar v-model="active" placeholder route>
    <van-tabbar-item icon="home-o" to="/home" replace>首页</van-tabbar-item>
    <van-tabbar-item icon="list-switch" to="/dazhe" replace>分类</van-tabbar-item>
    <van-tabbar-item icon="balance-list-o" to="/recommend" replace>种草文章</van-tabbar-item>
    <van-tabbar-item icon="cart-o" to="/cart" :badge="$props.cartCount" replace>购物车</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/user" replace>我的</van-tabbar-item>
  </van-tabbar>
</template>

<style lang="scss" scoped></style>
