/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
import axios from "axios";
// import { throttle, getType } from '@/utils/index.js';

// const showErrorMsg = throttle((msg) => console.error(msg), 300);
// const errorMessages = (res) => `${res.status} ${res.statusText}`;

const http = axios.create({
  timeout: 15000,
  baseURL: process.env.VUE_APP_INSTANCE_PREFIX,
  withCredentials: false, // 启用跨域
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
  (conf) => {
    if (!navigator.onLine) {
      alert("网络已断开，请检查网络！");
      return Promise.reject(new Error("网络已断开，请检查网络！"));
    }
    // 生成取消请求的 token/cancel
    // conf.cancelToken = new axios.CancelToken((cancel) => {
    //   /**
    //    * conf.cancel 是自定义回调函数，必要时页面可以通过回调拿到单个token，取消单个请求
    //    * 示例：请求时传入与url同级的参数 cancel：cancel => (this.getListCancel = cancel)
    //    * 调用 this.getListCancel && this.getListCancel(); 取消上次请求
    //    * 注意 getListCancel 需要定义在实例上（如组件的data中），而不是api中，避免一个页面请求两个相同的api时，前一个请求被取消
    //    */
    //   if (conf.cancel) conf.cancel(cancel);
    // });

    // get 请求加上随机数，防止ie下面有缓存
    if (conf.method === "get") {
      // eslint-disable-next-line no-param-reassign
      conf.params = {
        t: new Date().getTime(),
        ...conf.params,
      };
    }

    // application/x-www-form-urlencoded 请求的数据进行序列化
    // if (
    //   conf.headers['Content-Type'] &&
    //   conf.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1
    // ) {
    //   conf.data = getType(conf.data) === 'formdata' ? conf.data : qs.stringify(conf.data);
    // }
    return conf;
  },
  (error) => Promise.reject(error)
);

/**
 * 响应拦截
 */
http.interceptors.response.use(
  (res) =>
    // eslint-disable-next-line eqeqeq
    res.data,
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.msg = "请求错误(400)";
          break;
        case 401:
          err.msg = "未授权，请重新登录(401)";
          break;
        case 403:
          err.msg = "拒绝访问(403)";
          break;
        case 404:
          err.msg = "请求出错(404)";
          break;
        case 408:
          err.msg = "请求超时(408)";
          break;
        case 500:
          err.msg = "服务器错误(500)";
          break;
        case 501:
          err.msg = "服务未实现(501)";
          break;
        case 502:
          err.msg = "网络错误(502)";
          break;
        case 503:
          err.msg = "服务不可用(503)";
          break;
        case 504:
          err.msg = "网络超时(504)";
          break;
        case 505:
          err.msg = "HTTP版本不受支持(505)";
          break;
        default:
          err.msg = `连接出错(${err.response.status})!`;
      }
      // showErrorMsg(err.msg);
    } else {
      // 可能是请求被取消，这时不需要进行提示
      // err.message = "连接服务器失败!";
    }
    return Promise.reject(err);
  }
);

// api进行format, 示例：apiFormat('drop/namebyId/{id}', { id: 1 }) => drop/nameById/1, 主要用于RESTful接口;
export const apiFormat = (str = "", opt = {}) => str.replace(/\{(\w+?)\}/gi, (_, $1) => opt[$1]);

export default http;
