<template>
  <t-header class="header">
    <div class="header-nav">
      <HeaderLeft />
      <HeaderRight />
    </div>
    <Tabs v-if="isTabs" />
  </t-header>
</template>
<script setup lang="ts">
import HeaderLeft from "@/layout/components/Header/components/header-left/index.vue";
import HeaderRight from "@/layout/components/Header/components/header-right/index.vue";
import Tabs from "@/layout/components/Tabs/index.vue";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
const themeStore = useThemeConfig();
let { isTabs } = storeToRefs(themeStore);
</script>

<style lang="scss" scoped>
.header {
  height: 100px;
  .header-nav {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 $padding;
    border-bottom: $border-1 solid $color-border-2;
  }
}
</style>
