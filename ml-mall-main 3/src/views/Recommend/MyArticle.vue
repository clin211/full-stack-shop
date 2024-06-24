<script setup>
import { myArticleList } from '@/api/recommend';
import ArticleList from '@/components/ArticleList.vue';
</script>

<template>
  <van-nav-bar
    :title="$route.meta.title"
    placeholder
    fixed
    left-arrow
    @click-left="$router.back()"
    @click-right="$router.push('/add-article')"
  >
    <template #right>
      <van-icon name="add-o" size="18" />
    </template>
  </van-nav-bar>
  <div class="content">
    <ArticleList
      class="list"
      :api-fn="myArticleList"
      :params="{ page: 1, limit: 10 }"
    />
  </div>
  <van-back-top right="20px" bottom="20px" />
</template>

<style lang="scss" scoped>
.content {
  padding-bottom: 1px;
  .list {
    margin: 10px;
  }
}
</style>
