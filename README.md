# Claude Vue

基于 Vue 3 的企业级后台管理系统模板，集成了现代前端开发所需的完整工具链。

## 功能特性

- 登录/登出，JWT Token 自动刷新
- 基于角色的权限控制（RBAC），支持指令级权限（`v-permission`、`v-role`）
- 用户管理（列表、分页、信息展示）
- 数据看板（统计卡片）
- 亮色 / 暗色 / 跟随系统主题切换，支持自定义主色调
- 中英文国际化（i18n）
- 侧边栏折叠、标签页管理
- 路由守卫（鉴权、权限校验、页面标题自动生成）
- 请求重试、重复请求取消、全局错误处理

## 技术栈

| 类别     | 技术                                           |
| -------- | ---------------------------------------------- |
| 前端框架 | Vue 3.5（Composition API + `<script setup>`）  |
| 构建工具 | Vite 5                                         |
| 类型系统 | TypeScript 5.6（strict 模式）                  |
| 状态管理 | Pinia 2 + pinia-plugin-persistedstate          |
| 数据请求 | TanStack Vue Query 5 + Axios 1.7 + axios-retry |
| CSS 方案 | UnoCSS + SCSS                                  |
| 图标     | Iconify + Lucide                               |
| 工具库   | VueUse、dayjs、lodash-es                       |
| 路由     | Vue Router 4                                   |
| 单元测试 | Vitest 2 + @vue/test-utils + MSW               |
| E2E 测试 | Playwright 1.48                                |
| 代码规范 | ESLint 9 + Prettier 3                          |
| Git 规范 | Husky + lint-staged + commitlint + Commitizen  |

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

默认运行在 `http://localhost:5176`，开发环境默认启用 MSW Mock API。

### 其他命令

```bash
pnpm build          # 生产环境构建（含类型检查）
pnpm build:staging  # Staging 环境构建
pnpm preview        # 预览生产构建产物

pnpm lint           # ESLint 自动修复
pnpm lint:check     # ESLint 仅检查（不修改文件）
pnpm format         # Prettier 格式化
pnpm format:check   # Prettier 仅检查

pnpm type-check     # vue-tsc 类型检查

pnpm test:unit          # 运行单元测试
pnpm test:unit:watch    # 单元测试监听模式
pnpm test:coverage      # 生成覆盖率报告

pnpm test:e2e       # 运行 E2E 测试
pnpm test:e2e:ui    # E2E 测试可视化界面

pnpm commit         # 使用 Commitizen 交互式提交
```

## 环境变量

| 变量                | 说明           | 默认值（开发）          |
| ------------------- | -------------- | ----------------------- |
| `VITE_APP_TITLE`    | 应用标题       | `Vue Enterprise App`    |
| `VITE_APP_VERSION`  | 应用版本       | `1.0.0`                 |
| `VITE_API_BASE_URL` | API 基础地址   | `http://localhost:3000` |
| `VITE_API_PREFIX`   | API 路径前缀   | `/api`                  |
| `VITE_API_TIMEOUT`  | 请求超时（ms） | `15000`                 |
| `VITE_PORT`         | 开发服务器端口 | `5176`                  |
| `VITE_ENABLE_MOCK`  | 是否启用 Mock  | `true`                  |
| `VITE_ANALYZE`      | 是否开启包分析 | `false`                 |

各环境配置文件：`.env.development` / `.env.staging` / `.env.production`

## 项目结构

```
src/
├── api/              # HTTP 请求层（axios 实例、拦截器、错误类、Query Key）
│   ├── modules/      # 各模块 API（auth 等）
│   └── types/        # API 类型定义
├── assets/           # 静态资源（样式、字体、图标、图片）
├── components/
│   ├── base/         # 通用基础组件（ErrorBoundary 等）
│   ├── business/     # 业务组件
│   └── layout/       # 布局组件
├── composables/
│   ├── core/         # 通用 composables（useForm、useTable、usePermission 等）
│   ├── queries/      # Vue Query hooks
│   └── business/     # 业务 composables
├── directives/       # 自定义指令（v-permission、v-role、v-loading）
├── layouts/          # 页面布局模板（DefaultLayout）
├── locales/          # i18n 语言包（zh、en）
├── pages/            # 页面组件
│   ├── auth/         # 登录页
│   ├── dashboard/    # 看板、用户列表
│   └── error/        # 403、404、500 错误页
├── plugins/          # Vue 插件（错误监控、queryClient）
├── router/           # 路由配置及守卫
├── stores/           # Pinia Store（auth、app、tabs）
├── types/            # 全局 TypeScript 类型
└── utils/            # 工具函数（加密、日期、DOM、格式化、存储、校验）
tests/
├── unit/             # Vitest 单元测试
└── e2e/              # Playwright E2E 测试
```

## 提交规范

项目使用 Conventional Commits 规范，提交格式：

```
<type>: <subject>
```

常用 type：`feat` / `fix` / `chore` / `refactor` / `test` / `docs`

推荐使用 `pnpm commit` 交互式填写。

## 测试覆盖率要求

- 分支覆盖率 >= 70%
- 函数 / 行覆盖率 >= 80%
