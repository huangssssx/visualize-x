const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

function getPublicPath(){
  return process.env.VUE_APP_PUBLIC_PATH
}

module.exports = {
  lintOnSave: false,
  publicPath: getPublicPath(),
  outputDir: "scom",
  assetsDir: "static",
  productionSourceMap: true,

  devServer: {
    // host: "localhost",
    hot: true, // 自动保存
    // https: false,
    port: 8189,
    open: true, // 这里为true会打开两个窗口
    proxy: {
      "/devapi": {
        pathRewrite: {
          [`^${process.env.VUE_APP_INSTANCE_PREFIX}`]: "",
        },
        target: process.env.VUE_APP_BACKGROUND_ADDRESS, // http://whapp-show.cestc.cn/
        changeOrigin: true, // 需要虚拟主机站点
      },
      "/uploads": {
        // http://10.32.122.168:3000/uploads/1666685514529.png
        pathRewrite: {
          "^uploads": "uploads",
        },
        // target: 'http://10.32.122.168:3002', // http://whapp-show.cestc.cn/
        target: process.env.VUE_APP_BACKGROUND_ADDRESS,
        changeOrigin: true, // 需要虚拟主机站点
      },
    },
  },
  css: {
    extract: false,
    //   sourceMap: false,
    //   modules: false
  },
  configureWebpack: {
    devtool: "source-map",
    name: "主页",
    resolve: {
      alias: {
        "@": resolve("src"),
        // '@cestc-ui': resolve('cestc-ui/ui'),
      },
    },
    plugins: [],
  },
  // chainWebpack(config) {
  // }
};
