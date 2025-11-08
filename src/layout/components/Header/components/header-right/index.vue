<template>
  <t-space align="center" class="header_setting">
    <!-- 国际化 -->
    <t-dropdown placement="bottom" :options="langOptions" @click="onLange">
      <t-button size="small" shape="square" variant="text">
        <icon size="18px" name="translate-1" />
      </t-button>
    </t-dropdown>
    <!-- 切换黑夜模式 -->
    <t-tooltip
      :content="$t(`system.${!darkMode ? 'switch-to-night-mode' : 'switch-to-daytime-mode'}`)"
      placement="bottom"
      show-arrow
    >
      <t-button size="small" shape="square" variant="text" id="system-dark" @click="onNightMode">
        <icon size="18px" name="moon" v-if="darkMode" />
        <icon size="18px" name="sunny" v-else />
      </t-button>
    </t-tooltip>
    <!-- 通知 -->
    <t-popup placement="bottom" trigger="click" destroy-on-close>
      <t-badge dot :count="100">
        <icon size="16px" name="notification" />
      </t-badge>
      <template #content>
        <Notice />
      </template>
    </t-popup>
    <!-- 全屏 -->
    <t-tooltip :content="$t(`system.${fullScreen ? 'full-screen' : 'exit-full-screen'}`)" placement="bottom" show-arrow>
      <t-button size="small" shape="square" variant="text" id="system-fullscreen" @click="onFullScreen">
        <icon size="18px" name="fullscreen-1" v-if="fullScreen" />
        <icon size="18px" name="fullscreen-exit-1" v-else />
      </t-button>
    </t-tooltip>
    <!-- 系统设置 -->
    <t-tooltip :content="$t(`system.system-settings`)" placement="bottom" show-arrow>
      <t-button size="small" shape="square" variant="text" id="system-settings" @click="onSystemSetting">
        <icon size="18px" name="setting-1" />
      </t-button>
    </t-tooltip>
    <!-- 主题设置 -->
    <t-tooltip :content="$t(`system.theme-settings`)" placement="bottom" show-arrow>
      <t-button size="small" shape="square" variant="text" id="system-settings" @click="onThemeSetting">
        <icon size="18px" name="palette" />
      </t-button>
    </t-tooltip>
    <!-- 我的 -->
    <t-dropdown placement="bottom" trigger="hover">
      <div class="my_setting" id="system-my-setting">
        <t-image fit="cover" :src="account.user.avatar || myImage" :style="{ width: '32px', height: '32px' }" class="my_image" />
        <span class="user-nickname" v-if="!isMobile">{{ account.user.nickName }}</span>
        <div class="icon_down">
          <icon-down style="stroke-width: 3" />
        </div>
      </div>
      <template #dropdown>
        <t-dropdown-item @click="onPerson(1)">
          <s-svg-icon :name="'user'" :size="18" />
          <span class="margin-left">{{ $t(`system.personal-information`) }}</span>
        </t-dropdown-item>
        <t-dropdown-item @click="onPerson(2)">
          <s-svg-icon :name="'lock-pwd'" :size="18" />
          <span class="margin-left">{{ $t(`system.change-password`) }}</span>
        </t-dropdown-item>
        <t-dropdown-item :divider="true" @click="onProject">
          <s-svg-icon :name="'gitee'" :size="18" />
          <span class="margin-left">{{ $t(`system.project-address`) }}</span>
        </t-dropdown-item>
        <t-divider />
        <t-dropdown-item @click="logOut">
          <s-svg-icon :name="'exit'" :size="18" />
          <span class="margin-left">{{ $t(`system.logout`) }}</span>
        </t-dropdown-item>
      </template>
    </t-dropdown>
  </t-space>
  <SystemSettings v-model:system-open="systemOpen" />
  <ThemeSettings v-model:theme-open="themeOpen" />
</template>

<script setup lang="ts">
import Notice from "@/layout/components/Header/components/Notice/index.vue";
import SystemSettings from "@/layout/components/Header/components/system-settings/index.vue";
import ThemeSettings from "@/layout/components/Header/components/theme-settings/index.vue";
import myImage from "@/assets/img/my-image.jpg";
import { Icon } from "tdesign-icons-vue-next";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserInfoStore } from "@/store/modules/user-info";
import { useThemeConfig } from "@/store/modules/theme-config";
import { useThemeMethods } from "@/hooks/useThemeMethods";
import { useRouteConfigStore } from "@/store/modules/route-config";
import { DialogPlugin } from "tdesign-vue-next";
import { useDevicesSize } from "@/hooks/useDevicesSize";

const i18n = useI18n();
const router = useRouter();
const userStore = useUserInfoStore();
const themeStore = useThemeConfig();
const { account } = storeToRefs(userStore);
const { language, darkMode } = storeToRefs(themeStore);
const { isMobile } = useDevicesSize();

// 系统设置
const systemOpen = ref(false);
const onSystemSetting = () => {
  systemOpen.value = true;
};

// 主题设置
const themeOpen = ref(false);
const onThemeSetting = () => {
  themeOpen.value = true;
};
// 全屏
const fullScreen = ref(true);
const onFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullScreen.value = false;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      fullScreen.value = true;
    }
  }
};

// 黑暗模式
const onNightMode = () => {
  darkMode.value = !darkMode.value;
  let { setDarkMode } = useThemeMethods();
  setDarkMode();
};

// 语言
interface LangItem {
  content: string;
  value: string;
  disabled: boolean;
}
const langOptions = computed((): LangItem[] => {
  let list = [
    { content: "中文", value: "zh-CN", disabled: false },
    { content: "English", value: "en-US", disabled: false }
  ];
  list.forEach((item: LangItem) => {
    if (item.value === language.value) {
      item.disabled = true;
    } else {
      item.disabled = false;
    }
  });
  return list;
});
const onLange = (item: any) => {
  themeStore.setLanguage(item.value);
  i18n.locale.value = language.value;
};

// 个人中心
const onPerson = (type: number) => {
  router.push({
    path: "/system/userinfo",
    query: {
      id: account.value.user.id,
      userName: account.value.user.userName,
      type
    }
  });
};

// 项目地址
const onProject = () => {
  window.open("https://github.com/WangFan-io/SnowAdmin", "_blank");
};

// 退出登录
const logOut = () => {
  const confirmDialog = DialogPlugin.confirm({
    header: "提示",
    body: "确定退出登录？",
    confirmBtn: {
      content: "确定",
      theme: "primary",
      loading: false
    },
    theme: "warning",
    onConfirm: async () => {
      // 用户退出
      await userStore.logOut();
      router.replace("/login");
      // 清除路由数据
      useRouteConfigStore().resetRoute();
      confirmDialog.destroy();
    },
    onClose: () => {
      confirmDialog.destroy();
    }
  });
};
</script>

<style lang="scss" scoped>
// .head-absolute-fix {
//   position: absolute;
//   top: 0;
//   right: $padding;
// }
.my_setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  overflow: hidden;
  cursor: pointer;
  .my_image {
    display: flex;
    place-items: center;
    margin-right: 8px;
    border-radius: 50%;
  }
  .user-nickname {
    white-space: nowrap;
  }
  .icon_down {
    margin: 0 0 0 5px;
    transform: rotate(0deg);
    transition: transform 0.2s;
  }
}
.margin-left {
  margin-left: $margin-text;
}
</style>
