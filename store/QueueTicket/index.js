
export default {
  state() {
    return {
      windowList: [
        {
          desc: "WINDOW 1",
          winNum: "w1",
          windowCode: "M",
          transactions: [
            {
              headText: "SUBMIT INSURANCE APPLICATION",
              subText: "ISUMITE ANG APLIKASYON SA SEGURO",
              transCode: 't1'
            },
            {
              headText: "INQUIRY INSURANCE POLICY",
              subText: "PAGTATANONG TUNGKOL SA PATAKARAN NG SEGURO",
              transCode: 't2'
            },
          ],
        },

        {
          desc: "WINDOW 2",
          winNum: "w2",
          windowCode: "C",
          transactions: [
            {
              headText: "SUBMIT CLAIMS APPLICATION",
              subText: "ISUMITE ANG APLIKASYON NG INYONG CLAIM",
              transCode: 't1'
            },
            {
              headText: "INQUIRY CHECK STATUS",
              subText: "PAGTATANONG KUNG ANU ANG KATAYUAN NG TSEKE",
              transCode: 't2'
            },
          ],
        },

        {
          desc: "WINDOW 3",
          winNum: "w3",
          windowCode: "P",
          transactions: [
            {
              headText: "PWD / SENIOR CITEZEN / PREGNANT",
              subText: "MAY KAPANSANAN / MATATANDA / BUNTIS",
              transCode: 't1'
            },
          ],
        },

        {
          desc: "WINDOW 4",
          winNum: "w4",
          windowCode: "A",
          transactions: [
            {
              headText: "CLAIM INDEMNITY CHECK",
              subText: "PAGKUHA NG BAYAD PINSALA",
              transCode: 't1'
            },
            {
              headText: "INQUIRY CHECK AVAILABILITY",
              subText: "PAGTATANONG KUNG MAYROONG TSEKE",
              transCode: 't2'
            },
          ],
        },
      ],
      reportState: {
        curNum: "023",
        windowCode: "M",
        windowDesc: "WINDOW 1"
      }

    };
  },

  mutations: {
    SET_REPORTSTATE(state, { curNum, windowCode, windowDesc }) {
      state.reportState.curNum = curNum;
      state.reportState.windowCode = windowCode;
      state.reportState.windowDesc = windowDesc;
    }
  }

};