import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//操作vuex时有一个type帮助我们调试
const types = {
  SET_AUTHENTICATION: "AUTHENTICATION",
  SET_USER: 'SET_USER'
}
const state = {
  isAuthenticated: false,
  //存储用户信息
  user: {

  }
}
const getters = {
  // 获取当前是否是授权状态
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
}
const mutations = {
  // 更改状态信息
  //此方法规定了一个类型，类型名叫做SET_AUTHENTICATION，该方法接收两个参数
  [types.SET_AUTHENTICATION](state, isAuthenticated) {
    if(isAuthenticated) state.isAuthenticated = isAuthenticated
    else state.isAuthenticated = false
  },

  [types.SET_USER](state, user) {
    if(user) state.user = user
    else state.user = {}
  }
}
const actions = {
  // 异步操作（用来调用mutation）
  setAuthenticated: ({ commit }, isAuthenticated) => {
    commit(types.SET_AUTHENTICATION, isAuthenticated)
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  },
  clearCurrentState: ({ commit }) => {
    commit(types.SET_AUTHENTICATION, false)
    commit(types.SET_USER, null)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
