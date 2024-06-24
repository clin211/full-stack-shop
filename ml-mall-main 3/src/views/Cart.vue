<script setup>
import { useCartStore } from '@/stores/cart';
import { deleteCart, editCart } from '@/api/cart';
import { ref, computed } from 'vue';
import { getToken } from '@/utils/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const cartStore = useCartStore();
// console.table(cartStore.data);
const isLogin = ref(false);
if (getToken()) {
  isLogin.value = true;
}

const selectedAll = computed({
  get: () => cartStore.data?.every?.(it => it.checked),
  set: val => {
    cartStore.data.forEach?.(it => {
      it.checked = val;
    });
  },
});

const changeSelected = () => {
  selectedAll.value = cartStore.data?.every?.(it => it.checked);
};

const totalPrice = computed(() =>
  cartStore?.data?.filter(it => it.checked)
    .reduce((pre, cur) => pre + cur.goods_info?.price * cur.count, 0)
);

const deleteGoods = async id => {
  console.log(id);
  const res = await deleteCart(id);
  console.log(res);
  if (res.code === 1) {
    cartStore.changeCart();
  }
};
const changeGoodsSum = async ({ goods_id, id, count }) => {
  const res = await editCart({ goods_id, id, count });
  console.log('res:', res);
  if (res.code === 1) {
    console.log(`${id} ${goods_id} change count ${count}`);
  }
};

const onSubmit = () => {
  const goods = cartStore.data
    .filter?.(it => it.checked)
    .map(it => ({
      goods_id: it.goods_id,
      count: it.count,
      cartId: it.id,
      // goodsInfo: it.goodgoods_infos_info,
      goodsInfo: it.goods_info,
    }));
  if (goods.length > 0) {
    // console.log(goods);
    // console.log('total price:', totalPrice.value);
    // console.log('tiaozhuan qian de dayin:', { goods, price: totalPrice.value })
    router.push({
      name: 'addressList',
      query: {
        orderInfo: btoa(
          encodeURI(
              JSON.stringify({
                goods,
                price: totalPrice.value,
              })
          )
        ),
      },
    });
  }
};
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
    <main v-if="isLogin" class="content">
      <van-list
        class="goods_list"
        v-if="cartStore.data?.length > 0"
        finished-text="没有更多了"
        offset
      >
        <van-swipe-cell class="goods_item" v-for="it in cartStore.data">
          <van-checkbox
            class="selected"
            v-model="it.checked"
            @select="changeSelected"
          />
          <div class="goods_box">
            <van-card
              class="goods_card"

              :key="it.id"
              :num="it.count"
              :price="((it.goods_info.price) * it.count).toFixed(2)"
              :desc="it.goods_info.detail_info"
              :title="it.goods_info.name"
              :thumb="it.goods_info.pic_url"
            >
              <template #tags>
                <van-tag plain type="primary">{{ it.goods_info.tags }}</van-tag>
              </template>
              <template #footer>
                <van-stepper @change="changeGoodsSum(it)" v-model="it.count" />
              </template>
            </van-card>
          </div>
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
              @click="deleteGoods(it.id)"
            />
          </template>
        </van-swipe-cell>
      </van-list>
      <div class="is_null" v-else>
        <van-icon name="smile-o" size="50px" />
        <p class="cart_tip">购物车空空如也</p>
        <van-button class="to_btn" type="primary" to="/home">去首页</van-button>
      </div>
    </main>
    <div v-if="!isLogin" class="no_login_content">
      <van-empty class="thumbnail" description="未登录">
        <van-button
          type="primary"
          class="login_btn"
          @click="$router.push('/login')"
          >登录</van-button
        >
      </van-empty>
    </div>
    <van-submit-bar
      v-if="isLogin && cartStore.data?.length > 0"
      class="submit"
      :price="totalPrice * 100"
      button-text="提交订单"
      @submit="onSubmit"
    >
      <van-checkbox v-model="selectedAll">全选</van-checkbox>
    </van-submit-bar>
    <van-back-top v-if="isLogin" right="20px" bottom="4rem" />
  </main>
</template>

<style lang="scss" scoped>
.container {
  .login_btn {
    width: 180px;
  }
  main.content {
    margin-bottom: var(--van-submit-bar-height);
    .goods_list {
      .goods_item {
        position: relative;
        .selected {
          position: absolute;
          z-index: 2;
          left: 8px;
          top: 58px;
        }
        .goods_box {
          background: #f7f8fa;
          margin-top: 10px;
          .goods_card {
            margin-left: 30px;
          }
        }
        .delete-button {
          width: 100%;
          height: 100%;
        }
      }
    }
    .is_null {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 55vh;
      text-align: center;
      p.cart_tip {
        font-size: 18px;
      }
      .to_btn {
        margin-top: 16px;
        width: 180px;
      }
    }
  }
  .submit {
    bottom: var(--van-submit-bar-height);
  }
}
</style>
