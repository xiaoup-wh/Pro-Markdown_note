/**
 * 笔记列表组件
 *
 * 这个组件负责显示左侧的笔记列表
 * 包括：搜索框、笔记列表、新建按钮、删除按钮
 *
 * 就像一本书的目录，让你快速找到想要的笔记
 */

// 导入 React 库
import React from 'react';

// 导入笔记类型定义
import { Note } from '../types/note';

/**
 * 组件的属性（Props）类型定义
 *
 * Props 就像函数的参数，是父组件传递给子组件的数据
 * 这里定义了 NoteList 组件需要接收哪些数据
 */
interface NoteListProps {
  /** notes - 笔记数组，包含所有要显示的笔记 */
  notes: Note[];

  /** selectedNoteId - 当前选中的笔记 ID，用于高亮显示 */
  selectedNoteId: string | null;

  /** searchKeyword - 搜索关键词 */
  searchKeyword: string;

  /** onSearchChange - 当搜索关键词变化时调用的函数 */
  onSearchChange: (keyword: string) => void;

  /** onSelectNote - 当用户点击某个笔记时调用的函数 */
  onSelectNote: (note: Note) => void;

  /** onAddNote - 当用户点击"新建"按钮时调用的函数 */
  onAddNote: () => void;

  /** onDeleteNote - 当用户点击删除按钮时调用的函数 */
  onDeleteNote: (id: string) => void;
}

/**
 * NoteList 组件
 *
 * 使用 React.FC（Function Component）定义函数组件
 * 从 props 中解构出需要的数据和函数
 */
const NoteList: React.FC<NoteListProps> = ({
  notes,           // 笔记数组
  selectedNoteId,  // 当前选中的笔记 ID
  searchKeyword,   // 搜索关键词
  onSearchChange,  // 搜索关键词变化的回调函数
  onSelectNote,    // 选择笔记的回调函数
  onAddNote,       // 新建笔记的回调函数
  onDeleteNote,    // 删除笔记的回调函数
}) => {

  /**
   * 格式化日期
   *
   * 把时间戳转换成易读的日期格式
   *
   * @param timestamp - 时间戳（毫秒）
   * @returns 格式化后的日期字符串，例如 "5月30日 14:30"
   *
   * 工作原理：
   * 1. 创建 Date 对象
   * 2. 使用 toLocaleDateString 方法格式化日期
   * 3. 'zh-CN' 表示使用中文格式
   */
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',    // 月份简写
      day: 'numeric',    // 日期
      hour: '2-digit',   // 小时（两位数）
      minute: '2-digit', // 分钟（两位数）
    });
  };

  /**
   * 获取内容预览
   *
   * 从笔记内容中提取纯文本，用于在列表中显示预览
   *
   * @param content - 笔记的 Markdown 内容
   * @returns 截取后的纯文本预览
   *
   * 工作原理：
   * 1. 使用正则表达式移除 Markdown 语法符号
   * 2. 去除首尾空格
   * 3. 如果超过 60 个字符，截取并添加省略号
   */
  const getContentPreview = (content: string): string => {
    // 移除 Markdown 语法符号（如 #, *, `, [, ] 等）
    const plainText = content.replace(/[#*`\[\]()!>|-]/g, '').trim();

    // 如果文本超过 60 个字符，截取前 60 个字符并添加省略号
    return plainText.length > 60 ? plainText.substring(0, 60) + '...' : plainText;
  };

  /**
   * 渲染组件
   *
   * JSX 语法看起来像 HTML，但实际上是 JavaScript
   * React 会把这些 JSX 转换成真正的网页元素
   */
  return (
    // 最外层容器
    // w-72: 宽度 288px
    // bg-gray-50: 浅灰色背景
    // border-r: 右边框
    // flex flex-col: 垂直方向的弹性布局
    // h-full: 高度 100%
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full">

      {/* ========== 头部区域 ========== */}
      {/* 包含标题和新建按钮 */}
      <div className="p-4 border-b border-gray-200">
        {/* 标题行：显示标题和新建按钮 */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-gray-800">📝 笔记列表</h1>

          {/* 新建按钮 */}
          {/* 点击时调用 onAddNote 函数 */}
          <button
            onClick={onAddNote}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            + 新建
          </button>
        </div>

        {/* ========== 搜索框 ========== */}
        <div className="relative">
          {/* 搜索输入框 */}
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 pl-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          {/* 搜索图标 */}
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* ========== 笔记列表区域 ========== */}
      {/* 这个区域可以滚动，显示所有笔记 */}
      <div className="flex-1 overflow-y-auto">
        {/* 判断是否有笔记 */}
        {notes.length === 0 ? (
          // 如果没有笔记，显示提示信息
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchKeyword ? '没有找到匹配的笔记' : '还没有笔记，点击"新建"开始'}
          </div>
        ) : (
          // 如果有笔记，显示笔记列表
          <div className="p-2 space-y-1">
            {/* 使用 map 方法遍历笔记数组，为每条笔记创建一个列表项 */}
            {notes.map((note) => (
              <div
                key={note.id}  // key 是 React 需要的唯一标识
                onClick={() => onSelectNote(note)}  // 点击时选中这条笔记
                className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                  selectedNoteId === note.id
                    ? 'bg-blue-100 border border-blue-300'  // 选中状态
                    : 'hover:bg-gray-100 border border-transparent'  // 未选中状态
                }`}
              >
                {/* 笔记标题和删除按钮 */}
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-medium text-gray-800 truncate flex-1 mr-2">
                    {note.title || '无标题'}
                  </h3>

                  {/* 删除按钮 */}
                  {/* 默认隐藏，鼠标悬停在笔记上时显示 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // 阻止事件冒泡，避免触发笔记的点击事件
                      onDeleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                    title="删除笔记"
                  >
                    {/* 删除图标（垃圾桶） */}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* 笔记内容预览 */}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {getContentPreview(note.content)}
                </p>

                {/* 更新时间 */}
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(note.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== 底部统计 ========== */}
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">
        共 {notes.length} 条笔记
      </div>
    </div>
  );
};

// 导出组件，让其他文件可以使用
export default NoteList;