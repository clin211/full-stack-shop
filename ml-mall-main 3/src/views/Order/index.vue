<script setup>
import { getOrder } from '@/api/order';
import { onMounted, ref, defineAsyncComponent, Suspense } from 'vue';

const OrderList = defineAsyncComponent(() =>
  import('@/components/OrderList.vue')
);

const active = ref(0);
const orderData = ref([]);

const changeTab = async status => {
  if (typeof status !== 'number') status = status.name;
  console.log(status);
  const res = await getOrder({ status, limit: 30, page: 1 });
  if (res.code === 1) {
    orderData.value = res.data.list?.reverse?.() ?? [];
  }
  console.log(res);
};

onMounted(async () => {
  const res = await getOrder({ status: 0, limit: 30, page: 1 });
  console.log(res);
  if (res.code === 1) {
    orderData.value = res.data.list?.reverse?.() ?? [];
  }
  console.log(orderData.value);
});
</script>

<template>
  <div class="container">
    <van-nav-bar
      left-arrow
      @click-left="$router.replace('/user')"
      :title="$route.meta.title"
      placeholder
      fixed
    />
    <van-tabs
      v-model:active="active"
      @click-tab="changeTab"
      @change="changeTab"
      offset-top="45px"
      sticky
      swipeable
    >
      <van-tab title="全部">
        <Suspense>
          <template #default>
            <OrderList :orderData="orderData" />
          </template>
          <template #fallback> Loading... </template></Suspense
        >
      </van-tab>
      <van-tab title="待支付">
        <OrderList :orderData="orderData" />
      </van-tab>
      <van-tab title="已支付"><OrderList :orderData="orderData" /> </van-tab>
     <!-- <van-tab title="待收货">
        <OrderList :orderData="orderData" />
      </van-tab>
      <van-tab title="待评价">
        <OrderList :orderData="orderData" />
      </van-tab>
      -->
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped></style>
