<template>
  <div
    ref="example-layout-wrapper"
    :class="`example-layout-wrapper mode-${mode}`"
  >
    <!-- <div class="header-container">
      <div class="main-title" @click="this.$router.push('/')">
        可视化图表组件开发示例
      </div>
      <div class="line"></div>
      <div class="sub-title">{{ form.name }}</div>
    </div> -->
    <div class="body-container">
      <div class="code-container">
        <CodeEditor
          :scene="`add`"
          :theme="`ayu-dark`"
          :eventType="`change`"
          :value="sourceCodes"
          @updateValue="updateValueHandler"
          @submit="submit"
        />
      </div>
      <div class="control-stick" ref="control-stick">
        <img :src="require('@/assets/images/stick.svg')" />
      </div>
      <div class="com-container">
        <iframe
          v-if="isInited"
          :style="{
            pointerEvents:
              dragStatus === 'down' || dragStatus === 'move' ? 'none' : '',
          }"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          class="overviewer-frame"
          id="overviewer"
          src="preview/index.html"
        ></iframe>
      </div>
    </div>
    <div class="footer-container">
      <div class="button-bar">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button type="" @click="openDetailsDrawer">详细信息</el-button>
        <el-button @click="dlgVisible = true">图标库</el-button>
        <el-button v-if="!form.parentId" @click="openChildDlgHandler"
          >子组件库</el-button
        >
        <!-- <el-button type="info">取消</el-button> -->
      </div>
    </div>
    <DetailsDrawer
      v-model:visible="drawerVisible"
      :params="{ ...form }"
      @form="detailFormChangeHandler"
    />
    <IconDlg :visible="dlgVisible" @close="dlgCloseHandler" />
    <childDlg
      width="90%"
      v-if="childDlgVisible"
      :visible="childDlgVisible"
      @close="childDlgCloseHandler"
      :params="{ parentId: form.id }"
    ></childDlg>
  </div>
</template>

<script>
import CodeEditor from "@/components/codeEditor.vue";
import api from "@/service/index";
import DetailsDrawer from "./components/details.vue";
import { ElMessage } from "element-plus";
import IconDlg from "./components/iconDlg.vue";
import ChildDlg from "./components/childDlg.vue";

