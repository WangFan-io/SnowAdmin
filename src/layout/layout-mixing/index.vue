<template>
  <t-layout class="layout">
    <div :class="asideDark ? 'aside dark' : 'aside'" v-if="isPc">
      <Logo />
      <t-aside class="layout_side" :width="asideWidth">
        <Menu :route-tree="routeList" />
      </t-aside>
    </div>
    <t-layout class="layout-right">
      <t-header class="header">
        <div class="header-nav">
          <div class="header-nav-left">
            <ButtonCollapsed />
            <Breadcrumb v-if="!isPc" />
          </div>
          <div class="header-nav-center" v-if="isPc">
            <t-head-menu v-model="selectedMenu" theme="light" @change="onMenuItem">
              <template v-for="item in routeTree" :key="item.path">
                <t-menu-item v-if="!item.meta.hide" :key="item.path" :value="item.path">
                  <template #icon v-if="item.meta.svgIcon || item.meta.icon">
                    <MenuItemIcon :svg-icon="item.meta.svgIcon" :icon="item.meta.icon" />
                  </template>
                  <span>{{ $t(`menu.${item.meta.title}`) }}</span>
                </t-menu-item>
              </template>
            </t-head-menu>
          </div>
          <HeaderRight />
        </div>
        <div class="tabs">
          <Tabs v-if="isTabs" />
        </div>
      </t-header>
      <Main />
      <Footer v-if="isFooter" />
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import Logo from "@/layout/components/Logo/index.vue";
import Main from "@/layout/components/Main/index.vue";
import Menu from "@/layout/components/Menu/index.vue";
import Tabs from "@/layout/components/Tabs/index.vue";
import Footer from "@/layout/components/Footer/index.vue";
import HeaderRight from "@/layout/components/Header/components/header-right/index.vue";
import MenuItemIcon from "@/layout/components/Menu/menu-item-icon.vue";
import ButtonCollapsed from "@/layout/components/Header/components/button-collapsed/index.vue";
import Breadcrumb from "@/layout/components/Header/components/Breadcrumb/index.vue";
import { HeadMenuProps } from "tdesign-vue-next";
import { useRouteConfigStore } from "@/store/modules/route-config";
import { useRoutingMethod } from "@/hooks/useRoutingMethod";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useDevicesSize } from "@/hooks/useDevicesSize";
defineOptions({ name: "LayoutMixing" });
const route = useRoute();
const router = useRouter();
const routerStore = useRouteConfigStore();
const themeStore = useThemeConfig();
const { isFooter, collapsed, asideDark, isTabs, language } = storeToRefs(themeStore);
const { routeTree } = storeToRefs(routerStore);
const { isPc } = useDevicesSize();

const drawing = ref<boolean>(true);
watch(language, () => {
  drawing.value = false;
  nextTick(() => (drawing.value = true));
});

const asideWidth = computed(() => (collapsed.value ? "64px" : "220px"));

// 横向菜单点击事件
// 将一级菜单下的children给左侧菜单
// 如果没有children则直接自身菜单给左侧菜单
const routeList = ref<any>([]);
const onMenuItem: HeadMenuProps["onChange"] = path => {
  const { findLinearArray } = useRoutingMethod();
  const find = findLinearArray(path as string);
  // 路由存在则存入并跳转，不存在则跳404
  if (find) {
    // 给左侧树赋值
    setAside(find);
    // 若有重定向，则跳转到重定向的路由
    // 如果有子路由则重定向到自己的第一个菜单
    // 如果没有子路由则说明当前父级是一个菜单，直接跳转
    let path = "";
    if (find.redirect) {
      path = find.redirect;
    } else if (find.children && find.children.length > 0) {
      path = find.children[0].path;
    } else {
      path = find.path;
    }
    router.push(path);
  } else {
    router.push("/404");
  }
};

// 给左侧树赋值
const setAsideMenu = (find: Menu.MenuOptions) => {
  // 将父级的chindren给左侧树
  if (find.children && find.children.length > 0) {
    routeList.value = find.children;
  } else {
    // 如果没有则直接将父级给左侧树，做一级兜底
    routeList.value = [find];
  }
};

const setAside = debounce(setAsideMenu, 150);

// 由于刷新后，路由信息丢失，所以需要重新获取
// 混合布局的横向菜单为顶层路由下的一级菜单
const selectedMenu = computed({
  get() {
    const { getAllParentRoute } = useRoutingMethod();
    // 动态路由参数会在path拼接，导致匹配失败
    // 这取matched做路由匹配
    const find = getAllParentRoute(route.matched.at(-1).path);
    if (find) {
      setAside(find[0]);
      return find[0].path;
    }
    return "";
  },
  set() {
    // 实际的菜单变更通过 @change 事件处理
    // 这里保留空的 setter 仅仅是为了满足 v-model 的类型要求
    // 避免在 setter 中执行任何逻辑以防止重复调用
  }
});
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
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
  .layout-right {
    min-width: 0;
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
        .header-nav-left {
          display: flex;
          align-items: center;
        }
        .header-nav-center {
          flex: 1;
          min-width: 0;
          margin: 0 14px;
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
      }
      .tabs {
        height: 40px;
      }
    }
  }
}

// 横向菜单样式
:deep(.t-head-menu__inner .t-menu:first-child) {
  margin-left: 0;
}
</style>
