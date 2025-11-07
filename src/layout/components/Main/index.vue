<template>
  <!-- <a-watermark :content="watermark" v-bind="watermarkConfig">
    <a-layout-content class="layout-main-content">
      <router-view v-slot="{ Component, route }">
        <s-main-transition>
          <keep-alive :include="cacheRoutes">
            <component :is="createComponentWrapper(Component, route)" :key="route.fullPath" v-if="refreshPage" />
          </keep-alive>
        </s-main-transition>
      </router-view>
    </a-layout-content>
  </a-watermark> -->
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
// import Tabs from "@/layout/components/Tabs/index.vue";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useRouteConfigStore } from "@/store/modules/route-config";
const themeStore = useThemeConfig();
let { refreshPage, isTabs, watermark, watermarkStyle, watermarkRotate, watermarkGap } = storeToRefs(themeStore);
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

// 水印配置
const watermarkConfig = computed(() => {
  return {
    font: watermarkStyle.value,
    rotate: watermarkRotate.value,
    gap: watermarkGap.value
  };
});

watch(watermarkConfig, newv => {
  console.log(newv);
});
</script>

<style lang="scss" scoped>
.layout-main-content {
  height: 0;
  overflow: hidden auto;
  background: $color-fill-1;
}
</style>
