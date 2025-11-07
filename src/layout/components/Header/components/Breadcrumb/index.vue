<template>
  <div id="system-breadcrumb" class="breadcrumb" v-if="!isMobile && isBreadcrumb">
    <t-breadcrumb>
      <template #default>
        <t-breadcrumb-item v-for="item in breadcrumb" :key="item.path" :class="transition" @click="onBreadcrumb(item)">
          {{ $t(`menu.${item?.meta?.title || ""}`) }}
        </t-breadcrumb-item>
      </template>
      <template #separator>
        <icon name="chevron-right-s" />
      </template>
    </t-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useRouteConfigStore } from "@/store/modules/route-config";
import { useDevicesSize } from "@/hooks/useDevicesSize";
import { findPathOfParentNode } from "@/utils/tree-tools";
import { HOME_PATH } from "@/config/index";
import { Icon } from "tdesign-icons-vue-next";
const themeStore = useThemeConfig();
const { isBreadcrumb, transitionPage } = storeToRefs(themeStore);
const routeConfigStore = useRouteConfigStore();
const { routeTree } = storeToRefs(routeConfigStore);
const { isMobile } = useDevicesSize();
const route = useRoute();
const router = useRouter();

/**
 * 获取面包屑
 * 根据当前路由信息获取，route.matched可以获取当前路由的所有父级路由信息
 * 如果当前路由是home路由，则只返回当前路由信息(说明当前就是顶层)
 * 否则返回所有父级路由信息，顶层路由重写为首页
 */
const breadcrumb = computed(() => {
  // 如果是首页则直接返回当前路由信息
  if (route.path === HOME_PATH) return [route];
  // 返回路径信息
  let list = findPathOfParentNode(routeTree.value, "name", route.name);
  if (!list) return [];
  if (!routeTree.value[0].children) list.unshift(routeTree.value[0]);
  return list;
});

// 页面过渡
const transition = computed(() => {
  if (transitionPage.value === "fadeInOut") {
    return "fadeInOut-enter-active";
  } else if (transitionPage.value === "cardInOut") {
    return "cardInOut-enter-active";
  } else {
    return "fadeOut-enter-active";
  }
});

// 面包屑跳转
const onBreadcrumb = (route: any) => {
  let path = route.redirect || route.path;
  router.replace((path as string) || HOME_PATH);
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  margin-left: $margin;
}
</style>
