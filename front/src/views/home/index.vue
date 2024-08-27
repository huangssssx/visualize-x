<template>
  <div class="home-wrapper">
    <div class="body-container">
      <el-button-group class="button-bar">
        <el-button
          type="primary"
          @click="
            this.$router.push({ path: '/example', query: { mode: 'add' } })
          "
        >
          <el-icon><Plus /></el-icon>
        </el-button>
      </el-button-group>
      <div
        class="area-container"
        :key="key"
        v-for="(coms, key) in comSplitByTypeMap"
      >
        <div class="sub-title">{{ key }}</div>
        <div class="area-body-container">
          <Card
            :key="`${item.name}_${index}`"
            v-for="(item, index) in coms"
            :params="item"
            class="custom-card"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "./components/card.vue";
import api from "@/service/index";
export default {
  components: {
    Card,
  },
  data() {
    return {
      coms: [],
      comSplitByTypeMap: {},
    };
  },
  async mounted() {
    const res = await api.getComponents();
    if (res.code === 200) {
      // this.coms = res.data;
      //将list分类
      const list = res.data || [];
      const comSplitByTypeMap = {};
      list.forEach((component) => {
        if (!comSplitByTypeMap[component.type]) {
          comSplitByTypeMap[component.type] = [];
        }
        comSplitByTypeMap[component.type].push(component);
      });
      this.comSplitByTypeMap = comSplitByTypeMap;
    }

    this.$store.dispatch("index/setSubName", "");
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
  background: #000e2c;

  .body-container {
    // border: 1px solid #ff0000;
    position: relative;
    width: 1200px;
    min-height: calc(100% - 70px - 2px);

    .button-bar {
      position: absolute;
      top: 35px;
      right: 0px;
      z-index: 9999;
    }
    .area-container {
      margin-top: 32px;
      width: 100%;
      // min-height: 588px;
      // border: 1px solid #00ff00;
      .sub-title {
        position: relative;
        width: 100%;
        height: 32px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 18px;
        font-weight: bold;
        line-height: 26px;
        letter-spacing: 0px;
        color: #ffffff;
        &::after {
          left: 0px;
          bottom: 0px;
          position: absolute;
          content: " ";
          width: 38px;
          height: 2px;
          background: #159aff;
        }
      }
      .area-body-container {
        display: flex;
        flex-flow: wrap;
        margin-top: 16px;
        width: 100%;
        height: calc(100% - 32px);
        // background: red;
        .custom-card {
          margin-right: 25px;
          cursor: pointer;
        }
        .custom-card:nth-child(4n) {
          margin-right: 0px;
        }
      }
    }
  }
}
</style>
