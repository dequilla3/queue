import axios from 'axios';
export default {
  state() {
    return {
      allQueue: []
    };
  },

  mutations: {
    SET_ALL_QUEUE(state, data) {
      state.allQueue = data;
    }
  },

  actions: {
    async getAllQueue({ commit }) {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/reports/getQueuReport`,
      }).then(res => {
        commit("SET_ALL_QUEUE", res.data);
        return res;
      }, err => { console.log(err); });
    }
  }
};