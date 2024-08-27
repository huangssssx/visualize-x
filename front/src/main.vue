<template>
  <router-view></router-view>
</template>

<script>
export default {};
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
}

::-webkit-scrollbar {
  width: 2px;
  height: 1px;
  background-color: transparent;
}

/*滑块*/
::-webkit-scrollbar-thumb {
  background-color: #122d63;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #122d63;
}

/*滑道*/
::-webkit-scrollbar-track {
  height: 240px;
  border-radius: 5px;
  background-color: transparent;
}
</style>
