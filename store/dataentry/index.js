import axios from 'axios';

export default {
  state() {
    return {
      transactions: [],
      products: []
    };
  },

  mutations: {
    SET_TRANSCTIONS(state, data) {
      state.transactions = data;
    },

    SET_PRODUCTS(state, data) {
      state.products = [];
      data.forEach(function (val) {
        state.products.push({ prodId: val.product_id, prodName: val.prod_name });
      });
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
    },

    async getAllProducts({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/product/getAllProduct`,
      }).then(res => { commit("SET_PRODUCTS", res.data); }, err => { console.log(err); });
    }
  }
};