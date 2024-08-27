<template>
  <el-dialog
    custom-class="child-dlg-wrapper"
    title="子组件管理列表"
    v-model="dialogVisible"
    width="1000px"
    @before-close="closeHandler"
    :close-on-press-escape="false"
  >
    <div class="button-bar">
      <el-button type="primary" @click="addChildHandler">增加子组件</el-button>
    </div>

    <el-table class="child-table" :data="sourceData" style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="引入路径" width="180" align="center">
        <template #default="scope">
          <span>{{ `remote://${scope.row.id}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200" align="center">
        <template #default="scope">
          <span >{{
            scope.row.name || "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="预览图" width="300" align="center">
        <template #default="scope">
          <div
            style="
              width: 100%;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <img style="width: 200px" :src="scope.row.icon" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="备注" align="center">
        <template #default="scope">
          {{ scope.row.comment || "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="timestamp" label="修改日期" align="center">
        <template #default="scope">
          {{
            moment(Number(scope.row.timestamp)).format("YYYY-MM-DD HH:mm:ss")
          }}
        </template>
      </el-table-column>
      <el-table-column prop="timestamp" label="操作" align="center">
        <template #default="scope">
          <el-button @click="deleteHandler(scope.row.id)">删除</el-button>
          <el-button @click="openEditWindow(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import IconsManager from "@/views/systemConfig/iconsManager/index.vue";
import api from "@/service/index";
import moment from "moment";
import { ElMessage, ElMessageBox } from "element-plus";
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
      default: () => ({
        parentId: "",
      }),
    },
  },
  data() {
    return {
      moment,
      sourceData: [],
      dialogVisible: true,
    };
  },
  mounted() {
    this.getChildrenList();
  },
  methods: {
    openEditWindow(id) {
      window.open(
        `${process.env.VUE_APP_PUBLIC_PATH}#/example?mode=edit&id=${id}`
      );
    },
    async deleteHandler(id) {
      ElMessageBox.confirm("你确认要删除这个子组件吗?", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await api
            .deleteComponent({ id }, "post")
            .catch((error) => error);
          if (res.code === 200) {
            ElMessage({
              message: "删除成功",
              type: "success",
            });
            this.getChildrenList();
          }
        })
        .catch(() => {});
    },
    addChildHandler() {
      window.open(
        `${process.env.VUE_APP_PUBLIC_PATH}#/example?mode=add&parentId=${this.params.parentId}`
      );
    },
    async getChildrenList() {
      const res = await api
        .getCompoentByParentId({ parentId: this.params.parentId })
        .catch((error) => error);
      if (res.code === 200) {
        this.sourceData = res.data || [];
      }
    },
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
.child-dlg-wrapper {
  background: #121d3d !important;
  .button-bar {
    width: 100%;
    height: 50px;
    background: #b9b7b739;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 20px;
  }
  .el-dialog__title {
    color: #ffffff;
  }

  .child-table {
    background: #121d3d !important;
    .el-table__header {
      .cell {
        color: #19f7ff;
      }
      th.el-table__cell {
        background: #121d3d !important;
        border-bottom: none;
      }
    }
    .el-table__body {
      background: #121d3d !important;
      .el-table__row {
        &:hover > td {
          background-color: #0c42758a !important;
          color: #ffffff;
        }
      }
      .el-table__row:nth-child(2n) {
        background: #0c4275;
      }
      .el-table__row:nth-child(2n-1) {
        background: #0c42754d;
      }

      .el-table__cell {
        border-bottom: none;
        border-top: none;
        color: #ffffff;
      }
    }
    .el-table__inner-wrapper {
      &::before {
        background: none;
      }
    }
  }
}
</style>

