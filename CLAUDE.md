# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 沟通规则

- 所有回答必须使用中文

## 项目概述

基于 **Taro 4.2 + Vue 3 + NutUI + TypeScript** 的微信小程序，涵盖开发端、运营端、销售端、老板端四个角色。

## 常用命令

```bash
# 开发（微信小程序，watch 模式）
npm run dev:weapp

# 生产构建（微信小程序）
npm run build:weapp

# 其他平台构建
npm run build:h5        # H5
npm run build:alipay    # 支付宝小程序
```

构建产物输出到 `dist/` 目录，在微信开发者工具中导入该目录即可预览。

## 核心架构

### 路由系统

页面路由在 [src/app.config.ts](src/app.config.ts) 中声明：

- **主包**：`pages/login/index` — 登录页
- **开发端子包** `subpackages/dev/`：首页、线索、商机、客户、报价、合同、我的（含通知、产品、订单、报销、费用、绩效等子页面）
- **运营端子包** `subpackages/ops/`：首页、线索、内容、我的（含素材）
- **老板端子包** `subpackages/boss/`：各端概览页、我的

路径别名 `@/` 映射到 `src/`。

### 认证与权限

1. 登录流程：`login()` → 存储 token/userInfo/permissions 到本地 → 根据权限判断角色 → 跳转到对应首页
2. 角色检测逻辑在 [src/utils/role.ts](src/utils/role.ts)，通过权限列表中是否包含 `boss`/`ops`/`sales` 关键词来判断
3. HTTP 请求（[src/utils/request.ts](src/utils/request.ts)）自动附加 `Authorization: Bearer <token>` 头，401 时自动清空登录态并跳回登录页
4. 自动登录：App 启动时（`onShow`）如果本地有 token，调用 `/auth/me` 校验并恢复会话

### API 层

- [src/utils/request.ts](src/utils/request.ts) — 通用请求封装（`get`/`post`），处理 401 拦截和错误统一返回
- [src/api/](src/api/) — 按业务模块拆分的 API 调用：`auth.ts`、`lead.ts`、`customer.ts`、`reporting.ts`、`system.ts`
- API 基础地址通过 `TARO_APP_API_BASE` 常量注入（构建时由 `defineConstants` 定义），当前为 `http://124.223.105.21:8080/api`

### 本地存储

[src/utils/storage.ts](src/utils/storage.ts) 封装了 `Taro.getStorageSync/setStorageSync`，管理 token、用户信息、权限、记住密码等功能。

### UI 框架

- **NutUI** (`@nutui/nutui-taro`)：组件库，设计稿按 375 宽度
- **Taro 默认**：设计稿按 750 宽度
- 通过 `unplugin-vue-components` 实现 NutUI 组件按需自动导入（见 [components.d.ts](components.d.ts)）
- 样式使用 SCSS，尺寸单位使用 `rpx`

### 目录结构

```
src/
├── app.config.ts    # 路由/分包/窗口配置
├── app.ts           # 入口：注册 NutUI 组件 + 自动登录
├── app.scss         # 全局样式
├── api/             # API 接口（按模块：auth, lead, customer, reporting, system）
├── assets/          # 静态资源（图片按页面分包存放）
├── components/      # 公共组件
├── pages/           # 主包页面（login）
├── subpackages/     # 分包页面（dev/ops/boss）
│   ├── dev/          # 开发端
│   ├── ops/          # 运营端
│   └── boss/         # 老板端
└── utils/           # 工具函数（request, storage, role）
config/              # Taro 构建配置（dev/prod/index）
types/               # 全局类型声明
```

### 构建配置要点

- 设计宽度：全局 750，NutUI 组件 375（[config/index.ts:14-21](config/index.ts#L14-L21)）
- Webpack5 构建，`@/` 别名通过 `webpackChain` 和 `tsconfig-paths-webpack-plugin` 解决（[config/index.ts:67-68](config/index.ts#L67-L68)）
- `TARO_APP_API_BASE` 通过 `defineConstants` 在 webpack 编译时替换（[config/index.ts:32](config/index.ts#L32)）
