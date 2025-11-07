<template>
  <div class="tabs">
    <div class="tabs-chunk">
      <t-tabs :value="currentRoute.path" scroll-position="auto" theme="normal" @change="onTabs">
        <t-tab-panel v-for="item of tabsList" :key="item.path" :value="item.path" :removable="!item.meta.affix">
          <template #label>{{ $t(`menu.${item.meta.title}`) }}</template>
        </t-tab-panel>
      </t-tabs>
    </div>
    <div class="tabs_setting">
      <t-space align="center">
        <t-tooltip :content="$t(`system.refresh`)" placement="bottom" show-arrow>
          <span id="system-tabs-refresh" class="refresh" :class="{ rotating: rotateOpen }" @click="refresh">
            <icon size="18px" name="refresh" />
          </span>
        </t-tooltip>

        <t-dropdown placement="bottom" trigger="hover">
          <div class="setting" id="system-tabs-setting">
            <icon size="18px" name="grid-view" />
          </div>
          <template #dropdown>
            <t-dropdown-item @click="closeCurrent">
              <icon size="18px" name="close" />
              <span class="margin-left">{{ $t(`system.close-current`) }}</span>
            </t-dropdown-item>
            <t-dropdown-item @click="closeSides('left')">
              <icon size="18px" name="chevron-left" />
              <span class="margin-left">{{ $t(`system.close-left-side`) }}</span>
            </t-dropdown-item>
            <t-dropdown-item @click="closeSides('right')">
              <icon size="18px" name="chevron-right" />
              <span class="margin-left">{{ $t(`system.close-right-side`) }}</span>
            </t-dropdown-item>
            <t-dropdown-item @click="closeOther('other')">
              <icon size="18px" name="close-circle" />
              <span class="margin-left">{{ $t(`system.close-other`) }}</span>
            </t-dropdown-item>
            <t-dropdown-item @click="closeOther('all')">
              <icon size="18px" name="folder-minus" />
              <span class="margin-left">{{ $t(`system.close-all`) }}</span>
            </t-dropdown-item>
          </template>
        </t-dropdown>
      </t-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "tdesign-icons-vue-next";
import { storeToRefs } from "pinia";
import { useRouteConfigStore } from "@/store/modules/route-config";
import { useThemeConfig } from "@/store/modules/theme-config";
const router = useRouter();
const routerStore = useRouteConfigStore();
const { tabsList, currentRoute } = storeToRefs(routerStore);

// 点击标签页，如果标签页存在，则跳转
const onTabs = (key: any) => {
  router.push(key);
};

// 删除当前标签页并跳转到最后一个标签页
const onDelete = (path: string) => {
  routerStore.removeTabsList(path);
  routerStore.removeRouteName(path);
  if (tabsList.value.length == 0) return;
  if (currentRoute.value.path != path) return;
  router.push(tabsList.value.at(-1).path);
};

// 刷新当前页
const rotateOpen = ref(false);
const refresh = () => {
  rotateOpen.value = true;
  setTimeout(() => {
    rotateOpen.value = false;
  }, 500);
  const themeStore = useThemeConfig();
  themeStore.setRefreshPage(false);
  currentRoute.value.meta.keepAlive && routerStore.removeRouteName(currentRoute.value.path);
  nextTick(() => {
    themeStore.setRefreshPage(true);
    currentRoute.value.meta.keepAlive && routerStore.setRoutePaths(currentRoute.value.path);
  });
};

// 关闭当前
const closeCurrent = () => {
  onDelete(currentRoute.value.path);
};

// 关闭右侧&关闭左侧
const closeSides = (type: string) => {
  // 获得当前index
  let currentIndex = tabsList.value.findIndex((item: Menu.MenuOptions) => item.path === currentRoute.value.path);
  // 过滤出两侧可关闭的 affix: false 表示可关闭
  let rightList = tabsList.value.filter((item: Menu.MenuOptions, index: number) => {
    if (type == "right") {
      if (index > currentIndex && !item.meta.affix) return item;
    } else {
      if (index < currentIndex && !item.meta.affix) return item;
    }
  });
  // 返回可关闭名称
  let rightPaths = rightList.map((item: Menu.MenuOptions) => item.path);
  // 删除右侧
  tabsList.value = tabsList.value.filter((item: Menu.MenuOptions) => !rightPaths.includes(item.path));
  // 删除缓存
  routerStore.removeRoutePaths(rightPaths);
};

// 关闭其它&关闭全部
const closeOther = (type: string) => {
  // 过滤出可关闭项 affix: false 表示可关闭
  let list = tabsList.value.filter((item: Menu.MenuOptions) => {
    if (type == "other") {
      if (item.path != currentRoute.value.path && !item.meta.affix) {
        return item;
      }
    } else {
      if (!item.meta.affix) {
        return item;
      }
    }
  });
  // 返回可关闭名称
  let rightNames = list.map((item: Menu.MenuOptions) => item.path);
  // 删除可关闭项
  tabsList.value = tabsList.value.filter((item: Menu.MenuOptions) => !rightNames.includes(item.path));
  // 删除缓存
  routerStore.removeRoutePaths(rightNames);
  // 关闭全部，若当前被关闭则跳转最后一个
  if (tabsList.value.length != 0 && !currentRoute.value.meta.affix && type == "all") {
    router.push(tabsList.value.at(-1).path);
  }
};
</script>

<style lang="scss" scoped>
.tabs {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  background: white;
  border-bottom: $border-1 solid $color-border-2;
  .tabs-chunk {
    flex: 1;
    width: 0;
  }
  .refresh {
    display: inline-block;
    transform: rotate(0deg);
    transition: transform 0.5s ease-in-out;
    &.rotating {
      animation: rotate-and-stay 0.5s forwards;
    }
  }

  @keyframes rotate-and-stay {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .tabs_setting {
    margin: 0 0 0 $margin;
    .setting {
      margin-right: $margin;
      color: $color-text-2;
    }
  }
}
.margin-left {
  margin-left: $margin-text;
}

// 自定义td tab样式
:deep(.t-tabs__nav-item.t-size-m) {
  height: 40px;
  line-height: 40px;
}
:deep(.t-tabs__nav-item-wrapper) {
  // padding: 0;
  margin: 0;
}

// td tabs文字样式
:deep(.t-tabs__nav-item.t-is-active) {
  text-shadow: none;
}

// 高亮的横条
:deep(.t-tabs__bar.t-is-top) {
  // width: unset;
  height: 2px;
}

// td tab滚动按钮样式
:deep(.t-tabs__btn.t-size-m) {
  width: 30px;
  height: 39px;
  line-height: 39px;
}
:deep(.t-tabs__operations--right .t-tabs__btn:first-child) {
  box-shadow: none;
}
:deep(.t-tabs__btn) {
  background: transparent;
  border-left: none;
}
:deep(.t-tabs__btn--left) {
  border-right: none;
  box-shadow: none;
}
:deep(.t-tabs__operations) {
  border-bottom: $border-1 solid $color-border-2;
}

// 关闭按钮
:deep(.t-tabs__nav-item) {
  .remove-btn {
    margin-left: none;
  }
}
</style>
<style lang="scss"></style>
