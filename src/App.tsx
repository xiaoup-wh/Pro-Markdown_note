/**
 * 主应用组件
 *
 * 这是整个应用的"总指挥"，负责：
 * 1. 管理应用的状态（笔记列表、当前选中的笔记等）
 * 2. 处理用户的操作（创建、编辑、删除笔记）
 * 3. 协调各个子组件（NoteList、NoteEditor、NotePreview）
 *
 * 就像一个指挥中心，协调各个部门的工作
 */

// 导入 React 核心库和 Hooks
// useState - 用于管理组件的状态
// useEffect - 用于处理副作用（如加载数据、监听变化）
// useCallback - 用于缓存函数，优化性能
import React, { useState, useEffect, useCallback } from 'react';

// 导入笔记类型定义
import { Note } from './types/note';

// 导入本地存储工具函数
import { getNotes, addNote, updateNote, deleteNote, searchNotes } from './utils/storage';

// 导入子组件
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import NotePreview from './components/NotePreview';

/**
 * App 组件
 *
 * 这是应用的根组件，所有其他组件都是它的子组件
 */
const App: React.FC = () => {

  // ==================== 状态定义 ====================

  /**
   * notes - 笔记列表
   *
   * 存储所有笔记的数组
   * useState<Note[]> 表示这个状态是一个 Note 类型的数组
   * 初始值是空数组 []
   */
  const [notes, setNotes] = useState<Note[]>([]);

  /**
   * selectedNote - 当前选中的笔记
   *
   * 存储用户当前正在编辑的笔记
   * 如果没有选中任何笔记，值为 null
   */
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  /**
   * searchKeyword - 搜索关键词
   *
   * 存储用户在搜索框中输入的关键词
   */
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * title - 当前笔记的标题
   *
   * 存储当前正在编辑的笔记标题
   * 这样可以实时更新标题，而不需要每次都从笔记对象中读取
   */
  const [title, setTitle] = useState('');

  /**
   * content - 当前笔记的内容
   *
   * 存储当前正在编辑的笔记内容
   */
  const [content, setContent] = useState('');

  /**
   * isInitialized - 是否已初始化
   *
   * 用于标记应用是否已经完成初始化
   * 防止在初始化之前执行某些操作
   */
  const [isInitialized, setIsInitialized] = useState(false);

  // ==================== 副作用 Hooks ====================

  /**
   * 初始化加载笔记
   *
   * useEffect 会在组件挂载后执行一次（因为依赖数组是空的 []）
   * 这里用于从 LocalStorage 加载笔记数据
   *
   * 工作原理：
   * 1. 从 LocalStorage 读取所有笔记
   * 2. 更新 notes 状态
   * 3. 如果有笔记，选中第一条
   * 4. 标记初始化完成
   */
  useEffect(() => {
    // 从 LocalStorage 读取所有笔记
    const loadedNotes = getNotes();

    // 更新笔记列表状态
    setNotes(loadedNotes);

    // 如果有笔记，选中第一条
    if (loadedNotes.length > 0) {
      selectNote(loadedNotes[0]);
    }

    // 标记初始化完成
    setIsInitialized(true);
  }, []); // 空数组表示只在组件挂载时执行一次

  /**
   * 搜索笔记
   *
   * 当搜索关键词变化时，自动搜索笔记
   *
   * 工作原理：
   * 1. 如果还没初始化完成，不执行搜索
   * 2. 如果有搜索关键词，调用 searchNotes 函数搜索
   * 3. 如果没有搜索关键词，显示所有笔记
   */
  useEffect(() => {
    // 如果还没初始化完成，不执行搜索
    if (!isInitialized) return;

    // 根据搜索关键词过滤笔记
    if (searchKeyword.trim()) {
      // 如果有搜索关键词，调用 searchNotes 函数搜索
      const results = searchNotes(searchKeyword);
      setNotes(results);
    } else {
      // 如果没有搜索关键词，显示所有笔记
      const allNotes = getNotes();
      setNotes(allNotes);
    }
  }, [searchKeyword, isInitialized]); // 依赖数组：当搜索关键词或初始化状态变化时执行

  // ==================== 事件处理函数 ====================

  /**
   * 选择笔记
   *
   * 当用户点击笔记列表中的某条笔记时调用
   *
   * @param note - 要选择的笔记对象
   *
   * 工作原理：
   * 1. 更新 selectedNote 状态
   * 2. 更新 title 和 content 状态，让编辑器显示这条笔记的内容
   *
   * useCallback 用于缓存这个函数，避免不必要的重渲染
   * 空依赖数组 [] 表示这个函数永远不会改变
   */
  const selectNote = useCallback((note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }, []);

  /**
   * 创建新笔记
   *
   * 当用户点击"新建"按钮时调用
   *
   * 工作原理：
   * 1. 调用 addNote 函数创建新笔记
   * 2. 把新笔记添加到笔记列表的最前面
   * 3. 选中新创建的笔记
   * 4. 清空搜索关键词
   *
   * useCallback 的依赖数组包含 selectNote，因为这个函数使用了 selectNote
   */
  const handleAddNote = useCallback(() => {
    // 创建新笔记，标题为"新建笔记"，内容为空
    const newNote = addNote('新建笔记', '');

    // 把新笔记添加到笔记列表的最前面
    // prev => [newNote, ...prev] 使用函数式更新，确保获取最新的状态
    setNotes(prev => [newNote, ...prev]);

    // 选中新创建的笔记
    selectNote(newNote);

    // 清空搜索关键词，确保新笔记在列表中可见
    setSearchKeyword('');
  }, [selectNote]);

  /**
   * 更新标题
   *
   * 当用户在标题输入框中输入内容时调用
   *
   * @param newTitle - 新的标题
   *
   * 工作原理：
   * 1. 更新 title 状态
   * 2. 如果有选中的笔记，更新笔记的标题
   * 3. 更新笔记列表中对应的笔记
   *
   * useCallback 的依赖数组包含 selectedNote 和 content，因为这个函数使用了它们
   */
  const handleTitleChange = useCallback((newTitle: string) => {
    // 更新标题状态
    setTitle(newTitle);

    // 如果有选中的笔记，更新笔记的标题
    if (selectedNote) {
      // 调用 updateNote 函数更新笔记
      const updated = updateNote(selectedNote.id, newTitle, content);

      if (updated) {
        // 更新选中的笔记状态
        setSelectedNote(updated);

        // 更新笔记列表中对应的笔记
        // 使用 map 方法遍历数组，找到对应的笔记并更新
        setNotes(prev =>
          prev.map(note => (note.id === updated.id ? updated : note))
        );
      }
    }
  }, [selectedNote, content]);

  /**
   * 更新内容
   *
   * 当用户在内容编辑区输入内容时调用
   *
   * @param newContent - 新的内容
   *
   * 工作原理：
   * 1. 更新 content 状态
   * 2. 如果有选中的笔记，更新笔记的内容
   * 3. 更新笔记列表中对应的笔记
   */
  const handleContentChange = useCallback((newContent: string) => {
    // 更新内容状态
    setContent(newContent);

    // 如果有选中的笔记，更新笔记的内容
    if (selectedNote) {
      // 调用 updateNote 函数更新笔记
      const updated = updateNote(selectedNote.id, title, newContent);

      if (updated) {
        // 更新选中的笔记状态
        setSelectedNote(updated);

        // 更新笔记列表中对应的笔记
        setNotes(prev =>
          prev.map(note => (note.id === updated.id ? updated : note))
        );
      }
    }
  }, [selectedNote, title]);

  /**
   * 删除笔记
   *
   * 当用户点击删除按钮时调用
   *
   * @param id - 要删除的笔记 ID
   *
   * 工作原理：
   * 1. 弹出确认对话框
   * 2. 如果用户确认删除，调用 deleteNote 函数
   * 3. 重新加载笔记列表
   * 4. 如果删除的是当前选中的笔记，选中第一条笔记或清空编辑器
   */
  const handleDeleteNote = useCallback((id: string) => {
    // 弹出确认对话框
    if (window.confirm('确定要删除这条笔记吗？')) {
      // 调用 deleteNote 函数删除笔记
      deleteNote(id);

      // 重新加载笔记列表
      const updatedNotes = getNotes();
      setNotes(updatedNotes);

      // 如果删除的是当前选中的笔记
      if (selectedNote?.id === id) {
        if (updatedNotes.length > 0) {
          // 如果还有笔记，选中第一条
          selectNote(updatedNotes[0]);
        } else {
          // 如果没有笔记了，清空编辑器
          setSelectedNote(null);
          setTitle('');
          setContent('');
        }
      }
    }
  }, [selectedNote, selectNote]);

  // ==================== 渲染组件 ====================

  /**
   * 渲染应用界面
   *
   * 界面由三部分组成：
   * 1. 左侧：笔记列表（NoteList）
   * 2. 中间：编辑器（NoteEditor）或空状态提示
   * 3. 右侧：预览区（NotePreview）
   */
  return (
    // 最外层容器
    // h-screen: 高度为 100vh（视口高度）
    // flex: 使用弹性布局
    // bg-gray-100: 浅灰色背景
    <div className="h-screen flex bg-gray-100">

      {/* ========== 左侧笔记列表 ========== */}
      <NoteList
        notes={notes}
        selectedNoteId={selectedNote?.id || null}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        onSelectNote={selectNote}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />

      {/* ========== 中间编辑器 ========== */}
      <div className="flex-1 flex flex-col border-r border-gray-200">
        {selectedNote ? (
          <NoteEditor
            title={title}
            content={content}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-5xl mb-4">📝</p>
              <p className="text-lg">选择或创建一条笔记开始编辑</p>
            </div>
          </div>
        )}
      </div>

      {/* ========== 右侧预览 ========== */}
      <div className="flex-1">
        <NotePreview content={content} />
      </div>
    </div>
  );
};

// 导出组件，让其他文件可以使用
export default App;