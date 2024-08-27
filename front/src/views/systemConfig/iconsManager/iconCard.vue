<template>
  <div class="icon-card-wrapper">
    <!-- <img class="icon" :src="params.icon" /> -->
    <el-image
      class="icon"
      :src="params.icon"
      :zoom-rate="1.2"
      :preview-src-list="[params.icon]"
      :initial-index="4"
      fit="cover"
    />
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="`${params.name} 复制图片路径到剪贴板`"
      placement="top-start"
    >
      <div class="name" @click="copyToClipboard(params.icon)">
        {{ params.name }}
      </div>
    </el-tooltip>

    <div class="close" @click="deleteHandler">
      <el-icon><Close /></el-icon>
    </div>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import {copy } from "@/utils"
export default {
  props: {
    params: {
      type: Object,
      default: () => ({ icon: "" }),
    },
  },
  methods: {
    copyToClipboard(text) {
      copy(text);
      ElMessage({
        message: "路径复制成功",
        type: "success",
      });
    },
    deleteHandler() {
      ElMessageBox.confirm("你确认要删除这个图片资源吗?", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res =
            await this.$.appContext.config.globalProperties.$api.deleteIcon(
              { id: this.params.id },
              "post"
            );

          if (res.code === 200) {
            this.$emit("deleteCompleted", this.params.index);
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-card-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  // background: yellow;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    width: 100%;
    height: 80px;
    // height: 80px;
  }
  .name {
    width: 100%;
    height: 20px;
    cursor: pointer;
    margin-top: 10px;
    color: #ffffff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:hover .close {
    display: flex;
  }

  .close {
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: absolute;
    right: -15px;
    top: -15px;
    width: 30px;
    height: 30px;
    background: #ffffff;
    border-radius: 50%;
  }
}
</style>
