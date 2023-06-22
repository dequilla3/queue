<template>
  <div>
    <h3 class="text-center">
      PHILIPPINE CROP INSURANCE CORPORATION <br />
      ACKNOWLEDGEMENT MANAGEMENT SYSTEM REPORT <br />
      <div v-if="dateFrom != '' && dateTo != ''">
        <h3>
          <sub>FOR THE PERIOD OF</sub>
          <sub class="font-weight-bold">
            {{ dateFrom }}
          </sub>
          <sub>TO</sub>
          <sub class="font-weight-bold">
            {{ dateTo }}
          </sub>
        </h3>
      </div>
    </h3>
    <br />
    <table>
      <caption></caption>
      <tr>
        <th class="">Date Transaction</th>
        <th>Series No.</th>
        <th>Payor Name</th>
        <th>CASH</th>
        <th>CHECK</th>
        <th>Drawee Bank</th>
        <th>Number</th>
        <th>Date Check</th>
        <th>Amount</th>
      </tr>

      <tr v-for="(item, index) in transactions" :key="index">
        <td>{{ item.dateTrans }}</td>
        <td>{{ item.arNo }}</td>
        <td>{{ item.payorName }}</td>
        <td>{{ item.pmtType == "CASH" ? "CASH" : "" }}</td>
        <td>{{ item.pmtType == "CHECK" ? "CHECK" : "" }}</td>
        <td>{{ item.drawee }}</td>
        <td>{{ item.checkNo }}</td>
        <td>{{ item.dateCheck }}</td>
        <td>&#8369; {{ numberWithCommas(getRoundOff(item.amt)) }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold" colspan="8">GRAND TOTAL</td>
        <td class="font-weight-bold">
          &#8369; {{ numberWithCommas(getRoundOff(getTotalAmount)) }}
        </td>
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

  computed: {
    getTotalAmount() {
      let totalAmt = 0;
      this.transactions.forEach(function (val) {
        totalAmt += Number(val.amt);
      });
      return totalAmt;
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
