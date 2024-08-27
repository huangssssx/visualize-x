<template>
  <el-drawer
    v-model="drawerVisible"
    @close="cancelClick"
    custom-class="details-drawer-container"
  >
    <template #title>
      <h4>详细信息</h4>
    </template>
    <template #default>
      <div class="row">
        <div class="title">名称</div>
        <div class="value"><el-input v-model="form.name" /></div>
      </div>
      <div class="row">
        <div class="title">封面图片(280*210)</div>
        <div class="value">
          <UploadImg
            @updateImgFile="updateImgFileHanlder"
            :sourcePath="form.icon"
            @clear="imageClearHandler"
          />
        </div>
      </div>

      <div class="row">
        <div class="title">描述</div>
        <div class="value">
          <el-input
            v-model="form.comment"
            :rows="6"
            type="textarea"
            show-word-limit
            :maxlength="255"
            placeholder="限制255个字"
          />
        </div>
      </div>

      <div class="row">
        <div class="title">类型</div>
        <div class="value">
          <el-select
            v-model="form.type"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
      </div>

      <div class="row">
        <div class="title">插入脚本</div>
        <div class="value">
          <el-input
            v-model="form.scripts"
            :rows="4"
            type="textarea"
            placeholder="插入script脚本或者link"
          />
        </div>
      </div>

      <div class="row">
        <div class="title">全局注册</div>
        <div class="value">
          <el-input
            v-model="form.globalRegisters"
            :rows="4"
            type="textarea"
            placeholder="用于在vue中注册全局组件，比如您引入了element plus.就需要在app中引入'ElementPlus'"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import UploadImg from "./uploadImg.vue";

export default {
  components: {
    UploadImg,
  },
  watch: {
    visible(state) {
      this.drawerVisible = state;
    },
    params(val) {
      if (val) {
        this.form.name = val.name;
        this.form.comment = val.comment;
        this.form.type = val.type;
        this.form.icon = val.icon;
        this.form.scripts = val.scripts;
        this.form.globalRegisters = val.globalRegisters;
      }
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({
        name: "",
        comment: "",
        icon: "",
        scripts: "",
        globalRegisters: "",
      }),
    },
  },
  data() {
    return {
      form: {
        name: "",
        icon: null,
        isclear: "",
        type: "",
        scripts: "",
        globalRegisters: "",
      },
      drawerVisible: false,
      types: [],
    };
  },
  mounted() {
    this.getTypes();
  },
  methods: {
    async getTypes() {
      const res = await this.$.appContext.config.globalProperties.$api
        .getTypes({}, "get")
        .catch((error) => error);

      if (res.code === 200) {
        this.types = res.data;
      }
    },
    imageClearHandler() {
      this.form.isclear = true;
    },
    updateImgFileHanlder(imgFile) {
      if (imgFile) {
        this.form.icon = imgFile;
      }
    },
    confirmClick() {
      this.$emit("form", this.form);
      this.$emit("update:visible", false);
    },
    cancelClick() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.details-drawer-container {
  .row {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .title {
      text-align: center;
      width: 20%;
      font-size: 14px;
      color: #606266;
      height: 32px;
      line-height: 32px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
    }
    .value {
      width: 80%;
    }
  }
}
</style>
