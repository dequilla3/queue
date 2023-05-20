export default {
  state() {
    return {
      reportState: {
        curNum: "",
        windowCode: "",
        windowDesc: "",
      },
    };
  },

  mutations: {
    SET_REPORTSTATE(state, { curNum, windowCode, windowDesc }) {
      state.reportState.curNum = curNum;
      state.reportState.windowCode = windowCode;
      state.reportState.windowDesc = windowDesc;
    },
  },
};
