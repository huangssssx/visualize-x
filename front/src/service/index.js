import http from "@/utils/httpRequest";
// import qs from 'qs';

// 0:mock 1.api
const apis = {
  getCompoentById: "/api/components/getComponentById", //根据id获取组件信息
  editComponent: "/api/components/editComponent", //修改单个组件信息
  getComponents: "/api/components/list", // 获取所有项目列表
  setFieldValue: "/api/projects/edit", // 编辑字段
  setIcon: "/api/projects/editIcon", // 编辑图标
  addComponents: "/api/components/add", // 增加组件
  deleteComponent: "/api/components/delete", // 删除组件
  /**图片资源管理 */
  addIcons: "/api/icons/add", //增加图片资源
  getIcons: "/api/icons/list", //获取图片资源列表
  deleteIcon: "/api/icons/delete", //删除一个图片资源
  getIconById: "/api/icons/getIconById", //通过id获取一个图片资源
  /**类型管理 */
  addType: "/api/types/add",
  getTypes: "/api/types/list",
  deleteType: "/api/types/delete",
  getTypeById: "/api/icons/getTypeById",
  /**child组件 */
  getCompoentByParentId: "/api/child/list",
  /**javascript 上传管理 */
  addJavascripts: "/api/javascriptManager/add",
  getJavascriptTree: "/api/javascriptManager/getTree",
  deleteJavascripts: "/api/javascriptManager/delete",
  addFolderJavascripts: "/api/javascriptManager/addFolder"
};

/**
 * 获取远程调用方法的工厂
 * 此方法为了解决
 * 1、用户有静态和动态接口数据的需求，静态使用本地json，动态需要切换到远程api
 * 2、避免写太多机械代码
 * @param {*} apiKey apis的key值，比如overView、department等
 * @param {*} params 请求的参数
 * @param {*} method 方法类型：get、post、option、delete等
 * @param {*} type 0：静态数据  1：动态数据
 * @returns
 */
const interfaceFactory = (apiKey = "") => {
  if (!apiKey) {
    return () => { };
  }
  return function (params = {}, method = "get", isfollow = false) {
    return http({
      url: isfollow ? `${apis[apiKey]}?${encodeURI(params)}` : apis[apiKey],
      method: method === "upload" ? "post" : method,
      params: method !== "get" ? {} : params,
      data: method !== "get" ? params : {},
      headers: method === "upload" ? { "content-type": "multipart/form-data" } : {},
    });
  };
};

/**
 * 生成export的对象，包含所有的api接口请求方法
 * @param {*}  type 0：静态数据  1：动态数据
 * @returns
 */
function createExportObject() {
  const res = {};
  const keys = Object.keys(apis);
  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    res[`${key}`] = interfaceFactory(key);
  }
  return res;
}
const res = createExportObject();
export default res;
