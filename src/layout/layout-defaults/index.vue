<template>
  <t-layout class="layout">
    <Aside v-if="isPc" />
    <t-layout class="layout-right">
      <Header />
      <Main />
      <Footer v-if="isFooter" />
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import Aside from "@/layout/components/Aside/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Main from "@/layout/components/Main/index.vue";
import Footer from "@/layout/components/Footer/index.vue";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useDevicesSize } from "@/hooks/useDevicesSize";

defineOptions({ name: "LayoutDefaults" });

const themeStore = useThemeConfig();
let { isFooter } = storeToRefs(themeStore);

const { isPc } = useDevicesSize();
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  .layout-right {
    min-width: 0;
  }
}
</style>
