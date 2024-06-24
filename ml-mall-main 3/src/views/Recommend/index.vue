<script setup>
import { getArticleList } from '@/api/recommend';
import ArticleList from '@/components/ArticleList.vue';
</script>

<template>
  <div class="container">
    <van-nav-bar
      :title="$route.meta.title"
      placeholder
      fixed
      @click-left="$router.back()"
      left-arrow
      @click-right="$router.push('/add-article')"
    >
      <template #right>
        <van-icon name="add-o" size="18" />
      </template>
    </van-nav-bar>
    <ArticleList
      class="list"
      :api-fn="getArticleList"
      :params="{ page: 1, limit: 10 }"
    />
    <van-back-top right="20px" bottom="60px" />
  </div>
</template>

<style lang="scss" scoped>
.list {
  margin: 10px;
}
</style>
