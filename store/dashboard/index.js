
export default {
  state() {
    return {
      barIsClicked: true,
      queues: []
    };
  },

  mutations: {
    triggerClick(state) {
      state.barIsClicked = !state.barIsClicked;
    }
  },

  actions: {

  }
};