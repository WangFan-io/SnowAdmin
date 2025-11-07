<template>
  <div :class="asideDark ? 'aside dark' : 'aside'">
    <Logo />
    <t-aside class="layout_side" :width="asideWidth">
      <Menu :route-tree="routeTree" />
    </t-aside>
  </div>
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

const asideWidth = computed(() => (collapsed.value ? "64px" : "220px"));
</script>

<style lang="scss" scoped>
.aside {
  display: flex;
  flex-direction: column;
  width: v-bind(asideWidth);
  background: white;
  border-right: $border-1 solid $color-border-2;
  transition: width 0.24s cubic-bezier(0.33, 0.66, 0.66, 1);
}
.dark {
  background: #232324;
}
.layout_side {
  overflow: hidden;
}
</style>
