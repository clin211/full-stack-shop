<script setup>
import { ref, onMounted, computed } from 'vue';
import { getArticleInfo } from '@/api/recommend';
import { addCattle, deleteCattleByType } from '@/api/cattle';
import { addCollection, deleteCollectionByType ,deleteCollectionById} from '@/api/collection';
import { useRoute, useRouter } from 'vue-router';
import {addCommentApi, getComments, listComments} from '@/api/comment';
import {getProductList} from "@/api/home";

const route = useRoute();
const router = useRouter();
const articleId = route.query.articleId;
const objectid = ref(0)
if (route.query.articleId) {
  objectid.value = parseInt(route.query.articleId);
  console.log(objectid.value)
}

console.log(route.query);
if (!articleId) {
  router.replace('/recommend');
}
const info = ref({});
const cominfo = ref([]);

const changeData = async () => {
  if (!articleId) return;
  const res = await getArticleInfo(articleId);
  console.log(res)
  if (res.code === 1) {
    // res.data.comments = res.data.comments?.reverse?.();
    info.value = res.data;
  }
  console.table(info.value);
};

const changecomData = async () => {
  if (!articleId) return;

  cominfo.value = (
      await listComments({ type: 2, limit: 20, page: 1 })
  ).data.list;

  cominfo.value = cominfo.value.filter(item => item.object_id === objectid.value);

  // const res = await getComments(articleId);
  // if (res.code === 1) {
  //   cominfo.value = res.data;
  // }
  console.table(cominfo.value);
}

onMounted(async () => {
  await changeData();
  isThumbs.value = info.value.is_praise;
  isCollection.value = info.value.is_collect;
  await changecomData();
});

const isThumbs = ref(false);
const giveTheThumbsUp = async () => {
  if (isThumbs.value) {
    const res = await deleteCattleByType({ type: 2, object_id: info.value.id });
    console.log(res);
    console.log('😓');
  } else {
    const res = await addCattle({ type: 2, object_id: info.value.id });
    console.log(res);
    console.log('👍');
  }
  const newDetail = await getArticleInfo(articleId);
  console.log(newDetail);
  info.value.praise = newDetail.data.praise;
  isThumbs.value = info.value.is_praise = newDetail.data.is_praise;
};

const isCollection = ref(false);
const collection = async () => {
  if (isCollection.value) {
    const res = await deleteCollectionByType({
      type: 2,
      object_id: info.value.id,
    });
    // const res = await deleteCollectionById(info.value.id);
    console.log(res);
    console.log('💔');
  } else {
    const res = await addCollection({ type: 2, object_id: info.value.id });
    console.log(res);
    console.log('💖');
  }
  const newDetail = await getArticleInfo(articleId);
  console.log(newDetail);
  info.value.collect = newDetail.data.collect;
  isCollection.value = info.value.is_collect = newDetail.data.is_collect;
};

const show = ref(false);

const comment = ref('');

const isHasComment = computed(() =>
  comment.value.length > 0 ? '#2ecc71' : '#ccc'
);

const addComment = async () => {
  if (!comment.value.length) return;
  console.log(comment.value);
  const res = await addCommentApi({
    type: 2,
    object_id: info.value.id,
    content: comment.value,
    // parent_id: 0,
  });
  console.log(res);
  show.value = false;
  comment.value = '';
  changeData();
  changecomData();
};
</script>

<template>
  <div class="container">
    <van-nav-bar
      :title="$route.meta.title"
      placeholder
      fixed
      left-arrow
      @click-left="$router.back()"
    />
    <div class="content">
      <van-image class="img" fit="cover" :src="info.picUrl" />
      <div class="body">
        <p class="title">{{ info.title }}</p>
        <div class="info">
          <p class="desc">{{ info.desc }}</p>
          <p class="created_time">{{ info.createdAt }}</p>
        </div>
        <div class="detail">
          {{ info.detail }}
        </div>
      </div>
    </div>
    <div class="comment" v-if="cominfo">
      <p>评论:</p>
      <div class="content_item" v-for="it in cominfo">
        <div class="user_pic">
         <img src="https://img.aigexing.com/uploads/7/1253/1120051754/9302649767/23368895.jpg"/>
        </div>
        <div class="item_left">
          <div class="user_name">
            匿名用户
