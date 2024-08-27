<template>
  <div
    :style="[$attrs.style]"
    :class="{ [$attrs.class]: true, 'card-wrapper': true }"
    @mouseover="hoverHandler"
    @mouseleave="unHoverHandle"
  >
    <div class="icon">
      <img :src="`${remoteUrl + params.icon}`" />
    </div>
    <div class="name">{{ params.name }}</div>
    <el-tooltip effect="dark" placement="top-start">
      <template #content>
        <div style="max-width: 300px">{{ params.comment }}</div>
      </template>

      <div
        class="mask"
        :class="{ hover: isHover === true, unHover: isHover === false }"
      >
        <el-button circle @click="openEditWindow(params.id)">
          <el-icon :size="size" :color="color">
            <Edit />
          </el-icon>
        </el-button>

        <el-button circle @click="deleteHandler(params.id)">
          <el-icon :size="size" :color="color">
            <Delete />
          </el-icon>
        </el-button>

        <el-button circle @click="openViewWindow(params.id)">
          <el-icon :size="size" :color="color">
            <View />
          </el-icon>
        </el-button>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import api from "@/service/index";
import { ElMessage } from "element-plus";
export default {
  props: {
    params: {
      type: Object,
      default: () => ({
        name: "测试名称",
        icon: "xxxxx.png",
      }),
    },
  },
  data() {
    return {
      remoteUrl: process.env.VUE_APP_BACKGROUND_ADDRESS,
      isHover: undefined,
    };
  },
  methods: {
    hoverHandler() {
      this.isHover = true;
    },
    unHoverHandle() {
      this.isHover = false;
    },
    openEditWindow(id) {
      window.open(
        `${process.env.VUE_APP_PUBLIC_PATH}#/example?mode=edit&id=${id}`
      );
    },
    async deleteHandler(id) {
      const res = await api
        .deleteComponent({ id }, "post")
        .catch((error) => error);
      if (res.code === 200) {
        ElMessage({
          message: "删除成功",
          type: "success",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },

    openViewWindow(id) {
      window.open(
        `${process.env.VUE_APP_PUBLIC_PATH}#/example?mode=view&id=${id}`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.card-wrapper {
  position: relative;
  width: 280px;
  height: 242px;
  opacity: 1;

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 212px;
    background: #0b1736;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .name {
    width: 100%;
    height: 30px;
    line-height: 30px;
    opacity: 0.75;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 1px;
    color: #ffffff;
  }

  @keyframes hoverMask {
    0% {
      height: 0%;
    }
    100% {
      height: 100%;
    }
  }

  @keyframes unHoverMask {
    0% {
      height: 100%;
    }
    100% {
      height: 0%;
    }
  }

  .mask {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0px;
    left: 0px;
    position: absolute;
    width: 100%;
    height: 0%;
    background: #00000050;
    overflow: hidden;
  }

  .hover {
    animation: hoverMask 0.5s;
    animation-fill-mode: forwards;
  }

  .unHover {
    animation: unHoverMask 0.5s;
    animation-fill-mode: forwards;
  }
}
</style>
