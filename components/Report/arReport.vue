<template>
  <div>
    <h5 class="text-center">
      PHILIPPINE CROP INSURANCE CORPORATION <br />
      ACKNOWLEDGEMENT MANAGEMENT SYSTEM REPORT <br />
      <sub
        >FOR THE PERIOD OF <b>{{ dateFrom }}</b> TO <b>{{ dateTo }}</b>
      </sub>
    </h5>
    <br />
    <table>
      <caption></caption>
      <tr>
        <th class="">Date Transaction</th>
        <th>Series No.</th>
        <th>Payor Name</th>
        <th>Amount</th>
        <th>CASH</th>
        <th>CHECK</th>
        <th>Drawee Bank</th>
        <th>Number</th>
        <th>Date Check</th>
      </tr>

      <tr v-for="(item, index) in transactions" :key="index">
        <td>{{ item.dateTrans }}</td>
        <td>{{ item.arNo }}</td>
        <td>{{ item.payorName }}</td>
        <td>&#8369; {{ numberWithCommas(getRoundOff(item.amt)) }}</td>
        <td>{{ item.pmtType == "CASH" ? "CASH" : "" }}</td>
        <td>{{ item.pmtType == "CHECK" ? "CHECK" : "" }}</td>
        <td>{{ item.drawee }}</td>
        <td>{{ item.checkNo }}</td>
        <td>{{ item.dateCheck }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    transactions: Array,
    dateFrom: String,
    dateTo: String,
  },
  mounted() {},
  methods: {
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getRoundOff(num) {
      num = Number(num);
      return (Math.round(num * 100) / 100).toFixed(2);
    },
  },
};
</script>
<style scoped>
table {
  width: 100%;
}

table,
th {
  border: 1px solid black;
  text-align: center;
  padding: 20px;
}

td {
  border: 1px solid black;
  text-align: center;
  padding: 4px;
}
.br1 {
  border-right: 1px solid #000000;
}

.bb1 {
  border-bottom: 1px solid #000000;
}

.bt1 {
  border-top: 1px solid #000000;
}

.bl1 {
  border-left: 1px solid #000000;
}
</style>
