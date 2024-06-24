<script setup>
import { getCattleByType } from '@/api/cattle';
import ArticleList from '@/components/ArticleList.vue';
import { onMounted, ref } from 'vue';

const dataList = ref([]);

const getCattleListByType = async params => {
  const res = await getCattleByType(params);
  console.log(res.data.list);
  // const dataList = res.data.list;
  // res.data.list = dataList
    // ?.map(item => ({
    //   ...item,
    //   title: item.article.title,
    //   desc: item.article.desc,
    //   pic_url: item.article.picUrl,
    //   id: item.object_id,
    //   detail: item.article.detail,
    // }))
    // .reverse();

  return res;

};

onMounted(async () => {
  const res = await getCattleByType({ type: 2, page: 1, limit: 20 });
  dataList.value = res.data.list;
  console.log(dataList.value);
});
</script>

<template>
  <van-nav-bar
    :title="$route.meta.title"
    placeholder
    fixed
    @click-left="$router.back()"
    left-arrow
  />
  <!--<div class="container">
    <ArticleList
      class="list"
      :dataList="dataList"
      :api-fn="getCattleListByType"
      :params="{ type: 2, page: 1, limit: 20 }"
    />
  </div>-->
  <div class="container">
    <ArticleList
        class="list"
        :api-fn="getCattleListByType"
        :params="{ type: 2, page: 1, limit: 20 }"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 10px 10px 0px 10px;
}
</style>
