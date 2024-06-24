import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
  },

  {
    path: "/profile",
    component: Layout,
    redirect: "/profile/index",
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/profile/index"),
        name: "Profile",
        meta: { title: "Profile", icon: "user", noCache: true },
      },
    ],
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/editor/index"),
        name: "Dashboard",
        meta: {
          title: "数据大屏",
          icon: "dashboard",
          roles: ["/dashboard"],
        },
      },
    ],
  },
  // 首页配置路由
  {
    path: "/homepageManager",
    component: Layout,
    redirect: "/homepageManager/bannerSwiper",
    name: "homepage",
    meta: {
      title: "首页配置",
      icon: "el-icon-s-home",
      roles: ["/homepageManager"],
    },
    children: [
      {
        path: "bannerSwiper",
        name: "banner",
        component: () => import("@/views/homepageManager/bannerSwiper/index"),
        meta: {
          title: "轮播图管理",
          icon: "el-icon-picture-outline",
          roles: ["/homepageManager/bannerSwiper"],
        },
      },
      // {
      //   path: "recommend",
      //   name: "recommend",
      //   component: () => import("@/views/productManager/recommend/index"),
      //   meta: {
      //     title: "种草管理",
      //     icon: "el-icon-wallet",
      //     roles: ["/homepageManager/recommend"],
      //   },
      // },
      // {
      //   path: "evaluate",
      //   name: "evaluate",
      //   component: () => import("@/views/productManager/evaluate/index"),
      //   meta: {
      //     title: "种草评价管理",
      //     icon: "el-icon-wallet",
      //     roles: ["/productManager/evaluate"],
      //   },
      // },
    ],
  },
  {
    path: "/homepageManager",
    component: Layout,
    redirect: "/homepageManager/bannerSwiper",
    name: "homepage",
    meta: {
      title: "种草配置",
      icon: "el-icon-s-home",
      roles: ["/homepageManager"],
    },
    children: [
      {
        path: "recommend",
        name: "recommend",
        component: () => import("@/views/productManager/recommend/index"),
        meta: {
          title: "文章管理",
          icon: "el-icon-wallet",
          roles: ["/homepageManager/recommend"],
        },
      },
      {
        path: "evaluate",
        name: "evaluate",
        component: () => import("@/views/productManager/evaluate/index"),
        meta: {
          title: "种草评价管理",
          icon: "el-icon-wallet",
          roles: ["/productManager/evaluate"],
        },
      },
    ],
  },
  // 商品管理路由
  {
    path: "/productManager",
    component: Layout,
    redirect: "/productManager/productList",
    name: "productManager",
    meta: {
      title: "商品管理",
      icon: "el-icon-s-shop",
      roles: ["/productManager"],
    },
    children: [
      {
        path: "productList",
        name: "productList",
        component: () => import("@/views/productManager/productList/index"),
        meta: {
          title: "商品列表",
          icon: "el-icon-goods",
          roles: ["/productManager/productList"],
        },
      },
      {
        path: "productCategory",
        name: "productCategory",
        component: () => import("@/views/productManager/productCategory/index"),
        meta: {
          title: "商品分类",
          icon: "el-icon-document-copy",
          roles: ["/productManager/productCategory"],
        },
      },
      // {
      //   path: "productCoupons",
      //   name: "productCoupons",
      //   component: () => import("@/views/productManager/productCoupons/index"),
      //   meta: {
      //     title: "优惠券管理",
      //     icon: "el-icon-wallet",
      //     roles: ["/productManager/productCoupons"],
      //   },
      // },
      {
        path: "addDetail",
        name: "addProductDetail",
        hidden: true, // 不在左侧导航栏显示
        component: () => import("@/views/productManager/detail/index"),
        meta: {
          title: "新增商品",
          icon: "table",
          activeMenu: "/product/list",
          componentUrl: "@/views/productManager/detail/index",
          roles: ["/productManager/addDetail"],
        },
      },
      // {
      //   path: "evaluate",
      //   name: "evaluate",
      //   component: () => import("@/views/productManager/evaluate/index"),
      //   meta: {
      //     title: "种草评价管理",
      //     icon: "el-icon-wallet",
      //     roles: ["/productManager/evaluate"],
      //   },
      // },
    ],
  },
  // 订单管理路由
  {
    path: "/orderManager",
    component: Layout,
    redirect: "/orderManager/orderList",
    name: "orderManager",
    meta: {
      title: "订单管理",
      icon: "el-icon-s-order",
      roles: ["/orderManager"],
    },
    children: [
      {
        path: "orderList",
        name: "orderList",
        component: () => import("@/views/orderManager/orderList/index"),
        meta: {
          title: "订单列表",
          icon: "el-icon-document-checked",
          roles: ["/orderManager/orderList"],
        },
      },

      {
        path: "orderAddress",
        name: "orderAddress",
        component: () => import("@/views/orderManager/orderAddress/index"),
        meta: {
          title: "地址列表",
          icon: "el-icon-location-information",
          roles: ["/orderManager/orderAddress"],
        },
      },
    ],
  },
  // 权限管理路由
  {
    path: "/permissionMember",
    name: "permissionMember",
    component: Layout,
    redirect: "/userMember/orderMember",
    meta: {
      title: "权限管理",
      icon: "el-icon-key",
      roles: ["/permissionMember"],
    },
    children: [
      {
        path: "orderMember",
        name: "orderMember",
        component: () => import("@/views/userMember/orderMember/index"),
        meta: {
          title: "用户管理",
          icon: "el-icon-user",
          roles: ["/permissionMember/orderMember"],
        },
      },
      // {
      //   path: "roleManagement",
      //   name: "roleManagement",
      //   component: () => import("@/views/userMember/roleManagement/index"),
      //   meta: {
      //     title: "角色管理",
      //     icon: "el-icon-user",
      //     roles: ["/permissionMember/roleManagement"],
      //   },
      // },
      // {
      //   path: "identity",
      //   name: "identity",
      //   component: () => import("@/views/userMember/identity/index"),
      //   meta: {
      //     title: "权限管理",
      //     icon: "el-icon-user",
      //     roles: ["/permissionMember/identity"],
      //   },
      // },
      // {
      //   path: "adminManagement",
      //   name: "adminManagement",
      //   component: () => import("@/views/userMember/adminManagement/index"),
      //   meta: {
      //     title: "用户管理",
      //     icon: "el-icon-user",
      //     roles: ["/permissionMember/adminManagement"],
      //   },
      // },
    ],
  },
  // {
  //   path: "/permissionMember",
  //   name: "permissionMember",
  //   component: Layout,
  //   redirect: "/userMember/orderMember",
  //   meta: { title: "权限管理", icon: "el-icon-key" },
  //   children: [
  //     {
  //       path: "orderMember",
  //       name: "orderMember",
  //       component: () => import("@/views/userMember/orderMember/index"),
  //       meta: { title: "会员管理", icon: "el-icon-user" },
  //     },
  //     {
  //       path: "roleManagement",
  //       name: "roleManagement",
  //       component: () => import("@/views/userMember/roleManagement/index"),
  //       meta: { title: "角色管理", icon: "el-icon-user" },
  //     },
  //     {
  //       path: "identity",
  //       name: "identity",
  //       component: () => import("@/views/userMember/identity/index"),
  //       meta: { title: "权限管理", icon: "el-icon-user" },
  //     },
  //     {
  //       path: "adminManagement",
  //       name: "adminManagement",
  //       component: () => import("@/views/userMember/adminManagement/index"),
  //       meta: { title: "用户管理", icon: "el-icon-user" },
  //     },
  //   ],
  // },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
