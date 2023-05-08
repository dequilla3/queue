import axios from 'axios';

export default {
  state() {
    return {

      queue: [],

      windCodes: [
        {
          wNum: 'w1',
          wCode: 'M',
          desc: 'WINDOW 1'
        },
        {
          wNum: 'w2',
          wCode: 'C',
          desc: 'WINDOW 2'
        },
        {
          wNum: 'w3',
          wCode: 'P',
          desc: 'WINDOW 3'
        },
        {
          wNum: 'w4',
          wCode: 'A',
          desc: 'WINDOW 4',
        },
        {
          wNum: 'w5',
          wCode: 'T',
          desc: 'WINDOW 5'
        },
      ]
    };
  },

  mutations: {
    SET_QUEUE_LIST(state, data) {
      state.queue = data;
    }
  },

  actions: {
    async getAllQueueList({ commit }, role) {
      return await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/listQueuNum/${0}`,
        data: {
          winNum: role,
          newStatus: "",
          oldStatus: ""
        },
      }).then(res => {
        commit("SET_QUEUE_LIST", res.data);
        return res;
      }).catch(err => { console.log(err); });
    },

    async postQueuesByStatus({ commit }, { role, newStatus, oldStatus, queueId }) {
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/listQueuNum/${queueId}`,
        data: {
          winNum: role,
          newStatus: newStatus,
          oldStatus: oldStatus,
        },
      })
        .then((res) => {
          commit("SET_QUEUE_LIST", res.data);
        });
    }
  }
};
