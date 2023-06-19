<template>
  <div>
    <arReport
      :transactions="transactions"
      dateFrom="June 1, 2023"
      dateTo="June 5, 2023"
    />
  </div>
</template>
<script>
import arReport from "../../components/Report/arReport.vue";

export default {
  components: {
    arReport,
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
    };
  },
  mounted() {},
};
</script>