<!--            {{ it.user.name }}&emsp;-->
            <span class="createdTime">{{it.created_at }}</span>
          </div>
          <div class="user_content">{{ it.content }}</div>
        </div>
      </div>
    </div>
    <div class="action_box">
      <div class="add_comment" @click="show = true">
        <van-icon name="edit" size="20px" />&nbsp;评论
      </div>
      <div class="action">
        <div class="Thumbs_action" @click="giveTheThumbsUp">
          <van-icon
            :color="isThumbs ? '#3498db' : '#767676'"
            :name="`thumb-circle${isThumbs ? '' : '-o'}`"
            :badge="info.praise || ''"
            :badge-props="{ offset: ['10px', '5px'] }"
          />
        </div>
        <!--<div class="star_action" @click="collection">
          <van-icon
            :color="isCollection ? '#f39c12' : '#767676'"
            :badge="info.collect || ''"
            :name="`star${isCollection ? '' : '-o'}`"
            :badge-props="{ offset: ['10px', '5px'] }"
          />
        </div>-->
      </div>
    </div>
    <van-popup
      class="comment_box"
      safe-area-inset-bottom
      v-model:show="show"
      position="bottom"
    >
      <div class="comment_header">
        <div>评论</div>
        <div class="left" @click="addComment">发布</div>
      </div>
      <van-field
        label-align="top"
        v-model.trim="comment"
        rows="6"
        type="textarea"
        maxlength="200"
        placeholder="请输入评论"
        show-word-limit
      />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.container {
  background-color: #fff;

  .content {
    .body {
      padding: 0 12px;
      .title {
        margin-top: 10px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
      }
      .info {
        margin-top: 10px;
        display: flex;
        color: gray;
        justify-content: space-around;
        justify-items: center;
        line-height: 100%;
        .desc {
          font-size: 14px;
        }
        .created_time {
          font-size: 14px;
        }
      }
      .detail {
        margin-top: 10px;
        text-indent: 2em;
        font-size: 16px;
        word-wrap: break-word;
        word-break: normal;
        white-space: normal;
      }
    }
  }
  .comment {
    border-top: 1px solid #ccc;
    margin-top: 10px;
    background: #f6f6f6;
    padding: 6px;
    padding-bottom: 50px;
    p {
      font-size: 16px;
    }
    .content_item {
      background: #fff;
      padding: 6px;
      display: flex;
      border-radius: 12px;
      margin-top: 12px;
      .user_pic {
        width: 42px;
        height: 42px;
        position: relative;
        img {
          width: 42px;
          height: 42px;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .item_left {
        margin-left: 10px;
        font-size: 14px;
        width: 100%;
        .user_name {
          margin-bottom: 6px;
          .createdTime {
            color: #86909c;
          }
        }
        .user_content {
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
  }
  .action_box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 42px;
    background: #fff;
    border-top: 1px solid rgb(232, 232, 232);
    box-shadow: 0px -2px 10px rgb(232, 232, 232);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .add_comment {
      width: 100%;
      padding-left: 16px;
      height: 100%;
      display: flex;
      justify-content: left;
      align-items: center;
      font-size: 14px;
      color: #767676;
      &:active {
        background: #e8e8e8;
      }
    }
    .action {
      height: 100%;
      width: 100%;
      --van-badge-color: black;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      font-size: 20px;
      color: #767676;
      div {
        display: flex;
        align-items: center;
        justify-content: left;
        padding: 6px 6px 6px 26px;
        height: 100%;
        width: 100%;
        :deep(.van-badge) {
          color: #767676;
          background-color: rgba(0, 0, 0, 0);
          border: none;
          font-size: 8px;
          font-weight: normal;
        }
        &:active {
          background: #e8e8e8;
          height: 32px;
        }
      }
    }
  }
  .comment_box {
    width: 100%;
    height: 300px;
    .comment_header {
      padding: 10px 16px 0 16px;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      .left {
        color: v-bind(isHasComment);
      }
    }
  }
}
</style>
