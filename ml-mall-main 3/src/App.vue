<script setup>
import { ref, watch, onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { getToken } from './utils/auth';
import { useUserStore } from './stores/user';
import { lastLoginUser } from './utils/userCache';
import { useCartStore } from './stores/cart';
import { getUserInfo } from './api/auth';
import TabBar from './components/TabBar.vue';

/**
 * vue3路由用法相当于$route,返回当前路由地址
 */
const route = useRoute();

/**
 * 新建一个响应式数据来控制组件的存在
 */
const isShowNav = ref(false);

const userStore = useUserStore();
const cartStore = useCartStore();
const currentUser = lastLoginUser();
console.log(currentUser);

onMounted(async () => {
  if (getToken()) {
    userStore.setInfo(currentUser);
    const res = await getUserInfo(currentUser);
    console.log(res);
  } else {
    userStore.reset();
  }
});

// 监视路由变动，然后控制TabBar组件的存在
watch(route, newVal => {
  isShowNav.value = newVal.meta.isShowNav;
});
</script>

<template>
  <RouterView />
  <TabBar
    v-if="isShowNav"
    :cart-count="cartStore?.count ? cartStore.count : null"
  />
</template>

<style lang="scss" scoped></style>
