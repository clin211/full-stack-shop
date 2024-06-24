<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import Goods from "@/components/Goods.vue";
import {getCarouselChartData, getClassification, getProductList} from "@/api/home";
const route = useRoute();
const id = ref(0)
if (route.query.id) {
  // id.value = route.query.id
  id.value = parseInt(route.query.id);
   console.log(id.value)
}

const commodityData = ref([]);

onMounted(async () => {
  // 获取商品数据
  commodityData.value = (
      await getProductList({ limit: 20, page: 1 })
  ).data.list;
  // console.table(commodityData.value);

  commodityData.value = commodityData.value.filter(item => item.level2_category_id === id.value);
  console.log(id.value)
  console.table(commodityData.value);
  // const res = await getClassification(1);
  // console.log(res);

});
</script>

<template>
  <div>
    <!-- 商品展示 -->
    <Goods
        :data-item="commodityData">
      <template #title>
        <div>商品</div>
      </template>
    </Goods>
    <van-back-top right="20px" bottom="60px" />
  </div>
</template>

<style scoped lang="scss">

</style>