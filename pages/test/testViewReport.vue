<template>
  <div>
    <!-- <arReport
      :transactions="transactions"
      dateFrom="June 1, 2023"
      dateTo="June 5, 2023"
    /> -->
    <queueReport
      :queueReportDetails="queueReportDetails"
      dateFrom="June 1, 2023"
      dateTo="June 5, 2023"
    />
  </div>
</template>
<script>
import arReport from "../../components/Report/arReport.vue";
import queueReport from "../../components/Report/queueReport.vue";

export default {
  components: {
    arReport,
    queueReport,
  },
  data() {
    return {
      transactions: [
        {
          dateTrans: "June 1,2020",
          arNo: "PR0001",
          payorName: "KIM DEQUILLA",
          amt: 4000,
          pmtType: "CASH",
          drawee: "",
          checkNo: "",
          dateCheck: "",
        },

        {
          dateTrans: "June 3,2020",
          arNo: "PR0002",
          payorName: "KIM ARIEL DEQUILLA",
          amt: 4000,
          pmtType: "CHECK",
          drawee: "LBP",
          checkNo: "10023",
          dateCheck: "April 27, 2023",
        },
      ],

      queueReportDetails: [
        { key: "w1", counter: "WINDOW 1", totalNum: 0, totalMale: 0, totalFemale: 0 },
        { key: "w2", counter: "WINDOW 2", totalNum: 0, totalMale: 0, totalFemale: 0 },
        { key: "w3", counter: "WINDOW 3", totalNum: 0, totalMale: 0, totalFemale: 0 },
        { key: "w4", counter: "WINDOW 4", totalNum: 0, totalMale: 0, totalFemale: 0 },
        { key: "w5", counter: "WINDOW 5", totalNum: 0, totalMale: 0, totalFemale: 0 },
        {
          key: "total",
          counter: "GRAND TOTAL",
          totalNum: 0,
          totalMale: 0,
          totalFemale: 0,
        },
      ],
    };
  },
  mounted() {
    console.log(this.queueReportDetails);
  },
};
</script>
