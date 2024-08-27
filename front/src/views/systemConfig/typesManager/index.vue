<template>
  <div class="types-manager-wrapper">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag.id"
      class="custom-tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      size="large"
    >
      {{ tag.name }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="input"
      size="small"
      @keyup.enter="addHandler"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag ml-1"
      size="small"
      @click="showInput"
    >
      + New Tag
    </el-button>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  data() {
    return {
      inputVisible: false,
      dynamicTags: [],
      inputValue: "",
    };
  },
  mounted() {
    this.getTypesHandler();
  },
  methods: {
    async getTypesHandler() {
      const res = await this.$.appContext.config.globalProperties.$api.getTypes(
        {},
        "get"
      );
      if (res.code === 200) {
        this.dynamicTags = res.data;
      }
    },
    async addHandler() {
      const res = await this.$.appContext.config.globalProperties.$api
        .addType({ name: this.inputValue, comment: "" }, "post")
        .catch((error) => error);
      if (res.code === 200) {
        this.dynamicTags.push({ name: this.inputValue });
        ElMessage({
          message: "添加类型数据成功",
          type: "success",
        });
      } else if (res.code === 1062) {
        ElMessage({
          message: "已存在同名类型",
          type: "error",
        });
      } else {
        ElMessage({
          message: "新增类型错误",
          type: "error",
        });
      }

      this.inputVisible = false;
    },
    async handleClose(tag) {
      ElMessageBox.confirm("确认要删除这个类型数据吗?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$.appContext.config.globalProperties.$api
            .deleteType({ id: tag.id }, "post")
            .catch((error) => error);
          if (res.code === 200) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
          } else {
            ElMessage({
              message: "删除类型错误",
              type: "error",
            });
          }
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
    handleInputConfirm() {
      this.inputVisible = false;
      this.inputValue = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.InputRef.input.focus();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.types-manager-wrapper {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .custom-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .input {
    width: 86px;
  }
}
</style>
