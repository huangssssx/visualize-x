<template>
  <div class="main-wrapper">
    父组件
    <Child></Child>
  </div>
</template>

<script>
import Child from "remote://108";
export default {
  components: { Child },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  background: red;
}
</style>
