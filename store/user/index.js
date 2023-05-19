import axios from 'axios';
export default {
  state() {
    return {
      users: []
    };
  },

  mutations: {
    SET_USERS(state, data) {
      state.users = data;
    }
  },

  actions: {
    async getAllUsers({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/user/getAllUser`,
      }).then(res => {
        commit("SET_USERS", res.data);
      }, err => { console.log(err); });
    }
  }

};