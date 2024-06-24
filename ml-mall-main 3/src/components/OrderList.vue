<script setup>
const props = defineProps({
  orderData: {
    type: Array,
    default: [],
  },
});
const transformStatus = status => {
  switch (status) {
    case 1:
      return '待支付';
    case 2:
      return '待发货';
    case 3:
      return '待收货';
    case 4:
      return '待评价';
  }
};

const transformPayType = type => {
  switch (type) {
    case 1:
      return '微信';
    case 2:
      return '支付宝';
    case 3:
      return '云闪付';
  }
};

console.table(props.orderData);
</script>

<template>
  <div class="container">
    <div class="order_item" v-for="order in $props.orderData" :key="order.id">
      <div class="header">
        <p class="create_time">订单时间：{{ order.created_at }}</p>
        <p class="status">{{ transformStatus(order.status) }}</p>
      </div>

<!--      <van-card-->
<!--        class="goods_item"-->
<!--        v-for="goods in order.order_goods_infos"-->
<!--        :num="goods.count"-->
<!--        :price="((goods.goods_info?.price || 0) / 100).toFixed(2)"-->
<!--        :desc="goods.goods_info?.detail_info"-->
<!--        :title="goods.goods_info?.name"-->
<!--        :thumb="-->
<!--          goods.goods_info?.pic_url ||-->
<!--          'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'-->
<!--        "-->
<!--      />-->

      <van-card
          class="goods_item"
          :num="1"
          :price="((order.price || 0)).toFixed(2) "
          :thumb="'https://img0.baidu.com/it/u=1264541246,3448895335&fm=253&fmt=auto&app=138&f=JPEG?w=260&h=260'"
      />
      <div class="footer">
        <div
          :style="{
            visibility: order.status === 1 ? 'hidden' : 'visible',
          }"
        >
          支付方式：{{ transformPayType(order.pay_type) }}
        </div>
        <div>总金额：￥{{ ((order.price || 0)).toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  .order_item {
    padding: 10px;
    margin: 10px;
    background: #fff;
    border-radius: 12px;
    .header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      .create_time {
        color: #2f3640;
      }
      .status {
        color: #353b48;
      }
    }
    .goods_item {
      margin: 5px 0;
      background: #ffffff;
      border-radius: 10px;
    }
    .footer {
      font-size: 10px;
      color: #2f3640;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 2px;
    }
  }
}
</style>
