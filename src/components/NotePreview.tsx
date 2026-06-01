/**
 * 笔记预览组件
 *
 * 这个组件负责显示右侧的实时预览
 * 把用户输入的 Markdown 文本转换成漂亮的排版效果
 *
 * 就像一个实时翻译器，把你写的"速记符号"翻译成漂亮的文档
 */

// 导入 React 库
import React from 'react';

// 导入 react-markdown，用于把 Markdown 文本转换成 HTML
import ReactMarkdown from 'react-markdown';

// 导入 remark-gfm 插件，支持 GitHub 风格的 Markdown 扩展
// GFM = GitHub Flavored Markdown
// 支持：表格、任务列表、删除线等
import remarkGfm from 'remark-gfm';

// 导入代码语法高亮组件
// Prism 是一个流行的语法高亮库
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// 导入代码高亮的主题样式
// oneDark 是一个深色主题，类似 VS Code 的暗色主题
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * 组件的属性（Props）类型定义
 */
interface NotePreviewProps {
  /** content - 要渲染的 Markdown 内容 */
  content: string;
}

/**
 * 代码块的属性类型定义
 *
 * 当 react-markdown 渲染代码块时，会传递这些属性
 */
interface CodeProps {
  /** node - 原始的 AST 节点（一般用不到） */
  node?: unknown;

  /** inline - 是否是行内代码（用单个反引号包裹的代码） */
  inline?: boolean;

  /** className - 代码块的类名，包含语言信息（如 "language-javascript"） */
  className?: string;

  /** children - 代码内容 */
  children?: React.ReactNode;
}

/**
 * NotePreview 组件
 *
 * 使用 React.FC（Function Component）定义函数组件
 */
const NotePreview: React.FC<NotePreviewProps> = ({ content }) => {

  /**
   * 自定义渲染组件
   *
   * react-markdown 允许我们自定义如何渲染不同的 Markdown 元素
   * 这里我们主要自定义了代码块的渲染方式，让它支持语法高亮
   */
  const components = {
    /**
     * 自定义代码块渲染
     *
     * 当遇到代码块时，这个函数会被调用
     *
     * @param props - 代码块的属性
     * @returns 渲染后的代码块组件
     *
     * 工作原理：
     * 1. 从 className 中提取语言信息（如 "language-javascript"）
     * 2. 如果是代码块（不是行内代码）且有语言标识，使用语法高亮渲染
     * 3. 否则使用普通的 <code> 标签渲染
     */
    code({ node, inline, className, children, ...props }: CodeProps) {
      // 使用正则表达式从 className 中提取语言名称
      // 例如 "language-javascript" 会提取出 "javascript"
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      // 如果是代码块（不是行内代码）且有语言标识，使用语法高亮渲染
      if (!inline && language) {
        return (
          <SyntaxHighlighter
            style={oneDark}          // 使用 oneDark 主题
            language={language}       // 指定编程语言
            PreTag="div"              // 使用 div 作为外层标签
            customStyle={{            // 自定义样式
              margin: '1em 0',        // 上下间距
              borderRadius: '6px',    // 圆角
              fontSize: '14px',       // 字体大小
            }}
            {...props}                // 传递其他属性
          >
            {/* 移除末尾的换行符，避免多余空行 */}
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }

      // 如果是行内代码或没有语言标识，使用普通的 <code> 标签
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  /**
   * 渲染组件
   */
  return (
    // 最外层容器
    <div className="flex flex-col h-full bg-white">

      {/* ========== 预览头部 ========== */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-500">📝 实时预览</h2>
      </div>

      {/* ========== 预览内容 ========== */}
      {/* 这个区域可以滚动，显示渲染后的 Markdown 内容 */}
      <div className="flex-1 overflow-y-auto p-6 markdown-preview">

        {/* 判断是否有内容 */}
        {content ? (
          // 如果有内容，使用 ReactMarkdown 渲染
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
          </ReactMarkdown>
        ) : (
          // 如果没有内容，显示提示信息
          <div className="text-gray-400 text-center mt-20">
            <p className="text-4xl mb-4">📝</p>
            <p>在左侧输入 Markdown 内容</p>
            <p>这里将显示渲染后的效果</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 导出组件，让其他文件可以使用
export default NotePreview;