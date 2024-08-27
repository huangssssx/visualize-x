import { createRouter, createWebHashHistory } from "vue-router";
// import Vue from 'vue';
// const Home = () =>  import("../views/home/index.vue");
import Layout from "@/layout/layout.vue";
import ExampleLayout from "@/views/example/index.vue";
import Home from "@/views/home/index.vue";
import SystemConfig from "@/views/systemConfig/index.vue";
import IconsManager from "@/views/systemConfig/iconsManager";
import TypeManager from "@/views/systemConfig/typesManager";
import JavascriptManager from "@/views/systemConfig/javascriptManager";
// Vue.use(VueRouter);
// import Keeplive from "@/views/keeplive/index.vue";
// const Keeplive = ()=>  import("../views/keeplive/index.vue");
const routes = [
  // { path: '/example', component: ExampleLayout, name: 'example' },
  // { path: '/keeplive', component:  Keeplive,name:"Keeplive"},
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: "/home",
    meta: {
      title: "主页",
    },
    children: [
      {
        path: "home",
        name: "home",
        component: Home,
      },
      {
        path: "example",
        name: "example",
        component: ExampleLayout,
      },
      {
        path: "system",
        name: "system",
        component: SystemConfig,
        redirect: "/system/iconsManager",
        meta: {
          title: "设置",
        },
        children: [
          {
            path: "iconsManager",
            name: "iconsManager",
            component: IconsManager,
          },

          {
            path: "typeManager",
            name: "typeManager",
            component: TypeManager,
          },
          {
            path: "javascriptManager",
            name: "javascriptManager",
            component: JavascriptManager,
          },
        ],
      },
    ],
  },
];

// const router = new VueRouter({
//   // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
//   // history: VueRouter.createWebHashHistory(),
//   mode: 'hash',
//   routes, // `routes: routes` 的缩写
// });

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
