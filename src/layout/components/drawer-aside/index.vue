<template>
  <t-drawer
    class="drawer-aside"
    size="220px"
    :closeBtn="false"
    :closeOnEscKeydown="false"
    closeOnOverlayClick
    :footer="false"
    :header="false"
    :preventScrollThrough="true"
    showOverlay
    sizeDraggable
    placement="left"
    v-model:visible="isDrawerVisible"
  >
    <div :class="asideDark ? 'aside dark' : 'aside'">
      <Logo />
      <div class="aside-menu">
        <Menu :route-tree="routeTree" />
      </div>
    </div>
  </t-drawer>
</template>

<script setup lang="ts">
import Logo from "@/layout/components/Logo/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useRouteConfigStore } from "@/store/modules/route-config";
const themeStore = useThemeConfig();
const { collapsed, asideDark } = storeToRefs(themeStore);
const routerStore = useRouteConfigStore();
const { routeTree } = storeToRefs(routerStore);

// 创建计算属性来反转 collapsed 的值
const isDrawerVisible = computed({
  get: () => !collapsed.value,
  set: value => {
    collapsed.value = !value;
  }
});
</script>

<style lang="scss" scoped>
.aside {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  .aside-menu {
    flex: 1;
    overflow: hidden auto;
  }
}
.dark {
  background: #232324;
}
</style>
<style lang="scss">
.drawer-aside {
  .t-drawer__body {
    padding: 0;
  }
}
</style>
