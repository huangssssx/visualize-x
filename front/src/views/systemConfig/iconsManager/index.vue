<template>
  <div class="icon-manager-wrapper">
    <div class="header-container">
      <el-button type="primary" @click="openDlgHandler">增加</el-button>
    </div>
    <div class="content-container">
      <IconCard
        class="custom-icon-card"
        :key="`icon-card-${item.id}`"
        v-for="(item, index) in iconSourceData"
        :params="{ ...item, index }"
        @deleteCompleted="deleteImageHandler"
      />
      <i></i><i></i><i></i><i></i><i></i><i></i>
    </div>
  </div>
  <UploadImage
    :visible="dlgVisible"
    @close="dlgCloseHandler"
    @uploadCompleted="uploadCompletedHandler"
  />
</template>

<script>
import IconCard from "./iconCard.vue";
import UploadImage from "./uploadImageDlg.vue";
import { ElMessage } from "element-plus";
export default {
  components: {
    IconCard,
    UploadImage,
  },
  data() {
    return {
      iconSourceData: [],
      dlgVisible: false,
    };
  },
  mounted() {
    this.getIconsHandler();
  },
  methods: {
    async getIconsHandler() {
      const res = await this.$.appContext.config.globalProperties.$api.getIcons(
        {},
        "get"
      );
      if (res.code === 200) {
        this.iconSourceData = res.data;
      }
    },
    deleteImageHandler(index) {
      this.iconSourceData.splice(index, 1);
      ElMessage({
        message: "删除图片成功",
        type: "success",
      });
    },
    openDlgHandler() {
      this.dlgVisible = true;
    },
    dlgCloseHandler() {
      this.dlgVisible = false;
    },
    async uploadCompletedHandler(id) {
      const res =
        await this.$.appContext.config.globalProperties.$api.getIconById(
          { id },
          "get"
        );

      if (res.code === 200) {
        this.iconSourceData.push(res.data);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-manager-wrapper {
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // background: red;
  .header-container {
    display: flex;
    align-items: center;
    padding: 12px;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    background: #ffffff;
  }
  .content-container {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    gap: 20px;
  }
  .custom-icon-card {
    margin: 20px 0px 0 0;
  }

  .content-container > i {
    width: 200px;
    margin: 20px 0px 0 0;
  }
}

// .icon-manager-wrapper::after{
// 	    content:'';
// 	    flex:auto;
// 		width: 100px;
// 		height: 1px;
// 	 }
</style>
