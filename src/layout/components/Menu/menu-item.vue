<template>
  <template v-for="item in props.routeTree" :key="item.path">
    <t-submenu :value="item.path" v-if="menuShow(item)">
      <template #icon v-if="item.meta.svgIcon || item.meta.icon">
        <MenuItemIcon :svg-icon="item.meta.svgIcon" :icon="item.meta.icon" />
      </template>
      <template #title>
        <span class="menu-item-text">{{ $t(`menu.${item.meta.title}`) }}</span>
      </template>
      <MenuItem :route-tree="item.children" />
    </t-submenu>
    <t-menu-item v-else-if="aMenuShow(item)" :value="item?.path">
      <template #icon v-if="item.meta.svgIcon || item.meta.icon">
        <MenuItemIcon :svg-icon="item.meta.svgIcon" :icon="item.meta.icon" />
      </template>
      <span class="menu-item-text">{{ $t(`menu.${item.meta.title}`) }}</span>
    </t-menu-item>
  </template>
</template>

<script setup lang="ts">
import MenuItem from "@/layout/components/Menu/menu-item.vue";
import MenuItemIcon from "@/layout/components/Menu/menu-item-icon.vue";
import { useMenuMethod } from "@/hooks/useMenuMethod";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";

defineOptions({ name: "MenuItem", inheritAttrs: false });

interface Props {
  routeTree: Menu.MenuOptions[];
}
// props的数据类型
// type类型参考：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<Props>(), {
  routeTree: () => []
});

const { menuShow, aMenuShow } = useMenuMethod();

const themeStore = useThemeConfig();
const { layoutType } = storeToRefs(themeStore);
</script>

<style lang="scss" scoped>
.menu-item-text {
  margin-left: v-bind('layoutType === "layoutHead" ? "0px" : "14px"');
}
:deep(.t-menu__item) {
  height: var(--td-size-12);
}
</style>
