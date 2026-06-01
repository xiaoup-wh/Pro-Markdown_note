/**
 * 笔记数据类型定义
 *
 * 这个文件定义了笔记（Note）的数据结构
 * 就像给笔记制作一个"身份证模板"，规定了笔记应该包含哪些信息
 */

/**
 * Note 接口 - 定义笔记的数据结构
 *
 * 接口（Interface）就像是一个模板或蓝图，
 * 告诉程序一条笔记应该包含哪些信息
 */
export interface Note {
  /** id - 笔记的唯一标识符，就像人的身份证号，每条笔记都不一样 */
  id: string;

  /** title - 笔记的标题 */
  title: string;

  /** content - 笔记的内容，使用 Markdown 格式编写 */
  content: string;

  /** createdAt - 笔记创建的时间，使用时间戳（毫秒）表示 */
  createdAt: number;

  /** updatedAt - 笔记最后更新的时间，使用时间戳（毫秒）表示 */
  updatedAt: number;
}