/**
 * 应用入口文件
 *
 * 这是整个应用程序的起点，就像按下电视机的开关一样
 * 当用户打开网页时，这个文件会被第一个执行
 */

// 导入 React 核心库
// React 是构建用户界面的基础库
import React from 'react'

// 导入 ReactDOM，用于把 React 组件渲染到网页上
// ReactDOM 就像一个"画家"，把 React 组件画到网页的画布上
import ReactDOM from 'react-dom/client'

// 导入主应用组件
// App 是我们整个应用的"总指挥"
import App from './App.tsx'

// 导入全局样式文件
// 这个文件定义了整个应用的外观风格
import './index.css'

/**
 * 渲染应用到网页
 *
 * ReactDOM.createRoot() - 创建一个 React 根节点
 *   - document.getElementById('root') - 找到 HTML 中 id 为 "root" 的元素
 *   - ! 是 TypeScript 的非空断言，表示这个元素一定存在
 *
 * .render() - 把 React 组件渲染到根节点中
 *
 * <React.StrictMode> - 严格模式
 *   - 帮助发现潜在的问题
 *   - 在开发模式下会额外检查代码
 *   - 不会影响生产环境的性能
 *
 * <App /> - 我们的主应用组件
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)