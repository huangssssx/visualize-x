<template>
  <el-dialog
    title="上传图片资源"
    v-model="dialogVisible"
    width="240px"
    @before-close="closeHandler"
  >
    <div class="upload-image-wrapper">
      <div class="avatar-uploader">
        <el-icon style="width: 150px; height: 150px"><Plus /></el-icon>
        <img v-if="imageUrl" class="pre-image" :src="imageUrl" />
        <input class="file-input" type="file" @change="fileInputChange" />
      </div>
      <el-input
        class="comment"
        v-model="form.comment"
        :rows="3"
        type="textarea"
        show-word-limit
        :maxlength="255"
        placeholder="限制255个字"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeHandler">取消</el-button>
        <el-button type="primary" @click="submit"> 上传 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import api from "@/service/index";
import { ElMessage } from "element-plus";
export default {
  watch: {
    visible: {
      handler(visible) {
        this.dialogVisible = visible;
      },
      immediate: true,
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: true,
      imageUrl: "",
      form: {
        icon: "",
        type: "default",
        comment: "",
      },
    };
  },
  methods: {
    closeHandler() {
      this.$emit("close");
    },
    fileInputChange(event) {
      const $target = event.currentTarget;
      this.imageUrl = URL.createObjectURL($target.files[0]);
      this.form.icon = $target.files[0];
    },

    async submit() {
      if (!this.form.icon) {
        ElMessage({
          message: "请先选择一个图片",
          type: "error",
        });
        return;
      }
      const param = new FormData();
      const keys = Object.keys(this.form) || [];
      keys.forEach((key, index) => {
        param.append(key, this.form[key]);
      });
      const res = await api.addIcons(param, "upload").catch((error) => error);
      if (res.code === 200) {
        this.$emit("uploadCompleted", res.data.insertId);
        this.closeHandler();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-image-wrapper {
  width: 200px;
  height: 215px;
  .avatar-uploader {
    margin: 0 auto;
    width: 150px;
    height: 150px;
    display: block;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    .pre-image {
      cursor: pointer;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
    }
    .file-input {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      opacity: 0.01;
    }
  }

  .comment {
    width: 150px;
    margin-left: 25px;
    margin-top: 15px;
  }
}
</style>

