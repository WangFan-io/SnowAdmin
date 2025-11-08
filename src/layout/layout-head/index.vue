<template>
  <t-layout class="layout">
    <t-header class="layout-head">
      <div class="header">
        <ButtonCollapsed v-if="isMobile" />
        <t-head-menu expand-type="popup" :theme="asideDark ? 'dark' : 'light'" :value="selectedMenu" @change="onMenuItem">
          <template #logo v-if="!isMobile">
            <Logo />
          </template>
          <MenuItem :route-tree="routeTree" v-if="!isMobile" />
          <template #operations>
            <HeaderRight />
          </template>
        </t-head-menu>
      </div>
      <div class="tabs">
        <Tabs v-if="isTabs" />
      </div>
    </t-header>
    <Main />
    <Footer v-if="isFooter" />
  </t-layout>
</template>

<script setup lang="ts">
import Logo from "@/layout/components/Logo/index.vue";
import Tabs from "@/layout/components/Tabs/index.vue";
import HeaderRight from "@/layout/components/Header/components/header-right/index.vue";
import Main from "@/layout/components/Main/index.vue";
import Footer from "@/layout/components/Footer/index.vue";
import MenuItem from "@/layout/components/Menu/menu-item.vue";
import ButtonCollapsed from "@/layout/components/Header/components/button-collapsed/index.vue";
import { useRoutingMethod } from "@/hooks/useRoutingMethod";
import { storeToRefs } from "pinia";
import { useRouteConfigStore } from "@/store/modules/route-config";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useDevicesSize } from "@/hooks/useDevicesSize";
import { MenuProps } from "tdesign-vue-next";

defineOptions({ name: "LayoutHead" });

const route = useRoute();
const router = useRouter();
const routerStore = useRouteConfigStore();
const themeStore = useThemeConfig();
const { routeTree } = storeToRefs(routerStore);
const { isFooter, asideDark, isTabs } = storeToRefs(themeStore);
const { isMobile } = useDevicesSize();

const onMenuItem: MenuProps["onChange"] = path => router.push(path);

const selectedMenu = computed(() => {
  const { getAllParentRoute } = useRoutingMethod();
  const find = getAllParentRoute(route.matched.at(-1).path);
  if (!find) return "";
  let path = "";
  for (let i = find.length - 1; i >= 0; i--) {
    if (find[i].meta && !find[i].meta.hide) {
      path = find[i].path;
      break;
    }
  }
  return path;
});
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  &-head {
    height: 100px;
    .header {
      box-sizing: border-box;
      height: 60px;
      border-bottom: $border-1 solid $color-border-2;
    }
    .tabs {
      height: 40px;
    }
  }
}

// 横向菜单样式
:deep(.t-head-menu .t-menu) {
  min-width: 0;
  overflow: auto hidden;

  // 调细滚动条
  &::-webkit-scrollbar {
    height: 4px; // 水平滚动条高度
  }
  &::-webkit-scrollbar-track {
    background: transparent; // 滚动轨道背景
  }
  &::-webkit-scrollbar-thumb {
    background: rgb(0 0 0 / 30%); // 滚动条颜色
    border-radius: 3px; // 滚动条圆角
    &:hover {
      background: rgb(0 0 0 / 50%); // 悬停时的颜色
    }
  }
}
:deep(.t-head-menu__inner .t-menu:first-child) {
  margin-left: 0;
}
:deep(.t-menu__logo > *) {
  margin-left: 0;
}
:deep(.t-head-menu .t-menu__logo) {
  margin-right: 16px;
}
:deep(.t-menu__operations) {
  margin-left: 16px;
}
</style>
