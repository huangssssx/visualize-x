<template>
  <div class="lay-out-wrapper">
    <div class="header-container">
      <div class="inner-container">
        <!-- <div class="title">可视化图表组件开发示例</div> -->
        <div class="title-container">
          <div class="main-title" @click="this.$router.push('/home')">
            可视化图表组件开发示例
          </div>
          <div v-if="subName" class="line"></div>
          <div class="sub-title">{{ subName }}</div>
        </div>
        <el-tooltip
          class="box-item"
          effect="dark"
          content="设置"
          placement="bottom-start"
        >
          <div class="system-icon" @click="jump"><Setting /></div>
        </el-tooltip>
      </div>
    </div>
    <div class="body-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["subName"]),
  },
  methods: {
    jump() {
      this.$router.push("system");
    },
  },
};
</script>

<style lang="scss" scoped>
.lay-out-wrapper {
  width: 100%;
  height: 100%;
  .header-container {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 70px;
    background: #121d3d;
    .inner-container {
      width: 1200px;
      height: 100%;
      // border: 1px solid #ff0000;

      .system-icon {
        position: absolute;
        top: 25px;
        right: 25px;
        width: 24px;
        height: 24px;
        color: #ffffff;
        cursor: pointer;
      }

      .title-container {
        width: 100%;
        height: 50px;
        background: #121d3d;
        display: flex;
        justify-content: left;
        align-items: center;
        .main-title {
          margin-left: 20px;
          font-family: MicrosoftYaHei-Bold;
          font-size: 18px;
          font-weight: bold;
          line-height: 26px;
          letter-spacing: 0px;
          color: #ffffff;
          cursor: pointer;
        }
        .line {
          margin-left: 16px;
          width: 1px;
          height: 20px;
          opacity: 1;
          background: rgba(255, 255, 255, 0.3);
        }

        .sub-title {
          margin-left: 16px;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: 0px;
          color: #ffffff;
        }
      }
    }
  }

  .body-container {
    width: 100%;
    height: calc(100% - 70px);
  }
}
</style>
