# 灵感放大器

一个纯前端的创意生成工具，帮助用户将模糊的想法转化为具体、可落地的项目方案。

## 功能特性

### 会话管理
- ✅ 创建新会话
- ✅ 切换会话
- ✅ 删除会话
- ✅ 编辑会话标题
- ✅ 数据保存在浏览器本地

### 提示词输入
- ✅ 文本输入区域
- ✅ 5个预设示例提示词
- ✅ 字数统计

### AI项目方案生成
- ✅ 集成GLM-4-Flash API
- ✅ 生成5个不同维度的项目方案
- ✅ 每个方案包含：
  - 方案名称
  - 核心价值描述
  - 发散维度说明
  - 核心功能列表
  - 技术栈建议
  - 可行性评分（0-100分）
  - 创新性评分（0-100分）
  - 实现路径建议

### 方案展示
- ✅ 表格形式展示所有方案
- ✅ 评分进度条可视化
- ✅ 点击查看详情弹窗
- ✅ 一键复制方案内容

### API Key配置
- ✅ 用户输入GLM API Key
- ✅ API Key加密存储在本地
- ✅ 实时验证API Key有效性

## 技术栈

- **前端框架：** React 18
- **构建工具：** Vite 5
- **样式方案：** Tailwind CSS 3
- **AI服务：** GLM-4-Flash API
- **本地存储：** localStorage

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 即可使用。

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 使用说明

### 1. 配置API Key

首次使用需要配置GLM API Key：
1. 点击右上角"配置API Key"按钮
2. 输入你的API Key
3. 点击"保存并验证"
4. 验证成功后即可使用

### 2. 生成项目方案

1. 在输入框描述你的想法，如："一个帮助人们学习英语的APP"
2. 或者选择一个示例提示词
3. 点击"放大灵感"按钮
4. 等待AI生成5个项目方案

### 3. 查看和使用方案

- 在表格中查看所有方案概览
- 点击"查看详情"查看完整方案
- 在详情弹窗中点击"复制"按钮复制完整方案

## 项目结构

```
.
├── src/
│   ├── components/           # UI组件
│   │   ├── Sidebar.jsx      # 侧边栏会话列表
│   │   ├── InputPanel.jsx   # 提示词输入面板
│   │   ├── ResultTable.jsx  # 方案表格展示
│   │   ├── IdeaDetailModal.jsx  # 方案详情弹窗
│   │   └── ApiKeyModal.jsx  # API Key配置弹窗
│   ├── services/            # 服务层
│   │   └── glmApi.js        # GLM API调用服务
│   ├── utils/               # 工具函数
│   │   ├── storage.js       # 本地存储工具
│   │   └── sessionManager.js  # 会话管理工具
│   ├── data/                # 数据
│   │   └── examples.js      # 示例提示词
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # React入口
│   └── index.css            # 全局样式
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

## 获取API Key

访问 [智谱AI开放平台](https://open.bigmodel.cn/) 注册并获取API Key。

## 数据存储说明

所有数据都保存在浏览器的localStorage中，包括：
- 会话历史
- 生成的项目方案
- 加密的API Key

注意：清除浏览器数据会导致所有数据丢失。

## 开发说明

### 环境要求

- Node.js 16+
- npm 7+

### 修改配置

- API配置：`src/services/glmApi.js`
- 主题配置：`tailwind.config.js`
- 示例提示词：`src/data/examples.js`

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 致谢

感谢 [智谱AI](https://open.bigmodel.cn/) 提供的GLM-4-Flash API服务。
