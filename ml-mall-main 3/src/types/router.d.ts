import 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 表示Tabbar是否显示
     * @default undefined
     */
    isShowNav?: boolean;
    /**
     * @description 当前页面标题
     * @default undefined
     */
    title?: string;
    /**
     * @description 是否必须登录
     * @default undefined
     */
    login?: boolean;
  }
}
