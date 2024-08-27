/** **
 * 消息通知相关
 */
/**
 * 链式加载控制器
 */
class PageChainLoadContraller {
  constructor() {
    this.interval_time = 100;
    this.wait_time = 1;
    this.doms = [];
    this.startCountTimer = null;
    this.launchLoad = this.launchLoad.bind(this);
  }

  // 开始加载
  launchLoad() {
    const that = this;
    setInterval(() => {
      const dom = this.doms.pop();
      if (dom) {
        dom.show = true;
      }
    }, that.interval_time);
  }

  resetTime() {
    if (this.startCountTimer) {
      clearTimeout(this.startCountTimer);
    }
    const launchLoad = this.launchLoad;
    this.startCountTimer = setTimeout(() => {
      launchLoad();
    }, this.wait_time);
  }

  push(dom) {
    this.doms.push(dom);
    this.resetTime();
  }
}

const state = {
  loadController: new PageChainLoadContraller()
};

const mutations = {
  SET_NODE_ID: (state, nodeId) => {
    state.nodeId = nodeId;
  }
};

const actions = {
  changeChainNodeId({ commit, state }, nodeId) {
    commit('SET_NODE_ID', nodeId);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
