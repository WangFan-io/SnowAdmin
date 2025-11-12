import { computed } from "vue";
import { useDevicesSize } from "@/hooks/useDevicesSize";

interface LayoutModel {
  formLayout: ComputedRef<"vertical" | "horizontal">;
  tableFixed: ComputedRef<"" | "right">;
  descriptionsLayout: ComputedRef<"inline-vertical" | "right">;
  descriptionsColumn: (min?: number, max?: number) => number;
  dialogWidth: (min?: string, max?: string) => string;
}

/**
 * 布局模型钩子，提供响应式的布局相关属性和方法
 * 根据设备尺寸动态调整表单、表格、描述组件等的布局方式
 * formLayout: 表单布局方式，移动端为垂直布局，其他设备为水平布局
 * tableFixed: 表格固定列设置，移动端不固定，其他设备固定在右侧
 * descriptionsLayout: 描述组件布局方式，移动端为内联垂直布局，其他设备为右侧布局
 * descriptionsColumn: 计算描述组件列数的方法，移动端返回最小值，其他设备返回最大值
 * dialogWidth: 计算对话框宽度的方法，移动端返回最大宽度，其他设备返回最小宽度
 * @returns {LayoutModel} 包含响应式布局属性和方法的对象
 */
export const useLayoutModel = (): LayoutModel => {
  const { isMobile } = useDevicesSize();

  /**
   * 表单布局方式, 移动端为垂直布局，其它为水平布局
   */
  const formLayout = computed(() => (isMobile.value ? "vertical" : "horizontal"));

  /**
   * 表格固定列, 移动端不固定，其它固定在右侧
   */
  const tableFixed = computed(() => (isMobile.value ? "" : "right"));

  /**
   * 描述布局方式, 移动端为内联垂直布局，其它为右侧布局
   */
  const descriptionsLayout = computed(() => (isMobile.value ? "inline-vertical" : "right"));

  /**
   * 描述布局的列数，移动端取min，其它取max
   * @param min 最小列数
   * @param max 最大列数
   * @returns 列数
   */
  const descriptionsColumn = (min: number = 1, max: number = 2) => (isMobile.value ? min : max);

  /**
   * 对话框宽度，移动端取max，其它取min
   * @param min 最小宽度
   * @param max 最大宽度
   * @returns 宽度
   */
  const dialogWidth = (min: string = "40%", max: string = "95%") => (isMobile.value ? max : min);

  return { formLayout, tableFixed, descriptionsLayout, descriptionsColumn, dialogWidth };
};
