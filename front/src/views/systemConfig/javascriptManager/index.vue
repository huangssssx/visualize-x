<template>
  <div class="javascript-manager-wrapper">
    <!-- <input type="file" multiple @change="fileInputChange" /> -->
    <el-upload
      :disabled="uploadDisable"
      :key="uploadKey"
      ref="uploadRef"
      class="upload-demo"
      name="files"
      :data="{ rootPath: currentParentPath }"
      :action="`${VUE_APP_INSTANCE_PREFIX}/api/javascriptManager/add`"
      :auto-upload="false"
      :on-success="successHandler"
      :on-error="errorHandler"
      multiple
    >
      <template #trigger>
        <el-button :disabled="uploadDisable" type="primary">选择文件</el-button>
      </template>

      <el-button
        class="handle-upload"
        type="success"
        :disabled="uploadDisable"
        @click="submitUpload"
      >
        上传服务器
      </el-button>

      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
    <!-- <button @click="submit">上传</button> -->
    <el-button @click="deleteNodes" :disabled="deleteButtonDisable"
      >删除</el-button
    >
    <el-button @click="addFolder" :disabled="addFolderDisable"
      >增加文件夹</el-button
    >
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      @node-click="nodeClickHandler"
      @check="checkedHandler"
      class="tree-class"
      show-checkbox
      :check-strictly="true"
      highlight-current
      :default-expand-all="true"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <el-button
            text
            type="primary"
            style="margin-left: 20px"
            @click="copyAddressHandler(data)"
            >地址</el-button
          >
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import api from "@/service/index";
import { ElMessage, ElMessageBox } from "element-plus";
import { copy } from "@/utils";
export default {
  data() {
    return {
      files: [],
      defaultProps: {
        children: "children",
        class: (data, node) => {
          if (data.type === "file") {
            return "file-wrapper";
          } else if (data.type === "dir") {
            return "dir-wrapper";
          } else if (data.type === "root") {
            return "root-wrapper";
          }
        },
        // label: (data, node) => {
        // },
      },
      data: [
        // {
        //   label: "Level one 1",
        //   children: [
        //     {
        //       label: "Level two 1-1",
        //       children: [
        //         {
        //           label: "Level three 1-1-1",
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   label: "Level one 2",
        //   children: [
        //     {
        //       label: "Level two 2-1",
        //       children: [
        //         {
        //           label: "Level three 2-1-1",
        //         },
        //       ],
        //     },
        //     {
        //       label: "Level two 2-2",
        //       children: [
        //         {
        //           label: "Level three 2-2-1",
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   label: "Level one 3",
        //   children: [
        //     {
        //       label: "Level two 3-1",
        //       children: [
        //         {
        //           label: "Level three 3-1-1",
        //         },
        //       ],
        //     },
        //     {
        //       label: "Level two 3-2",
        //       children: [
        //         {
        //           label: "Level three 3-2-1",
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
      VUE_APP_INSTANCE_PREFIX:
        process.env.NODE_ENV === "development"
          ? window.VUE_APP_INSTANCE_PREFIX
          : "",
      currentParentPath: "",
      uploadKey: Date.now(),
      checkedNodes: [],
    };
  },
  computed: {
    addFolderDisable() {
      return this.currentParentPath ? false : true;
    },
    uploadDisable() {
      return this.currentParentPath ? false : true;
    },
    deleteButtonDisable() {
      return !this.checkedNodes || this.checkedNodes.length <= 0;
    },
  },
  mounted() {
    this.getTree();
  },
  methods: {
    copyAddressHandler(data) {
      const path = `${window.VUE_APP_BACKGROUND_ADDRESS}javascriptManager${data.path}`;
      copy(path);
      ElMessage({
        type: "success",
        message: `"${path}" 已复制到剪贴板！`,
      });
    },
    addFolder() {
      ElMessageBox.prompt("请输入文件夹名称", "增加文件夹", {
        confirmButtonText: "确定",
        cancelButtonText: "退出",
      })
        .then(async ({ value }) => {
          await this.$.appContext.config.globalProperties.$api.addFolderJavascripts(
            { folderName: value, parentPath: this.currentParentPath },
            "post"
          );

          ElMessage({
            type: "success",
            message: `文件夹${value}增加成功`,
          });

          this.getTree();
        })
        .catch(() => {
          // ElMessage({
          //   type: "info",
          //   message: "Input canceled",
          // });
        });
    },
    checkedHandler(checkedNodes, props) {
      this.checkedNodes = props.checkedNodes;
    },
    successHandler() {
      this.uploadKey = Date.now();
      ElMessage({
        message: "上传成功",
        type: "success",
      });
      // setTimeout(() => {
      //   document.querySelector(".el-upload__input").webkitdirectory = true;
      // }, 1000);
      this.getTree();
    },
    errorHandler() {
      ElMessage({
        message: "上传失败",
        type: "error",
      });
    },
    nodeClickHandler(node, data) {
      if (node.type === "root") {
        this.currentParentPath = "/";
      } else {
        if (node.type === "file") {
          if (data.parent.data.type === "root") {
            this.currentParentPath = "/";
          } else {
            this.currentParentPath = data.parent.data.path;
          }
        } else {
          this.currentParentPath = node.path;
        }
      }
      // console.log("$$$", this.currentParentPath);
    },
    submitUpload() {
      this.$refs.uploadRef.submit();
    },
    deleteNodes() {
      ElMessageBox.confirm("确定要删除选中的文件或者文件夹吗?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          const files = this.$refs.tree.getCheckedNodes();
          const res =
            await this.$.appContext.config.globalProperties.$api.deleteJavascripts(
              { files },
              "post"
            );
          if (res.code === 200) {
            this.getTree();
            this.currentParentPath = "";
            ElMessage({
              message: "删除成功",
              type: "success",
            });
          } else {
            ElMessage({
              message: "删除失败",
              type: "error",
            });
          }
        })
        .catch(() => {
          // ElMessage({
          //   type: "info",
          //   message: "Delete canceled",
          // });
        });
    },
    fileInputChange(event) {
      const $target = event.currentTarget;
      this.files = $target.files;
    },
    async submit() {
      const formData = new FormData();
      const files = this.files;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        formData.append("files", file);
      }
      const res = await api
        .addJavascripts(formData, "upload")
        .catch((error) => error);
      if (res.code === 200) {
        // this.$emit("uploadCompleted", res.data.insertId);
        // this.closeHandler();
      }
    },
    formatTree(key, data, parentPath) {
      // console.log(key, data, parentPath);
      const currentPath = `${parentPath}/${key}`;
      if (data.type === "file") {
        return {
          type: "file",
          path: currentPath,
          label: data.name,
        };
      } else {
        const children = [];
        for (let k in data) {
          children.push(this.formatTree(k, data[k], currentPath));
        }
        return {
          type: "dir",
          path: currentPath,
          children,
          label: key,
        };
      }
    },
    async getTree() {
      const res = await api.getJavascriptTree();
      if (res.code === 200) {
        const { data } = res;
        const tree = [];
        for (let key in data) {
          tree.push(this.formatTree(key, data[key], ""));
        }

        this.data = [{ type: "root", path: "", label: "root", children: tree }];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.javascript-manager-wrapper {
  height: 100%;
  overflow-y: auto;
  .handle-upload {
    margin-left: 20px;
  }

  .el-tree--highlight-current ::v-deep {
    .el-tree-node.is-current > .el-tree-node__content {
      background-color: #595757 !important;
    }
  }
  .tree-class ::v-deep {
    // ::v-deep(.el-icon) {
    //   display: none;
    // }

    // background: red;
    background: transparent;
    color: #ffffff;

    .expanded {
      transform: none;
    }
    .el-tree-node:focus > .el-tree-node__content {
      background-color: #595757;
    }

    .el-tree-node > .el-tree-node__content:hover {
      background-color: #595757;
    }

    .el-tree-node__content {
      font-size: 18px;
    }
    .el-icon {
      svg {
        display: none;
      }
      // background: red;
      &:before {
        content: "\e62d";
        font-family: "iconfont";
        display: block;
        font-size: 24px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #ffca28;
        margin-right: 10px;
      }
    }

    .file-wrapper .el-icon {
      &:before {
        content: "\e697";
        font-family: "iconfont";
        display: block;
        font-size: 24px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        // color: #ffca28;
        color: #00d6d6;
      }
    }
    .root-wrapper > .el-tree-node__content .el-checkbox {
      display: none;
    }
    .expanded {
      &:before {
        content: "\e63f";
        font-family: "iconfont";
        display: block;
        font-size: 24px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #ffca28;
      }
    }
  }
}
</style>
