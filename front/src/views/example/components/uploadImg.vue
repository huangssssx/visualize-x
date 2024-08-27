<template>
  <div ref="upload-img-wrapper" class="upload-img-wrapper">
    <div v-if="!imageBase64" class="txt">1、点击这个框</div>
    <div v-if="!imageBase64" class="txt">2、请使用ctrl+v 将图片粘贴进来</div>
    <img class="icon" :src="imageBase64" v-if="imageBase64" />
    <div v-if="imageBase64" class="remove" @click="removeHandler">清空</div>
  </div>
</template>

<script>
export default {
  watch: {
    sourcePath: {
      handler(sourcePath) {
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@sourcePath:", sourcePath);
        if (sourcePath) {
          this.imageBase64 = sourcePath;
        }
      },
      immediate: true,
    },
  },
  props: {
    sourcePath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // remoteUrl: process.env.VUE_APP_BACKGROUND_ADDRESS,
      imageBase64: "",
      imageFile: null,
    };
  },
  methods: {
    readImageFromFile(file) {
      const that = this;
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = function (event) {
        // event.target.result就是图片的Base64地址啦
        that.imageBase64 = event.target.result || "";
      };
      reader.readAsDataURL(file);
    },
    removeHandler() {
      this.imageBase64 = "";
      this.imageFile = "";
      this.$emit("clear");
    },
  },
  mounted() {
    document.addEventListener("paste", (event) => {
      const items = event.clipboardData && event.clipboardData.items;
      let file = null;
      if (items && items.length) {
        // 检索剪切板items
        for (let i = 0; i < items.length; i += 1) {
          if (items[i].type.indexOf("image") !== -1) {
            file = items[i].getAsFile();
            break;
          }
        }
      }
      this.readImageFromFile(file);
      this.$emit("updateImgFile", file);
    });
  },
};
</script>

<style lang="scss" scoped>
.upload-img-wrapper {
  position: relative;
  width: 280px;
  height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #afaaaa;
  // background:red;
  border: 1px solid #eeeeee;
  .txt {
    font-size: 14px;
    margin-left: 20px;
  }
  .icon {
    width: 100%;
    height: 100%;
  }

  .remove {
    background: #eeeeee;
    color: black;
    border-radius: 2px;
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 12px;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>
