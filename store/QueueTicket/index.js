export default {
  state() {
    return {
      reportState: {
        curNum: "023",
        windowCode: "M",
        windowDesc: "WINDOW 1",
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
