/* eslint-disable no-unused-vars */
/** **
 * 通用功能相关：比如缓存清除
 */
const state = {
  subName: "",
};

const mutations = {
  SET_SUB_MAME: (state, subName) => {
    state.subName = subName;
  },
};

const actions = {
  // 次级名称
  setSubName({ commit, state }, subName) {
    commit("SET_SUB_MAME", subName);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
