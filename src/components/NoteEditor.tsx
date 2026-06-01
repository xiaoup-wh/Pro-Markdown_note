/**
 * 笔记编辑器组件
 *
 * 这个组件负责显示中间的编辑区域
 * 包括：标题输入框和内容编辑区
 *
 * 就像一张白纸，让你在这里写下笔记内容
 */

// 导入 React 库
import React from 'react';

/**
 * 组件的属性（Props）类型定义
 *
 * 这里定义了 NoteEditor 组件需要接收哪些数据
 */
interface NoteEditorProps {
  /** title - 当前笔记的标题 */
  title: string;

  /** content - 当前笔记的内容 */
  content: string;

  /** onTitleChange - 当标题变化时调用的函数 */
  onTitleChange: (title: string) => void;

  /** onContentChange - 当内容变化时调用的函数 */
  onContentChange: (content: string) => void;
}

/**
 * NoteEditor 组件
 *
 * 使用 React.FC（Function Component）定义函数组件
 * 从 props 中解构出需要的数据和函数
 */
const NoteEditor: React.FC<NoteEditorProps> = ({
  title,           // 当前笔记标题
  content,         // 当前笔记内容
  onTitleChange,   // 标题变化的回调函数
  onContentChange, // 内容变化的回调函数
}) => {
  /**
   * 渲染组件
   *
   * 这个组件包含三个部分：
   * 1. 标题输入框 - 用于输入笔记标题
   * 2. 内容编辑区 - 用于输入 Markdown 内容
   * 3. 底部提示 - 显示语法提示信息
   */
  return (
    // 最外层容器
    // flex flex-col: 垂直方向的弹性布局
    // h-full: 高度 100%
    // bg-white: 白色背景
    <div className="flex flex-col h-full bg-white">

      {/* ========== 编辑器头部（标题输入框）========== */}
      <div className="px-4 py-3 border-b border-gray-200">
        {/* 标题输入框 */}
        <input
          type="text"
          placeholder="输入笔记标题..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full text-xl font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* ========== 编辑区域（内容输入区）========== */}
      {/* flex-1: 占据剩余的所有空间 */}
      <div className="flex-1 p-4">
        {/* 内容编辑区 */}
        {/* 使用 textarea 让用户可以输入多行文本 */}
        <textarea
          placeholder="输入 Markdown 内容..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full h-full resize-none text-gray-700 placeholder-gray-400 focus:outline-none font-mono text-sm leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* ========== 底部提示 ========== */}
      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
        支持 Markdown 语法 | 实时预览 →
      </div>
    </div>
  );
};

// 导出组件，让其他文件可以使用
export default NoteEditor;