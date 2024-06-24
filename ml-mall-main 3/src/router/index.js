import Home from '@/views/Home/index.vue';
import GoodsDetail from "@/views/Home/GoodsDetail.vue"
import { createRouter, createWebHashHistory } from 'vue-router';
import { getToken } from '@/utils/auth';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      // component: () => import('@/views/Home/index.vue'),
      meta: {
        isShowNav: true,
      },
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      // component: () => import('@/views/Home/index.vue'),
      meta: {
        isShowNav: true,
        title: '分类',
      },
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import('@/views/Recommend/index.vue'),
      meta: {
        isShowNav: true,
        login: true,
        title: '种草推荐',
      },
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('@/views/Category/list.vue'),
      meta: {
        isShowNav: true,
        login: true,
        title: '分类商品',
      },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/Cart.vue'),
      meta: {
        isShowNav: true,
        title: '购物车',
      },
    },
    {
      path: '/dazhe',
      name: 'dazhe',
      component: () => import('@/views/index2.vue'),
      meta: {
        isShowNav: true,
        title: '打折',
      },
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/User/index.vue'),
      meta: {
        isShowNav: true,
        title: '我的',
      },
    },
    {
      path: '/goods/:goodsId',
      name: 'goodsDetail',
      // component: () => import('@/views/Home/GoodsDetail.vue'),
      component: GoodsDetail,
      meta: {
        title: '商品详情',
      },
    },

    {
      path: '/edit-address',
      name: 'edit',
      component: () => import('@/views/Address/Edit.vue'),
      meta: {
        login: true,
        title: '编辑',
      },
    },
    {
      path: '/create-order',
      name: 'createOrder',
      component: () => import('@/views/Order/Create.vue'),
      meta: {
        title: '生成订单',
        login: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/User/Login.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('@/views/Order/index.vue'),
      meta: {
        title: '我的订单',
        login: true,
      },
    },
    {
      path: '/thumbs-up',
      name: 'ThumbsUp',
      component: () => import('@/views/User/ThumbsUp.vue'),
      meta: {
        title: '我的点赞',
        login: true,
      },
    },
    {
      path: '/article-detail',
      name: 'articleDetail',
      component: () => import('@/views/Recommend/Detail.vue'),
      meta: {
        login: true,
        title: '文章详情',
      },
    },
    {
      path: '/add-article',
      name: 'addArticle',
      component: () => import('@/views/Recommend/Create.vue'),
      meta: {
        login: true,
        title: '新增文章',
      },
    },
    {
      path: '/my-article',
      name: 'myArticle',
      component: () => import('@/views/Recommend/MyArticle.vue'),
      meta: {
        login: true,
        title: '我的文章',
      },
    },
    {
      path: '/my-collection',
      name: 'myCollection',
      component: () => import('@/views/User/Collection.vue'),
      meta: {
        login: true,
        title: '我的收藏',
      },
    },
    {
      path: '/user-info',
      name: 'userInfo',
      component: () => import('@/views/User/Info.vue'),
      meta: {
        login: true,
        title: '个人信息',
      },
    },
    {
      path: '/edit-pwd',
      name: 'editPwd',
      component: () => import('@/views/User/EditPwd.vue'),
      meta: {
        login: true,
        title: '修改密码',
      },
    },
    {
      path: '/address-list',
      name: 'addressList',
      component: () => import('@/views/Address/index.vue'),
      meta: {
        login: true,
        title: '收货地址',
      },
    },
    // 访问没有的路由直接跳往首页
    {
      path: '/:toHome*',
      name: 'toHome',
      redirect: '/home',
    },
  ],
});

export default router;

router.beforeEach((to, from, next) => {
  NProgress.start();
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: from.path });
    }
  } else {
    if (to.meta.login) {
      return next({ path: '/login' });
    }
  }
  return next();
});

router.afterEach(() => {
  NProgress.done();
});
