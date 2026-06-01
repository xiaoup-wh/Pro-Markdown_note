# 📝 Markdown 笔记应用

一个简洁优雅的 Markdown 笔记应用，支持实时预览和代码语法高亮。

## ✨ 功能特性

- 📝 创建、编辑、删除笔记
- 👀 Markdown 实时预览
- 🎨 代码语法高亮（支持 100+ 种语言）
- 🔍 笔记搜索功能
- 💾 自动保存到 LocalStorage
- 📱 响应式设计

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式框架**: Tailwind CSS 3
- **Markdown 渲染**: react-markdown
- **代码高亮**: react-syntax-highlighter
- **数据存储**: LocalStorage

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/

### 构建生产版本

```bash
npm run build
```

## 📦 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入仓库
3. 自动部署完成

详细部署说明请参考 `Vercel部署指南.md`

## 📁 项目结构

```
src/
├── main.tsx              # 应用入口
├── App.tsx               # 主应用组件
├── index.css             # 全局样式
├── types/
│   └── note.ts           # 笔记类型定义
├── utils/
│   └── storage.ts        # LocalStorage 工具
└── components/
    ├── NoteList.tsx       # 笔记列表组件
    ├── NoteEditor.tsx     # 编辑器组件
    └── NotePreview.tsx    # 预览组件
```

## 📖 使用说明

1. 点击"+ 新建"创建笔记
2. 在编辑器输入 Markdown 内容
3. 右侧实时显示预览效果
4. 支持搜索、删除笔记

## 📝 Markdown 语法示例

```markdown
# 标题
**粗体** *斜体*
- 列表项
> 引用
`代码`
​```javascript
// 代码块
console.log("Hello");
​```
```

## 📄 许可证

MIT License