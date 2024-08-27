import { stringToModule } from "./stringToVueComponent.js";

function getStrCount(aStr, aChar) {
  var regex = new RegExp(aChar, "g"); // 使用g表示整个字符串都要匹配 飞鸟慕鱼博客
  var result = aStr.match(regex);
  var count = !result ? 0 : result.length;
  return count;
}

function isVue(url) {
  return (url + "").indexOf(".vue") > -1;
}

//如果是子组件，用于从接口中获取子组件代码
function isChildModule(url) {
  return (url + "").indexOf("remote://") > -1;
}

function isjs(url) {
  //vue文件判定规则
  return (url + "").indexOf("!!!js") > -1;
}

function isStringCodes(url) {
  return url.startsWith("blob:");
}

System.constructor.prototype.shouldFetch = function () {
  return true;
};
var oldFetch = System.constructor.prototype.fetch;

System.constructor.prototype.fetch = function (url, options) {
  //如果是子组件请求就需要从接口中获取组件代码
  // let tempUrl = isChildModule(url)?"http://127.0.0.1:5500/public/preview/mock/code":url;
  let tempUrl = url;

  // if (isChildModule(url)) {
  //   tempUrl = `http://localhost:3002/api/components/getComponentCodeById?id=${
  //     url.split("remote://")[1]
  //   }`;
  // }

  if (isChildModule(url)) {
    tempUrl = `${window.VUE_APP_BACKGROUND_ADDRESS}api/components/getComponentCodeById?id=${url.split("remote://")[1]
      }`;
  }

  return oldFetch(tempUrl, options).then(function (res) {
    if (isChildModule(url)) {
      return res.text().then((codes) => {
        return stringToModule(url, codes);
      });
    }

    if (!isVue(url) && !isStringCodes(url)) {
      return res;
    }

    return res.text().then(async (codeSource) => {
      const res = await stringToModule(url, codeSource);
      return res;
    });
  });
};
