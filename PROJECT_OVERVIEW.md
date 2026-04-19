# ARK 项目全面分析文档

> 生成时间：2026-03-10
> 项目路径：/Users/bingguner/project/ark
> 文档版本：v1.0

---

## 目录

- [项目概述](#项目概述)
- [项目规模](#项目规模)
- [项目架构](#项目架构)
- [技术栈详解](#技术栈详解)
- [核心功能模块](#核心功能模块)
- [配置文件说明](#配置文件说明)
- [构建与部署](#构建与部署)
- [项目特点](#项目特点)
- [开发规范](#开发规范)
- [快速开始](#快速开始)
- [关键路径参考](#关键路径参考)

---

## 项目概述

**ARK（方舟）** 是一个功能完整的**企业级低代码平台**，采用 **pnpm Monorepo** 架构。项目提供从可视化编辑器到后端服务的完整低代码解决方案，支持微前端架构，适用于企业内部 SaaS 应用、数据可视化平台、表单驱动的业务系统等场景。

### 项目定位

- **类型**：Monorepo 低代码平台
- **包管理器**：pnpm >=3
- **主要语言**：TypeScript、JavaScript
- **前端框架**：Vue 2.x & Vue 3.x（双版本支持）
- **后端框架**：Egg.js、Midway.js
- **发布范围**：@jv/* (内部 npm 仓库)

---

## 项目规模

| 指标 | 数值 |
|------|------|
| 源代码文件 | 3,832 个 |
| Git 提交记录 | 7,510 条 |
| 活跃分支 | 100+ 个 |
| 发布包数量 | 13 个 |
| 应用数量 | 7 个 |
| 总体积 | 约 2.1 GB |
| 最大包 | low-code-creator (43MB) |
| Node.js 版本要求 | >=14.0.0 |

---

## 项目架构

### 目录结构

```
ark/
├── apps/                      # 完整 Web 应用服务（7个应用）
│   ├── LowCodeServer/         # 低代码服务器（核心应用，1.2GB）
│   │   ├── app/               # Egg.js 应用代码
│   │   ├── config/            # 服务配置
│   │   ├── web/               # 前端资源
│   │   └── package.json       # 端口: 8082
│   ├── cloud-component/       # 云端组件系统（Midway 框架）
│   ├── geyes/                 # 报表系统（Egg + Vue3 + ECharts）
│   ├── create-server/         # 可视化管理端服务（769MB）
│   ├── content-system/        # 内容管理系统
│   ├── ic-data-manage-system/ # 数据源管理服务
│   └── customer/              # 客户管理系统
│
├── packages/                  # 公共模块库（13个发布包）
│   ├── low-code-creator/      # 低代码编辑器（Vue3，43MB）
│   │   ├── src/
│   │   │   ├── editor/        # 编辑器核心
│   │   │   ├── domain/        # Domain 层
│   │   │   └── components/    # 编辑器组件
│   │   └── package.json       # @jv/low-code-creator
│   │
│   ├── low-code-creator-vue2/ # Vue2 版本编辑器（27MB）
│   ├── ark-component/         # 组件库主模块
│   ├── jt-ui/                 # 企业级 UI 组件库（13MB）
│   │   ├── src/components/    # 110+ 组件
│   │   ├── theme-chalk/       # 主题样式
│   │   └── directives/        # 自定义指令
│   │
│   ├── jt-formily/            # Formily 表单解决方案（4.5MB）
│   ├── jt-request/            # HTTP 请求库（Axios 封装）
│   ├── ark-util/              # 通用工具函数库
│   ├── postmessage-channel/   # PostMessage 通信库
│   ├── low-code-ui/           # 低代码 UI 库
│   ├── jt-ui-icons/           # 图标库
│   ├── wujie-vue/             # 微前端框架（无界）
│   └── cli/                   # 脚手架命令行工具
│
├── features/                  # 内部特性模块
│   └── ark-component-template/ # 组件模板
│
├── examples/                  # Demo 示例与测试
├── config/                    # 工作空间和构建配置
├── pnpm-workspace.yaml        # pnpm 工作空间配置
├── package.json               # 根 package.json
├── tsconfig.json              # TypeScript 全局配置
└── README.md                  # 项目说明
```

### Monorepo 工作空间配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'features/*'
  - 'examples/*'
```

---

## 技术栈详解

### 前端技术栈

#### 核心框架
- **Vue 2.x** - 兼容版本支持
- **Vue 3.x** (^3.2.x) - 主要开发版本
- **Vue Router** (v4.x)
- **Vuex** (v4.0.2) / **Pinia** (v2.0.16) - 状态管理

#### UI 组件库
- **Element Plus** (v1.1.0-beta.19+) - 主要 UI 库
- **Vant** (v3.1.1) - 移动端组件
- **@jv/jt-ui** - 自研企业级 UI 库（110+ 组件）

#### 表单解决方案
- **Formily** (v2.2.6) - 表单引擎
- **@jv/jt-formily** - Formily 二次开发

#### 工具库
- **VueUse** (v7-9.13.0) - Vue 组合式 API 工具
- **Lodash** (v4.17.21) - 工具函数
- **Ramda** (v0.28.0) - 函数式编程
- **Day.js** (v1.11.2) - 日期处理
- **Axios** (0.27.2) - HTTP 客户端

#### 微前端
- **Wujie（无界）** (v1.0.0-rc.24) - 微前端框架
- **@jv/postmessage-channel** - 跨窗口通信

#### 富文本与可视化
- **Quill** - 富文本编辑器
- **html2canvas** - 截图功能
- **ECharts** - 数据可视化（Geyes 应用）

### 后端技术栈

#### 应用框架
- **Egg.js** (v2.29.4) - 主要后端框架
- **Midway.js** (v3.2.x) - 现代 Serverless 框架
- **Koa** - 中间件生态

#### 数据库与 ORM
- **TypeORM** - ORM 框架
- **MySQL** - 关系型数据库
- **Redis** (egg-redis) - 缓存

#### 微服务
- **TARS RPC** - 腾讯微服务框架
- **@jv/tars-deploy** - 部署工具

### 构建工具链

#### 编译工具
- **TypeScript** (v4.6.2 - 4.7.4)
- **Babel 7** (@babel/core, @babel/preset-env)
- **esbuild** - 快速构建

#### 打包工具
- **Rollup** (v2.70.1+) - 库打包
- **Webpack 5** - 应用打包
- **Vite** (v2.6.14+) - 现代开发工具
- **easywebpack** - Egg 框架集成

#### 样式处理
- **Sass/SCSS** (v1.32.7+)
- **PostCSS**
- **Normalize.css**

### 开发工具

#### 代码质量
- **ESLint** (v7-8.22.0)
- **Prettier** (2.2.1-2.6.2)
- **Husky** (v7-8.0.1) - Git Hooks
- **lint-staged** - 暂存区检查

#### 测试框架
- **Jest** (v26-29.3.1) - 单元测试
- **@vue/test-utils** (v2.0.0) - Vue 测试
- **Vitest** (v0.13.0) - Vite 测试工具

#### 文档系统
- **VuePress** (v1.9.7)
- **VitePress** (v0.20.1+, v1.0.0-alpha.4)

#### 版本管理
- **Changesets** (@changesets/cli v2.21.1)
- **Commitizen** - 提交规范
- **cz-customizable** - 自定义提交

---

## 核心功能模块

### 1. Low Code Creator（低代码编辑器）

**位置**: `packages/low-code-creator/`

#### 核心功能
- **可视化编辑器** - 拖拽式页面搭建
- **组件库面板** - 组件选择与配置
- **属性编辑器** - 动态属性配置
- **预览系统** - 实时预览（IframePreview）
- **Schema 管理** - 页面配置序列化

#### Domain 层架构
```
src/domain/
├── ProjectDomain.ts       # 项目管理
├── EditorDomain.ts        # 编辑器状态
├── H5ProjectDomain.ts     # H5 项目
├── ComponentDomain.ts     # 组件管理
└── eventRegistry.ts       # 事件注册系统
```

#### 两个版本
- **Vue 3 版本** (`@jv/low-code-creator`) - 主版本
- **Vue 2 版本** (`@jv/low-code-creator-vue2`) - 兼容版本

### 2. LowCodeServer（低代码服务器）

**位置**: `apps/LowCodeServer/`

#### 技术架构
- **框架**: Egg.js (端口 8082)
- **前后端分离**: web 目录存放前端资源
- **数据库**: TypeORM + MySQL
- **缓存**: Redis

#### 核心服务
- **项目管理** - CRUD、版本控制
- **Schema 存储** - 页面配置持久化
- **组件定义** - 组件元数据管理
- **权限控制** - 用户访问控制
- **适配器系统** - 多系统适配（jt、cicc）

#### 目录结构
```
LowCodeServer/
├── app/
│   ├── controller/        # 控制器
│   ├── service/           # 业务逻辑
│   ├── model/             # 数据模型
│   └── middleware/        # 中间件
├── config/
│   ├── config.default.js  # 默认配置
│   └── plugin.js          # 插件配置
└── web/                   # 前端资源
```

### 3. JT-UI（企业级 UI 库）

**位置**: `packages/jt-ui/`

#### 组件数量
- **110+ 组件** - 基于 Element Plus 二次开发
- **主题系统** - theme-chalk 独立包
- **指令库** - 自定义 Vue 指令
- **Hooks 库** - 组合式 API 工具

#### 模块划分
```
jt-ui/
├── src/components/        # 组件源码
│   ├── button/
│   ├── input/
│   ├── table/
│   └── ...
├── theme-chalk/           # SCSS 样式
├── directives/            # 自定义指令
├── hooks/                 # Composition API
└── locale/                # 国际化
```

#### 构建输出
- **ESM** - ES Module 格式
- **CJS** - CommonJS 格式
- **UMD** - 浏览器直接引用

### 4. Formily 表单解决方案

**位置**: `packages/jt-formily/`

#### 核心能力
- **Schema 驱动** - JSON Schema 表单配置
- **复杂表单** - 联动、校验、异步数据
- **自定义组件** - 扩展表单组件
- **响应式** - 表单状态管理

#### 依赖版本
- @formily/core: ^2.2.6
- @formily/vue: ^2.2.6
- @formily/element: 表单组件适配

### 5. 微前端系统

**位置**: `packages/wujie-vue/`

#### 技术方案
- **框架**: Wujie (v1.0.0-rc.24)
- **隔离方案**: WebComponent + iframe
- **通信机制**: PostMessage (@jv/postmessage-channel)

#### 通信模式
```javascript
// 主应用向子应用通信
postmessageChannel.send('childApp', { type: 'action', data: {} })

// 子应用向主应用通信
postmessageChannel.send('parent', { type: 'event', data: {} })
```

### 6. Geyes 报表系统

**位置**: `apps/geyes/`

#### 技术栈
- **前端**: Vue 3 + ECharts + Element Plus
- **后端**: Egg.js
- **数据库**: Elasticsearch + MySQL

#### 功能特性
- **数据可视化** - 多种图表类型
- **数据导出** - Excel (xlsx)
- **报表配置** - 可视化配置界面

### 7. Cloud Component（云端组件）

**位置**: `apps/cloud-component/`

#### 技术架构
- **框架**: Midway.js (v3.2.x)
- **存储**: 组件版本管理
- **CDN**: 组件资源分发

#### 核心功能
- **动态组件加载** - 运行时加载远程组件
- **版本管理** - 组件版本控制
- **依赖管理** - 组件依赖解析

### 8. CLI 脚手架工具

**位置**: `packages/cli/`

#### 命令列表
```bash
jv create <project-name>   # 创建项目
jv add <component>         # 添加组件
jv template list           # 查看模板列表
jv template download       # 下载模板
```

---

## 配置文件说明

### 根目录配置

#### package.json
```json
{
  "name": "ark-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "dev": "pnpm --filter <package> dev",
    "build": "pnpm -r build",
    "lint": "eslint .",
    "test": "jest"
  }
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["ES2020", "DOM"]
  }
}
```

#### .npmrc
```
shamefully-hoist=true
registry=http://npm.jintengoa.com/
```

#### .prettierrc.js
```javascript
module.exports = {
  printWidth: 80,
  tabWidth: 4,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'none'
}
```

### 包级别配置

#### Rollup 配置示例
```javascript
// packages/*/build/rollup.config.js
export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.esm.js', format: 'es' },
    { file: 'dist/index.cjs.js', format: 'cjs' },
    { file: 'dist/index.umd.js', format: 'umd' }
  ],
  plugins: [
    typescript(),
    babel(),
    resolve(),
    commonjs()
  ]
}
```

---

## 构建与部署

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm --filter @jv/low-code-creator dev

# 启动 LowCodeServer
cd apps/LowCodeServer
npm run dev

# 同时启动多个服务
pnpm --parallel run dev
```

### 构建流程

#### 库打包（packages）
```bash
# 单个包构建
cd packages/low-code-creator
npm run build

# 构建步骤：
# 1. build:index  - Rollup 打包主入口
# 2. build:es     - Babel 转译 ES Module
# 3. build:types  - 生成 TypeScript 类型
```

#### 应用打包（apps）
```bash
# LowCodeServer 构建
cd apps/LowCodeServer
npm run build       # 完整构建
npm run build:vue   # 仅构建前端
npm run tsc         # 仅构建后端
```

### 发布流程

#### 使用 Changesets
```bash
# 1. 创建变更记录
npm run change
# 选择变更类型: patch | minor | major

# 2. 版本升级
npm run version-packages

# 3. 发布（自动发布到内部 npm）
npm run publish-packages
```

#### Beta 发布
```bash
npm run pub-beta    # 发布 beta 版本
```

### 部署架构

#### TARS 部署
```bash
# LowCodeServer 部署到 TARS
cd apps/LowCodeServer
npm run deploy

# 使用 @jv/tars-deploy 工具
# 自动打包、上传、发布
```

#### Docker 部署（如支持）
```bash
# 构建镜像
docker build -t ark/low-code-server .

# 运行容器
docker run -p 8082:8082 ark/low-code-server
```

---

## 项目特点

### 架构设计

#### Domain-Driven Design (DDD)
```
编辑器采用 DDD 分层架构：
- Domain 层: ProjectDomain, EditorDomain 等
- Service 层: 业务逻辑服务
- Component 层: UI 组件
```

#### Event-Driven Architecture
```javascript
// 事件注册与监听
eventRegistry.register('component:change', handler)
eventRegistry.emit('component:change', payload)
```

#### Adapter 模式
```javascript
// 支持多系统适配
adapters/
├── jt-adapter.js      # 集团系统适配
├── cicc-adapter.js    # 中信建投适配
└── default-adapter.js
```

### 设计模式应用

1. **单例模式** - ProjectDomain 全局实例
2. **观察者模式** - 事件系统
3. **策略模式** - Adapter 适配器
4. **工厂模式** - 组件创建
5. **代理模式** - PostMessage 通信

### 技术亮点

- ✅ **完整低代码平台** - 编辑器到运行时的完整链路
- ✅ **多版本支持** - Vue 2/3 双版本维护
- ✅ **微前端架构** - 应用隔离与通信
- ✅ **Schema 驱动** - 配置化、低代码化
- ✅ **企业级特性** - 权限、多租户、日志
- ✅ **组件库完善** - 110+ 企业级组件
- ✅ **TypeScript** - 类型安全
- ✅ **Monorepo** - 统一管理多包

---

## 开发规范

### Git 提交规范

#### Commitizen 配置
```bash
# 使用 git cz 代替 git commit
git add .
git cz

# 提交类型选择：
# feat:     新功能
# fix:      Bug 修复
# docs:     文档变更
# style:    代码格式
# refactor: 重构
# test:     测试
# chore:    构建/工具变更
```

#### 提交消息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

示例：
```
feat(editor): 添加组件拖拽功能

- 实现组件拖拽逻辑
- 添加拖拽预览效果
- 优化拖拽性能

Closes #123
```

### 代码规范

#### ESLint 规则
- 基于 `eslint-config-egg`
- TypeScript 支持
- Vue 3 规则

#### Prettier 规则
```javascript
{
  printWidth: 80,        // 每行最大长度
  tabWidth: 4,           // 缩进空格数
  semi: false,           // 不使用分号
  singleQuote: true,     // 使用单引号
  trailingComma: 'none'  // 不使用尾随逗号
}
```

### 分支管理

#### 分支命名规范
```
master              # 主分支
release-*           # 发布分支
feature/*           # 功能分支
fix/*               # 修复分支
hotfix/*            # 紧急修复
```

#### 工作流程
```bash
# 1. 从 master 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git cz

# 3. 推送到远程
git push origin feature/new-feature

# 4. 创建 Merge Request
# 5. Code Review
# 6. 合并到 master
```

### 版本管理

#### 语义化版本（Semver）
```
<major>.<minor>.<patch>-<prerelease>

示例：
1.0.0         # 正式版本
1.0.0-beta.1  # Beta 版本
1.0.0-alpha.1 # Alpha 版本
```

#### 版本升级规则
- **major**: 不兼容的 API 变更
- **minor**: 向后兼容的功能新增
- **patch**: 向后兼容的问题修复

---

## 快速开始

### 环境准备

```bash
# Node.js 版本
node -v   # >= 14.0.0 (推荐 14.17.0)

# 安装 pnpm
npm install -g pnpm

# 验证 pnpm
pnpm -v   # >= 3.0.0
```

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd ark

# 安装所有依赖
pnpm install

# 或安装特定包的依赖
pnpm --filter @jv/low-code-creator install
```

### 开发调试

#### 启动低代码编辑器
```bash
cd packages/low-code-creator
pnpm dev

# 访问 http://localhost:3000
```

#### 启动低代码服务器
```bash
cd apps/LowCodeServer
pnpm dev

# 前端: http://localhost:8082
# API: http://localhost:8082/api
```

#### 启动报表系统
```bash
cd apps/geyes
pnpm dev
```

### 构建生产版本

```bash
# 构建所有包
pnpm -r build

# 构建特定包
pnpm --filter @jv/low-code-creator build

# 构建特定应用
pnpm --filter LowCodeServer build
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm --filter @jv/jt-ui test

# 运行测试并生成覆盖率报告
pnpm test -- --coverage
```

### 常用命令

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm typecheck

# 清理构建产物
pnpm clean

# 查看依赖关系
pnpm list --depth=0

# 更新依赖
pnpm update
```

---

## 关键路径参考

### 核心代码路径

| 功能模块 | 路径 |
|---------|------|
| 低代码编辑器核心 | `/packages/low-code-creator/src/editor` |
| 编辑器 Domain 层 | `/packages/low-code-creator/src/domain` |
| 低代码服务器 | `/apps/LowCodeServer/app` |
| 服务器配置 | `/apps/LowCodeServer/config` |
| UI 组件库 | `/packages/jt-ui/src/components` |
| UI 主题样式 | `/packages/jt-ui/theme-chalk` |
| Formily 表单 | `/packages/jt-formily/src` |
| 微前端框架 | `/packages/wujie-vue/src` |
| PostMessage 通信 | `/packages/postmessage-channel/src` |
| 脚手架工具 | `/packages/cli/bin/jv.js` |
| 工具函数库 | `/packages/ark-util/src` |
| HTTP 请求库 | `/packages/jt-request/src` |
| 报表系统 | `/apps/geyes` |
| 云端组件 | `/apps/cloud-component` |

### 配置文件路径

| 配置类型 | 路径 |
|---------|------|
| Monorepo 工作空间 | `/pnpm-workspace.yaml` |
| 根 package.json | `/package.json` |
| TypeScript 配置 | `/tsconfig.json` |
| ESLint 配置 | `/.eslintrc.js` |
| Prettier 配置 | `/.prettierrc.js` |
| Git Hooks | `/.husky/` |
| npm 配置 | `/.npmrc` |
| Rollup 构建配置 | `/packages/*/build/rollup.config.js` |
| Webpack 配置 | `/apps/*/webpack.config.js` |

### 文档路径

| 文档类型 | 路径 |
|---------|------|
| 项目 README | `/README.md` |
| 组件文档 | `/packages/jt-ui/docs` |
| API 文档 | VuePress/VitePress 配置 |
| 变更日志 | `/CHANGELOG.md` (如存在) |

---

## 项目适用场景

### 应用场景

1. **企业内部 SaaS 应用**
   - 快速搭建管理后台
   - 数据录入系统
   - 审批流程系统

2. **低代码平台开发**
   - 可视化页面搭建
   - 表单驱动的业务系统
   - 配置化应用生成

3. **数据可视化平台**
   - 报表系统
   - 数据大屏
   - BI 分析工具

4. **内容管理系统（CMS）**
   - 文章发布
   - 多媒体管理
   - 内容审核

5. **微前端应用**
   - 多团队协作
   - 应用隔离
   - 独立部署

### 技术优势

- **快速开发** - 低代码编辑器大幅提升开发效率
- **可扩展性** - Monorepo 架构便于扩展新功能
- **代码复用** - 组件库与工具库统一管理
- **类型安全** - TypeScript 全覆盖
- **企业级** - 完善的权限、日志、监控系统
- **微前端** - 支持大型应用拆分

---

## 贡献指南

### 开发流程

1. **Fork 项目** (如适用)
2. **创建功能分支**: `git checkout -b feature/amazing-feature`
3. **提交变更**: `git cz`
4. **推送分支**: `git push origin feature/amazing-feature`
5. **创建 Merge Request**

### 代码审查

- 至少 1 人 Code Review
- 通过所有 CI 检查
- 测试覆盖率不低于 80%

### 发布流程

1. 运行 `npm run change` 创建变更记录
2. 运行 `npm run version-packages` 升级版本
3. 合并到 master 分支
4. 自动发布到内部 npm 仓库

---

## 常见问题（FAQ）

### Q: 如何添加新组件到 jt-ui？

```bash
cd packages/jt-ui
mkdir src/components/my-component
# 创建 index.ts, component.vue
# 在 src/components/index.ts 中导出
pnpm build
```

### Q: 如何在 low-code-creator 中添加新 Domain？

```typescript
// packages/low-code-creator/src/domain/MyDomain.ts
export class MyDomain {
  constructor() {
    // 初始化逻辑
  }
}

// 在 editor 中使用
import { MyDomain } from '@/domain/MyDomain'
```

### Q: 如何配置 LowCodeServer 数据库？

```javascript
// apps/LowCodeServer/config/config.default.js
config.mysql = {
  client: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'lowcode'
  }
}
```

### Q: 如何发布 Beta 版本？

```bash
cd packages/low-code-creator
npm run pub-beta
# 版本号会自动添加 -beta.x 后缀
```

---

## 相关链接

- **内部 npm 仓库**: http://npm.jintengoa.com/
- **Git 仓库**: (内部 GitLab 地址)
- **文档中心**: (VuePress 文档地址)
- **JIRA**: (项目管理地址)

---

## 许可证

(根据实际情况填写)

---

## 附录

### 技术术语表

- **Monorepo**: 单一仓库管理多个包的项目结构
- **pnpm**: 高效的 Node.js 包管理器
- **DDD**: Domain-Driven Design，领域驱动设计
- **Schema**: 配置化数据结构
- **TARS**: 腾讯微服务框架
- **Wujie**: 无界微前端框架
- **Formily**: 阿里表单解决方案

### 版本历史

- **v0.0.87**: 最新版本（2026-01）
- **v0.0.83**: 稳定版本
- **v0.0.83-beta.1**: Beta 测试版本

---

**文档维护者**: ARK 团队
**最后更新**: 2026-03-10
**文档版本**: v1.0
