# full-stack-mall

## 前端商城项目

### 目录
- [full-stack-mall](#full-stack-mall)
  - [前端商城项目](#前端商城项目)
    - [目录](#目录)
    - [项目简介](#项目简介)
    - [功能特点](#功能特点)
    - [技术栈](#技术栈)
    - [项目结构](#项目结构)
    - [安装与运行](#安装与运行)
      - [环境要求](#环境要求)
      - [安装依赖](#安装依赖)
      - [启动开发服务器](#启动开发服务器)
      - [打包构建](#打包构建)
    - [环境配置](#环境配置)
    - [组件和插件](#组件和插件)
    - [代码规范](#代码规范)
  - [贡献指南](#贡献指南)

### 项目简介
这是商城项目的前端部分，使用 Vue 3 和 Vite 构建，UI 库使用 Vant，并采用 Pinia 进行状态管理。项目旨在提供一个功能全面、用户体验良好的前端界面。

### 功能特点
- **商品展示**：包括商品的分类浏览、搜索、筛选等功能。
- **购物车**：添加商品到购物车、修改商品数量、删除商品等。
- **订单管理**：用户可以查看和管理自己的订单。
- **用户管理**：包括用户注册、登录和个人信息维护。
- **响应式设计**：支持移动端和桌面端访问，保证在不同设备上的良好体验。

### 技术栈
- **框架**：Vue 3
- **构建工具**：Vite
- **UI 库**：Vant
- **状态管理**：Pinia
- **路由**：Vue Router
- **HTTP 请求**：Axios

### 项目结构
```tree

```

### 安装与运行

#### 环境要求
- Node.js 20.x 或更高版本
- npm 或 yarn 包管理工具

#### 安装依赖
> 在一个前端项目中切记不要同时使用多种包管理工具

```sh
# 使用 npm
npm install

# 或者使用 yarn
yarn install
```

#### 启动开发服务器
```sh
# 使用 npm
npm run dev

# 或者使用 yarn
yarn dev
```
#### 打包构建
```sh
# 使用 npm
npm run build

# 或者使用 yarn
yarn build
```
### 环境配置
前端项目的环境变量存储在根目录的 `.env` 文件中。你可以创建不同的 `.env` 文件来适应不同的环境，例如 `.env.development`、`.env.production` 等。
```sh
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Mall
```

### 组件和插件
[Vant](https://vant-ui.github.io/vant/#/zh-CN) UI：我们使用 Vant UI 组件库来构建响应式和用户友好的界面。详细的组件用法可以参考 Vant 官方文档。

[Pinia](https://pinia.vuejs.org/zh/)：Pinia 作为 Vue 3 的官方状态管理库，提供了简单和类型安全的 API。更多信息请参考 Pinia 官方文档。

[Axios](https://axios-http.com/docs/intro)：用于与后端 API 进行 HTTP 通信。你可以在 src/services 目录下找到具体的封装和使用方式。

### 代码规范
我们推荐使用 ESLint 和 Prettier 来保证代码的风格一致。可以在 package.json 中找到相关的配置和脚本。
```json
"scripts": {
    "lint": "eslint --ext .js,.vue src",
    "format": "prettier --write src/**/*.{js,vue}"
}
```

## 贡献指南
欢迎任何形式的贡献！你可以通过以下方式参与项目：

提交 Issue 报告 Bug 或建议新的功能。
提交 Pull Request 修复问题或添加新功能。
提交代码时，请遵循项目的代码规范和提交信息格式。