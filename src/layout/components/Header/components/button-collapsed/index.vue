<template>
  <t-button size="small" shape="square" variant="text" id="system-collapsed" @click="onCollapsed">
    <template #icon>
      <icon :size="iconSize" name="indent-left" v-if="!collapsed" />
      <icon :size="iconSize" name="indent-right" v-else />
    </template>
  </t-button>
  <DrawerAside v-if="!isPc" />
</template>

<script setup lang="ts">
import DrawerAside from "@/layout/components/drawer-aside/index.vue";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useDevicesSize } from "@/hooks/useDevicesSize";
import { Icon } from "tdesign-icons-vue-next";

const themeStore = useThemeConfig();
const { collapsed } = storeToRefs(themeStore);
const { isPc } = useDevicesSize();

// 图标尺寸
const iconSize = ref("18px");

// 刷新时，PC窗口展开菜单，移动端收起菜单
collapsed.value = isPc.value ? false : true;

// 折叠
const onCollapsed = () => {
  themeStore.setCollapsed(!collapsed.value);
};

// 监听屏幕尺寸变化，PC端自动展开菜单，移动端自动收起
watch(isPc, (newV: boolean) => {
  collapsed.value = newV ? false : true;
});
</script>
