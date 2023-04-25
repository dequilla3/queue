
export default {
  state() {
    return {
      barIsClicked: true
    };
  },
  mutations: {
    triggerClick(state) {
      state.barIsClicked = !state.barIsClicked;
    }
  }
};