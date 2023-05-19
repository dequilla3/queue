import axios from 'axios';

export default {
  state() {
    return {
      transactions: [],
      products: [{ prodId: 1, prodName: "RICE" }]
    };
  },

  mutations: {
    SET_TRANSCTIONS(state, data) {
      state.transactions = data;
    }
  },

  actions: {
    async getAllTransaction({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/transaction/getAllTransaction`,
      }).then(res => {
        commit("SET_TRANSCTIONS", res.data);
      }, err => { console.log(err); });
    }
  }
};