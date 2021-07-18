import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResult: "",
    spList: [],
  },
  getters: {
    searchResult(state) {
      return state.searchResult
    },
    getSpList(state) {
      return state.spList;
    }
  },
  mutations: {
    getSearchMsg(state, msg) {
      state.searchResult = msg;
    },
    inputSpList(state, list) {
      state.spList = list;
    }
  },
  actions: {
  },
  modules: {
  }
})
