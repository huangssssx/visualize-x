<template>
  <el-dialog
    custom-class="icon-dlg-wrapper"
    title="图片资源管理"
    v-model="dialogVisible"
    width="1000px"
    @before-close="closeHandler"
    :close-on-press-escape="false"
  >
    <IconsManager />
  </el-dialog>
</template>

<script>
import IconsManager from "@/views/systemConfig/iconsManager/index.vue";
export default {
  components: { IconsManager },
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

<style lang="scss" >
.icon-dlg-wrapper {
  background: #121d3d !important;
  .el-dialog__title {
    color: #ffffff;
  }
}
</style>

