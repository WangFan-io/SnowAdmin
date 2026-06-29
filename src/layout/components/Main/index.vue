<template>
  <t-content class="layout-main-content">
    <router-view v-slot="{ Component, route }">
      <s-main-transition>
        <keep-alive :include="cacheRoutes">
          <component :is="createComponentWrapper(Component, route)" :key="route.fullPath" v-if="refreshPage" />
        </keep-alive>
      </s-main-transition>
    </router-view>
  </t-content>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useRouteConfigStore } from "@/store/modules/route-config";
const themeStore = useThemeConfig();
let { refreshPage } = storeToRefs(themeStore);
const routerStore = useRouteConfigStore();
const { cacheRoutes } = storeToRefs(routerStore);

// 组件包装器
const wrapperMap = new Map();
const createComponentWrapper = (component: any, route: any) => {
  if (!component) return;
  const wrapperName = route.fullPath;
  let wrapper = wrapperMap.get(wrapperName);
  if (!wrapper) {
    wrapper = { name: wrapperName, render: () => h(component) };
    wrapperMap.set(wrapperName, wrapper);
  }
  return h(wrapper);
};
</script>

<style lang="scss" scoped>
.layout-main-content {
  height: 0;
  overflow: hidden auto;
  background: $color-fill-1;
}
</style>