export default {
  components: {
    CodeEditor,
    DetailsDrawer,
    IconDlg,
    ChildDlg,
  },
  watch: {
    $route: {
      handler(route) {
        this.init();
      },
      immediate: true,
    },
    "form.name": {
      handler(name) {
        this.$store.dispatch("index/setSubName", name || "");
      },
      immediate: true,
    },
  },
  data() {
    return {
      id: "",
      dlgVisible: false,
      sourceCodes: `
<template>
  <div class="something-wrapper">type something</div>
</template>

<script>
export default {

}
</${"script"}>

<style lang="scss" scoped>
.something-wrapper{
}
</style>`,
      drawerVisible: false,
      name: "",
      mode: "view", // view|edit|add
      middleX: 0,
      clientStartX: 0,
      offsetx: 0,
      form: {
        codes: ``,
        name: "",
        file: "",
        type: "default",
      },
      dragStatus: "up", //up|move|down
      childDlgVisible: false,
      editUpdateNum: 0, //编辑器更新次数
      isInited: false, //是否初始化完毕
      // editData: {},
    };
  },
  mounted() {},
  methods: {
    async init() {
      const that = this;
      const { mode, id, parentId } = this.$route.query;
      id ? (this.form.id = id) : "";
      this.mode = mode;
      //编辑模式
      if (mode === "edit") {
        await this.initEditMode(id);
      }
      //查看模式
      else if (mode === "view") {
        await this.initViewMode(id);
      }
      //增加模式
      else {
        this.form.name = `未知组件_${Date.now()}`;
        //parentId存在说明是子组件创建状态
        if (parentId) {
          this.form.parentId = parentId;
        }
      }

      // 初始化区域尺寸调节功能
      this.initAreaAdjust();
      // // 初始化代码
      window.addEventListener("message", (e) => {
        //iframe已经准备好
        if (e.data === "iframeInited") {
          // console.log("iframe 初始化完成向iframe发送消息：", that.form.codes);
          const iFrame = document.getElementById("overviewer");
          //加载script消息发送完成后需要等待script加载完毕消息返回才能进行下一步注册行为
          iFrame.contentWindow.postMessage({
            type: "scriptsLoad",
            content: that.form.scripts,
            VUE_APP_BACKGROUND_ADDRESS:window.VUE_APP_BACKGROUND_ADDRESS
          });
        }
        //预加载的javascript加载完毕，通知html进行vue组件注册
        else if (e.data === "scriptsLoadedCompleted") {
          const iFrame = document.getElementById("overviewer");
          iFrame.contentWindow.postMessage({
            type: "globalRegisters",
            content: that.form.globalRegisters,
          });
        }
        // vue组件加载完成，等待加载用户代码
        else if (e.data === "globalRegistersCompleted") {
          that.updateValueHandler(that.form.codes);
        }
      });
      //打开iframe
      this.isInited = true;
    },
    dlgCloseHandler() {
      this.dlgVisible = false;
    },
    async initViewMode(id) {
      await this.initEditMode(id);
    },
    //编辑模式初始化
    async initEditMode(id) {
      const res = await api.getCompoentById({ id }).catch((error) => error);
      if (res.code === 200) {
        Object.assign(this.form, res.data);
        this.sourceCodes = res.data.codes;
        this.form.codes = res.data.codes;
      }
    },
    // 初始化区域尺寸调节功能
    initAreaAdjust() {
      const that = this;
      this.$nextTick(() => {
        const $controlStick = this.$refs["control-stick"];
        $controlStick.onmousedown = function (e) {
          if (that.middleX === 0) {
            that.middleX = e.clientX;
            that.dragStatus = "down";
          }
          that.clientStartX = e.clientX;
          document.onmousemove = function (event) {
            that.moveHandle(event.clientX);
            that.dragStatus = "move";
            return false;
          };

          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            that.dragStatus = "up";
          };
          return false;
        };
      });
    },
    detailFormChangeHandler(form) {
      this.form = { ...this.form, ...form };
    },
    openDetailsDrawer() {
      this.drawerVisible = true;
    },
    async submit() {
      const param = new FormData();
      const keys = Object.keys(this.form) || [];
      let scriptsObject = null;
      let globalRegistersObject = null;
      try {
        scriptsObject = eval(this.form["scripts"]);
        this.form.scripts = JSON.stringify(scriptsObject);
      } catch (error) {
        ElMessage({
          message: "插入的script不是有效的json格式",
          type: "error",
        });
        return;
      }

      try {
        globalRegistersObject = eval(this.form["globalRegistersObject"]);
        this.form.globalRegistersObject = JSON.stringify(globalRegistersObject);
      } catch (error) {
        ElMessage({
          message: "全局注册字段不是有效的json格式",
          type: "error",
        });
        return;
      }
      keys.forEach((key, index) => {
        param.append(key, this.form[key]);
      });

      if (this.mode === "add") {
        const res = await api
          .addComponents(param, "upload")
          .catch((error) => error);

        if (res.code === 200) {
          ElMessage({
            message: "添加成功",
            type: "success",
          });

          setTimeout(() => {
            this.$router.push({
              path: "/example",
              query: { mode: "edit", id: res.data.insertId },
            });
          }, 1000);
        }
      } else {
        const res = await api
          .editComponent(param, "upload")
          .catch((error) => error);

        if (res.code === 200) {
          ElMessage({
            message: "更新成功",
            type: "success",
          });
        }
      }
    },
    updateValueHandler(code) {
      this.editUpdateNum++;
      this.form.codes = code;
      const iFrame = document.getElementById("overviewer");
      if(iFrame){
        iFrame.contentWindow.postMessage({ type: "code", content: code });
      }
    },
    moveHandle(currentX) {
      const gap = currentX - this.middleX;
      this.$refs["example-layout-wrapper"].style.setProperty(
        "--offsetX",
        `${gap}px`
      );
    },
    openChildDlgHandler() {
      if (!this.form.id) {
        ElMessage({
          message: "父组件不存在不能新建子组件",
          type: "error",
        });
        return;
      }
      this.childDlgVisible = true;
    },
    childDlgCloseHandler() {
      this.childDlgVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.example-layout-wrapper {
  --offsetX: 0px;
  width: 100%;
  height: 100%;
  background-color: #000e2c;
  .header-container {
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
  .body-container {
    width: 100%;
    height: calc(100% - 50px);
    padding: 20px;
    box-sizing: border-box;
    display: flex;

    .code-container {
      width: calc(50% + var(--offsetX));
      height: 100%;
      border-radius: 2px;
      opacity: 1;
      background: #0b1736;
    }

    .control-stick {
      width: 16px;
      height: 100%;
      background: #000e2c;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .com-container {
      flex: 1;
      height: 100%;
      border-radius: 2px;
      opacity: 1;
      background: #0b1736;
      .overviewer-frame {
        width: 100%;
        height: 100%;
      }
    }
  }

  .footer-container {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 50px;
    background: #ffffff;

    .button-bar {
      float: right;
      width: 300px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.mode-view {
  .body-container {
    height: 100%;
    .code-container {
      display: none;
    }

    .control-stick {
      display: none;
    }
    .com-container {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100vw;
      height: 100vh;
    }
  }
  .footer-container {
    display: none;
  }
}
</style>
