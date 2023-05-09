
export default {
  state() {
    return {
      barIsClicked: true,
      queues: []
    };
  },

  mutations: {
    triggerClick(state, barIsClicked) {
      state.barIsClicked = barIsClicked;
    }
  },

  actions: {

  }
};