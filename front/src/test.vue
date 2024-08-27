<template>
  <div><component :is="comp"></component></div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
const { defineAsyncComponent } = window.Vue;
const { loadModule } = window["vue3-sfc-loader"];
export default {
  name: "App",
  data() {
    return {
      options: {
        moduleCache: {
          vue: window.Vue,
        },
        async getFile(url) {
          const res = await fetch(url);
          if (!res.ok) {
            throw Object.assign(new Error(`${res.statusText} ${url}`), { res });
          }
          return {
            getContentData: (asBinary) =>
              asBinary ? res.arrayBuffer() : res.text(),
          };
        },
        addStyle(textContent) {
          const style = Object.assign(document.createElement("style"), {
            textContent,
          });
          const ref = document.head.getElementsByTagName("style")[0] || null;
          document.head.insertBefore(style, ref);
        },
      },
    };
  },
  mounted() {
    // eslint-disable-next-line no-undef
    // console.log(defineAsyncComponent);
  },
  computed: {
    comp() {
      // eslint-disable-next-line no-undef
      return defineAsyncComponent(() =>
        loadModule("remote/test.vue", this.options)
      );
    },
  },
  components: {},
};
</script>

<style>
</style>
