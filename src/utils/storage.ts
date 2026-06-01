/**
 * 本地存储工具模块
 *
 * 这个文件负责所有与 LocalStorage 相关的操作
 * LocalStorage 是浏览器提供的一个"小抽屉"，可以用来保存数据
 *
 * 主要功能：
 * - 保存笔记到浏览器
 * - 从浏览器读取笔记
 * - 添加、更新、删除笔记
 * - 搜索笔记
 */

// 导入笔记类型定义
import { Note } from '../types/note';

/**
 * 存储键名
 * 在 LocalStorage 中，我们用这个键名来保存笔记数据
 * 就像给抽屉贴一个标签，方便以后找到它
 */
const STORAGE_KEY = 'markdown-notes';

/**
 * 生成唯一 ID
 *
 * 每条笔记都需要一个唯一的标识符（就像身份证号）
 * 这个函数通过组合当前时间和随机数来生成一个唯一的 ID
 *
 * @returns 返回一个唯一的字符串 ID
 *
 * 工作原理：
 * 1. Date.now() 获取当前时间的毫秒数
 * 2. toString(36) 把数字转换成 36 进制（0-9 和 a-z）
 * 3. Math.random() 生成一个随机数
 * 4. 把时间和随机数拼在一起，就得到了一个几乎不可能重复的 ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 获取所有笔记
 *
 * 从 LocalStorage 中读取所有保存的笔记
 *
 * @returns 返回笔记数组，如果没有数据则返回空数组
 *
 * 工作原理：
 * 1. 从 LocalStorage 中读取 JSON 字符串
 * 2. 如果没有数据，返回空数组
 * 3. 把 JSON 字符串转换成 JavaScript 对象
 * 4. 如果转换失败（数据损坏），也返回空数组
 */
export const getNotes = (): Note[] => {
  // 从 LocalStorage 中读取数据
  const data = localStorage.getItem(STORAGE_KEY);

  // 如果没有数据，返回空数组
  if (!data) return [];

  try {
    // 把 JSON 字符串转换成 JavaScript 对象
    return JSON.parse(data);
  } catch {
    // 如果转换失败（数据损坏），返回空数组
    return [];
  }
};

/**
 * 保存所有笔记
 *
 * 把笔记数组保存到 LocalStorage 中
 *
 * @param notes - 要保存的笔记数组
 *
 * 工作原理：
 * 1. 把 JavaScript 对象转换成 JSON 字符串
 * 2. 保存到 LocalStorage 中
 */
export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

/**
 * 添加新笔记
 *
 * 创建一条新笔记并保存到 LocalStorage
 *
 * @param title - 笔记标题
 * @param content - 笔记内容
 * @returns 返回新创建的笔记对象
 *
 * 工作原理：
 * 1. 获取当前所有笔记
 * 2. 创建一个新的笔记对象
 * 3. 把新笔记添加到数组的最前面（最新的笔记在最上面）
 * 4. 保存到 LocalStorage
 * 5. 返回新创建的笔记
 */
export const addNote = (title: string, content: string): Note => {
  // 获取当前所有笔记
  const notes = getNotes();

  // 获取当前时间
  const now = Date.now();

  // 创建新的笔记对象
  const newNote: Note = {
    id: generateId(),    // 生成唯一 ID
    title,               // 笔记标题
    content,             // 笔记内容
    createdAt: now,      // 创建时间
    updatedAt: now,      // 更新时间（新笔记的创建时间和更新时间相同）
  };

  // 把新笔记添加到数组的最前面
  // unshift 方法会把元素添加到数组的开头
  notes.unshift(newNote);

  // 保存到 LocalStorage
  saveNotes(notes);

  // 返回新创建的笔记
  return newNote;
};

/**
 * 更新笔记
 *
 * 根据 ID 找到笔记并更新它的内容
 *
 * @param id - 要更新的笔记 ID
 * @param title - 新的标题
 * @param content - 新的内容
 * @returns 返回更新后的笔记对象，如果找不到则返回 null
 *
 * 工作原理：
 * 1. 获取当前所有笔记
 * 2. 根据 ID 找到要更新的笔记
 * 3. 更新笔记的标题、内容和更新时间
 * 4. 保存到 LocalStorage
 * 5. 返回更新后的笔记
 */
export const updateNote = (id: string, title: string, content: string): Note | null => {
  // 获取当前所有笔记
  const notes = getNotes();

  // 根据 ID 找到笔记在数组中的位置
  // findIndex 方法会返回第一个符合条件的元素的索引
  // 如果找不到，返回 -1
  const index = notes.findIndex(note => note.id === id);

  // 如果找不到笔记，返回 null
  if (index === -1) return null;

  // 更新笔记
  // 使用展开运算符 (...) 保留原有的属性，只更新需要改变的部分
  notes[index] = {
    ...notes[index],     // 保留原有的属性
    title,               // 更新标题
    content,             // 更新内容
    updatedAt: Date.now(), // 更新时间戳
  };

  // 保存到 LocalStorage
  saveNotes(notes);

  // 返回更新后的笔记
  return notes[index];
};

/**
 * 删除笔记
 *
 * 根据 ID 删除指定的笔记
 *
 * @param id - 要删除的笔记 ID
 * @returns 返回是否删除成功（true 表示成功，false 表示找不到笔记）
 *
 * 工作原理：
 * 1. 获取当前所有笔记
 * 2. 使用 filter 方法过滤掉要删除的笔记
 * 3. 如果过滤后的数组长度和原来一样，说明没找到笔记
 * 4. 保存过滤后的数组到 LocalStorage
 */
export const deleteNote = (id: string): boolean => {
  // 获取当前所有笔记
  const notes = getNotes();

  // 使用 filter 方法过滤掉要删除的笔记
  // filter 会返回一个新数组，只包含符合条件的元素
  // 这里我们保留所有 ID 不等于要删除的 ID 的笔记
  const filteredNotes = notes.filter(note => note.id !== id);

  // 如果过滤后的数组长度和原来一样，说明没找到要删除的笔记
  if (filteredNotes.length === notes.length) return false;

  // 保存过滤后的数组到 LocalStorage
  saveNotes(filteredNotes);

  // 返回 true 表示删除成功
  return true;
};

/**
 * 搜索笔记
 *
 * 根据关键词搜索笔记，搜索范围包括标题和内容
 *
 * @param keyword - 搜索关键词
 * @returns 返回匹配的笔记数组
 *
 * 工作原理：
 * 1. 获取当前所有笔记
 * 2. 把关键词转换成小写（这样搜索不区分大小写）
 * 3. 使用 filter 方法筛选出标题或内容包含关键词的笔记
 * 4. 返回筛选后的数组
 */
export const searchNotes = (keyword: string): Note[] => {
  // 获取当前所有笔记
  const notes = getNotes();

  // 把关键词转换成小写，这样搜索不区分大小写
  const lowerKeyword = keyword.toLowerCase();

  // 使用 filter 方法筛选笔记
  // filter 会返回一个新数组，只包含符合条件的元素
  return notes.filter(
    note =>
      // 检查标题是否包含关键词（不区分大小写）
      note.title.toLowerCase().includes(lowerKeyword) ||
      // 或者检查内容是否包含关键词（不区分大小写）
      note.content.toLowerCase().includes(lowerKeyword)
  );
};