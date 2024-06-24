<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import { showConfirmDialog } from 'vant';
import { createOrder } from '@/api/order';
import { deleteCart } from '@/api/cart';

const route = useRoute();
const router = useRouter();
const remark = ref('');

if (!route.query.orderInfo) {
  router.replace('/cart');
}
const orderInfo = ref(
  JSON.parse(decodeURI(atob(route.query.orderInfo || '') || '') || '[]')
);
console.table(orderInfo.value);
const cartIds = orderInfo.value.goods.map(it => it.cartId).filter(it => it);
console.log(cartIds);
const addressList = reactive([
  {
    id: '1',
    name: orderInfo.value.consignee_name,
    tel: orderInfo.value.consignee_phone,
    address: orderInfo.value.consignee_address,
    isDefault: orderInfo.value.isDefault,
  },
]);

const back = () => {
  showConfirmDialog({
    message: '退出生成订单?',
  })
    .then(() => {
      // on confirm
      router.replace('/order');
    })
    .catch(() => {});
};

const show = ref(false);
const actions = [
  { name: '微信', pay_type: 1 },
  { name: '支付宝', pay_type: 2 },
  { name: '云闪付', pay_type: 3 },
];
const onSelect = async item => {
  const order_goods_infos = orderInfo.value.goods.map(it => ({
    goods_id: it.goods_id,
    count: it.count,
    price: it.price,
  }));
  if (!order_goods_infos.length) {
    router.replace('/order');
    return;
  }
  console.log(order_goods_infos);
  const order = {
    pay_type: item.pay_type,
    status: 2,
    remark: remark.value,
    price: orderInfo.value.price,
    consignee_name: orderInfo.value.consignee_name,
    consignee_phone: orderInfo.value.consignee_phone,
    consignee_address: orderInfo.value.consignee_address,
    order_goods_infos: order_goods_infos,
  };
  const res = await createOrder(order);
  if (cartIds.length) {
    const res = await deleteCart(cartIds);
    console.log(res);
    console.log('--------------------------------------');
  }
  console.log(res);
  console.log(item);
  router.replace('/order');
};
const onCancel = async () => {
  const order_goods_infos = orderInfo.value.goods.map(it => ({
    goods_id: it.goods_id,
    count: it.count,
    price: it.price,
  }));
  if (!order_goods_infos.length) {
    router.replace('/order');
    return;
  }
  console.log(order_goods_infos);
  const order = {
    pay_type: 0,
    status: 1,
    remark: remark.value,
    price: orderInfo.value.price,
    consignee_name: orderInfo.value.consignee_name,
    consignee_phone: orderInfo.value.consignee_phone,
    consignee_address: orderInfo.value.consignee_address,
    order_goods_infos: order_goods_infos,
  };
  const res = await createOrder(order);
  console.log(res);
  if (cartIds.length) {
    const res = await deleteCart(cartIds);
    console.log(res);
  }
  router.replace('/order');
};

const onSubmit = () => {
  show.value = true;
};
</script>

<template>
  <div class="container">
    <van-nav-bar
      left-arrow
      @click-left="back"
      :title="$route.meta.title"
      placeholder
      fixed
    />
    <div class="address">
      <van-address-list
        class="address_list"
        :list="addressList"
        default-tag-text="默认"
        :switchable="false"
      />
      <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 0' }"
        dashed
      />
    </div>
    <div class="goods_list">
      <van-card
        v-for="it in orderInfo.goods"
        :key="it.goods_id"
        :num="it.count"
        :price="(it.goodsInfo.price).toFixed(2)"
        :desc="it.goodsInfo.detail_info"
        :title="it.goodsInfo.name"
        :thumb="it.goodsInfo.pic_url"
      />
    </div>
    <van-submit-bar
      :price="orderInfo.price * 100"
      button-text="生成订单"
      @submit="onSubmit"
      placeholder
    >
      <template #top>
        <van-field
          v-model.trim="remark"
          type="textarea"
          label="备注"
          placeholder="备注"
          rows="3"
          maxlength="50"
          show-word-limit
          :rules="[{ required: true, message: '请填写备注' }]"
        />
      </template>
    </van-submit-bar>
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
      @cancel="onCancel"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  --van-submit-bar-z-index: 100;
  --van-address-list-add-button-z-index: 1;
  .address {
    padding-top: 20px;
    background-color: #fff;
    .address_list {
      --van-address-list-padding: 0;
      :deep(.van-badge__wrapper) {
        display: none;
      }
    }
  }
  .submit_box {
    background-color: #fff;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    padding: 10px;
  }
}
</style>
