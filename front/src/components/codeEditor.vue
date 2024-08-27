<template>
  <div class="in-coder-panel">
    <textarea ref="textarea" v-model="code"></textarea>
  </div>
</template>

<script>
// 引入全局实例
import _CodeMirror from "codemirror/lib/codemirror";

// 核心样式
import "codemirror/lib/codemirror.css";

//代码折叠
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/xml-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/comment-fold.js";

// 引入主题后还需要在 options 中指定主题才会生效
// 需要引入具体的语法高亮库才会有对应的语法高亮效果, 目前已动态引入
// import 'codemirror/theme/midnight.css'
// 代码提示
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/show-hint";
//括号匹配
import "codemirror/addon/edit/matchbrackets.js";

//实现搜索功能
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'


// import { javascript } from "@codemirror/lang-javascript";

import {
  watch,
  reactive,
  defineComponent,
  toRefs,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
} from "vue";

// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
import "codemirror/mode/vue/vue.js";

const codemirrorThemList = [];
const requireModules = require.context("codemirror/theme/", false, /\.css$/);
requireModules.keys().forEach((value) => {
  const newValue = value.replace(/^\.\//, "").replace(/\.css$/, "");
  codemirrorThemList.push(newValue);
});

// 尝试获取全局实例
const CodeMirror = window.CodeMirror || _CodeMirror;
let coder = null; // 编辑器实例

export default defineComponent({
  name: "codeEditor",
  props: {
    value: {
      type: String,
      default: "",
    },
    scene: {
      type: String,
      default: "look", // add: 新增； edit: 编辑； look: 查看
    },
    eventType: {
      type: String,
      default: "blur", // 可用事件'change', 'blur'等等；具体参考codemirror文档
    },
    theme: {
      type: String,
      default: "3024-day", // 编辑器主题色
    },
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

    const data = reactive({
      code: props.value, // 内部真实的内容
      // 默认配置
      options: {
        mode: "vue", // 不设置的话，默认使用第一个引用
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        foldGutter: {
          rangeFinder: new CodeMirror.fold.combine(
            CodeMirror.fold.indent,
            CodeMirror.fold.comment
          ),
        },
        matchBrackets: true,
        // 缩进格式
        tabSize: 2,
        // 主题，对应主题库 JS 需要提前引入
        theme: props.theme,
        // 显示行号
        lineNumbers: true,
        readOnly:
          props.scene === "add" || props.scene === "edit" ? false : "nocursor", // true: 不可编辑  false: 可编辑 'nocursor' 失焦,不可编辑
        hintOptions: {
          completeSingle: false,
        },
      },
      // 初始化
      initialize: () => {
        // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
        coder = CodeMirror.fromTextArea(proxy.$refs.textarea, data.options);
        // 此处也可使用'change'事件，不过每次书写的过程中都会触发，为了提高性能，故默认使用'blur'
        coder.on(props.eventType, (coder) => {
          emit("updateValue", coder.getValue());
        });

        coder.on("change", function (editor, change) {
          //任意键触发autocomplete
          if (change.origin == "+input") {
            // console.log("##########################", change.text);
            if (
              change.text[0].trim() === "" ||
              change.text[0] === ";" ||
              change.text[0] === " " ||
              change.text[0] === "{" ||
              change.text[0] === "}" ||
              change.text[0] === "\t" ||
              change.text[0] === ":" ||
              change.text[0] === ","
            ) {
              return;
            }
            setTimeout(function () {
              editor.execCommand("autocomplete");
            }, 20);
          }
        });

        coder.addKeyMap({
          "Ctrl-S": () => {
            emit("submit");
          },
        });
      },
      // 动态引入语法高亮库
      importThemDynamic: () => {
        return new Promise((resolve) => {
          codemirrorThemList.forEach((value) => {
            if (props.theme === value) {
              import(`codemirror/theme/${props.theme}.css`);
              resolve();
            }
          });
        });
      },
    });

    watch(
      () => props.value,
      (newValue, oldValue) => {
        //直接监听
        // console.log("@$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$value改变了");
        setTimeout(() => {
          coder.setValue(newValue);
        }, 100);
      },
      {
        immediate: true, // 这个属性是重点啦
        deep: true, // 深度监听的参数
      }
    );

    onMounted(() => {
      // console.log('value:', props.value)
      data.importThemDynamic().then(() => {
        data.initialize();
      });
    });
    onBeforeUnmount(() => {
      coder.off(props.eventType);
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss">
// 此处不可使用"scoped"
.in-coder-panel {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  position: relative;
  .CodeMirror {
    flex-grow: 1;
    text-align: left !important;
    z-index: 1;
    width: 100%;
    height: 100%;
    .CodeMirror-code {
      line-height: 19px;
    }
  }
}
</style>
