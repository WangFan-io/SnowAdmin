import { createApp } from "vue";
import "@/style.css";
import App from "@/App.vue";
// arco-design
import ArcoVue from "@arco-design/web-vue";
// vue-router
import router from "@/router/index";
// pinia
import pinia from "@/store/index";
// arco-css
import "@arco-design/web-vue/dist/arco.css";
// vchart-arco-theme 主题关联-黑暗模式
import { initVChartArcoTheme } from "@visactor/vchart-arco-theme";
// 额外引入图标库
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
// 注册全局svg
import "virtual:svg-icons-register";
// 引入i18n
import i18n from "@/lang/index";
// 引入字体
import "@/assets/fonts/fonts.scss";
// 引入自定义指令
import directives from "@/directives/index";
// 引入TD
import TDesign from "tdesign-vue-next";
// 引入组件库的少量全局样式变量
import "tdesign-vue-next/es/style/index.css";
// 引入TD主题
import "@/style/var/theme.css";

// vchart黑暗模式
// https://arco.design/react/docs/vchart
initVChartArcoTheme();

const app = createApp(App);

// app.use(plugin, options)
// 其中 plugin 表示要传递的插件对象， options 参数是可选的，表示选项配置
// https://cn.vuejs.org/api/application.html#app-use

app.use(ArcoVue, {
  componentPrefix: "arco"
});
app.use(TDesign);
app.use(pinia);
app.use(ArcoVueIcon);
app.use(router);
app.use(i18n);
app.use(directives);
app.mount("#app");
