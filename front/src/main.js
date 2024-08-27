import { createApp } from "vue";
// import Vue from "vue";
// import App from './App.vue';
// import Test from './test.vue';
import store from "./store";
import router from "@/router/index";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import Main from "./main.vue";
import "normalize.css/normalize.css";
import "@/assets/font/font_low1ez59p6/iconfont.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import api from "@/service/index";
window.VUE_APP_INSTANCE_PREFIX = process.env.VUE_APP_INSTANCE_PREFIX;
window.VUE_APP_BACKGROUND_ADDRESS = process.env.VUE_APP_BACKGROUND_ADDRESS;
const app = createApp(Main);
app.use(ElementPlus, { size: "small", zIndex: 3000 });
app.use(router);
app.use(store);
app.use(global);
app.config.globalProperties.$api = api;

app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
