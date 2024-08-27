<template>
  <div class="system-config-wrapper">
    <div class="left-container">
      <el-menu default-active="1" class="el-menu-vertical" @select="handleOpen">
        <el-menu-item index="1">
          <el-icon><Picture /></el-icon>
          <span>图片资源管理</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><Grid style="color: #409eff" /></el-icon>
          <span>类型管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><Management style="color: #409eff" /></el-icon>
          <span>第三方库管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
      if (key === "1") {
        this.$router.push("/system/iconsManager");
      } else if (key === "2") {
        this.$router.push("/system/typeManager");
      } else if (key === "3") {
        this.$router.push("/system/javascriptManager");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.system-config-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  background: #000e2c;
  .left-container {
    width: 300px;
    height: 100%;
    // background: red;
    .el-menu-vertical {
      background: #121d3d;
      border: none;
      height: 100%;
      span {
        color: #ffffff;
      }

      .is-active span {
        color: #409eff;
      }

      .el-menu-item:hover span {
        color: var(--el-text-color-regular) !important;
      }
    }
  }
  .right-container {
    width: calc(100% - 300px);
    height: 100%;
  }
}
</style>
