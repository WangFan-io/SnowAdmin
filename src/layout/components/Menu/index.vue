<template>
  <t-menu
    width="220px"
    :expandMutex="isAccordion"
    :theme="asideDark ? 'dark' : 'light'"
    :collapsed="collapsed"
    :value="selectedMenu"
    @change="onMenuItem"
  >
    <MenuItem :route-tree="props.routeTree" />
  </t-menu>
</template>

<script setup lang="ts">
import MenuItem from "@/layout/components/Menu/menu-item.vue";
import { MenuProps } from "tdesign-vue-next";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useRoutingMethod } from "@/hooks/useRoutingMethod";
const route = useRoute();
const router = useRouter();
const themeStore = useThemeConfig();
const { collapsed, isAccordion, asideDark } = storeToRefs(themeStore);

interface Props {
  routeTree: Menu.MenuOptions[];
}
// props的数据类型
// type类型参考：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = withDefaults(defineProps<Props>(), {
  routeTree: () => []
});

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
:deep(.t-default-menu__inner .t-menu) {
  padding: 4px var(--td-comp-paddingLR-s);
}
:deep(.t-menu__item) {
  height: var(--td-size-12);
}
</style>
