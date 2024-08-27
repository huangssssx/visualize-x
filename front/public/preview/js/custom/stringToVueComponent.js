//将string转换为module
import "./hash-sum.js";
import { generateTemplate } from "./SFSModule/templateModule.js";
import { generateScript } from "./SFSModule/jsModule.js";
import { generateSass } from "./SFSModule/sassModule.js";
import { VueCompilerSFCInstance as VueCompilerSFC } from "../vue3/compiler-sfc.global.js";
export const stringToModule = async (url, source) => {
  //生成唯一id,一般用于scoped的唯一标识
  var id = hash.sum(url + source);
  var dataVId = "data-v-" + id;
  var parseResult = VueCompilerSFC.parse(source, { sourceMap: false });
  const { descriptor } = parseResult;
  const hasScoped = descriptor.styles.some((s) => s.scoped);
  // if (!descriptor.template) {
  //   resolve(res);
  //   return;
  // }

  const template = generateTemplate(id, descriptor.template.content, hasScoped, dataVId);

  var script = generateScript(id, descriptor, hasScoped, dataVId);

  await generateSass(descriptor.styles, dataVId, url);

  // console.log("############template:", template);
  // console.log("############script:", script);

  var renderName = "_sfc_render";
  var mainName = "_sfc_main";

  // 处理 template 标签
  var templateCode = template.code.replace(
    /\nexport (function|const) (render|ssrRender)/,
    "\n$1 _sfc_$2"
  );

  // 处理 script 标签
  var scriptCode = VueCompilerSFC.rewriteDefault(script.content, mainName);

  // 导出组件对象
  var output = [
    scriptCode,
    templateCode,

    mainName + ".render=" + renderName,
    "export default " + mainName,
  ];

  if (hasScoped) {
    output.push(mainName + ".__scopeId = " + JSON.stringify(dataVId));
  }

  var code = output.join("\n");
  return new Response(new Blob([code], { type: "application/javascript" }));

  // 处理 style 标签
};
