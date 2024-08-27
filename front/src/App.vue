<template>
  <textarea id="codes" style="width: 500px; height: 500px" />
  <button @click="changeModule">构建</button>
  <iframe id="overviewer" src="preview/index.html" />
</template>

<script>
export default {
  name: "App",

  mounted() {},
  computed: {},
  components: {},
  methods: {
    changeModule() {
      const iFrame = document.getElementById("overviewer");
      const $codes = document.getElementById("codes");
      const code = $codes.value;
      // iFrame.contentWindow.postMessage('../remote/test3.vue');
      iFrame.contentWindow.postMessage(code);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  color:#ffffff;
}
</style>
