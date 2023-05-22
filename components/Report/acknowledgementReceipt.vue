<template>
  <div class="report">
    <div class="head-section">
      <div class="logo pt-4">
        <img class="mr-2" src="../../static/logo.png" alt="" />
        <p>
          <b class="f13"> PHILIPPINE CROP</b> <br />
          <b class="f13"> INSURANCE CORPORATION</b> <br />
          <span class="sub-text">REGION XI</span>
        </p>
      </div>
      <div class="title">
        <h6 class="pt-2 pb-2 bb1 f14">
          <b>ACKNOWLEDGEMENT RECEIPT</b>
        </h6>
        <h4 class="bb1 pb-1">No. {{ this.docno }}</h4>
        <p class="f14">Date: {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>

    <div class="body_section">
      <div class="bb1 pt-1 pb-1 pl-1 payor">
        PAYOR:
        <h4 class="ml-2">
          {{ this.payor.toUpperCase() }}
        </h4>
      </div>
      <div>
        <table class="">
          <caption></caption>
          <tr>
            <th style="border-bottom: 1px solid #000000; border-right: 1px solid #000000">
              PRODUCT LINE
            </th>
            <th style="border-bottom: 1px solid #000000">AMOUNT</th>
          </tr>

          <tr v-for="item in productLine" :key="item.index">
            <td :class="`pl-3 br1 ${item.class}`">
              {{ item.prodName }}
            </td>

            <td :class="`pl-3 ${item.class}`">
              <font-awesome-icon class="f10" icon="fa-solid fa-peso-sign" />
              {{ numberWithCommas(getRoundOff(item.price)) }}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="footer_section">
      <div class="pl-1 bb1"><b>AMOUNT IN WORDS</b></div>
      <div class="text-center bb1">
        <b class="f16">{{ getNumToWord }}</b>
      </div>

      <div class="payment_type bb1">
        <div class="payment_type_group br1">
          <div class="payment_type_select">
            <div class="payment_type_select_box mr-2">
              <font-awesome-icon
                v-show="this.selectedPaymentType == 'CASH'"
                icon="fa-solid fa-check"
              />
            </div>
            <b>CASH</b>
          </div>
          <div class="payment_type_select">
            <div class="payment_type_select_box mr-2">
              <font-awesome-icon
                v-show="this.selectedPaymentType == 'CHECK'"
                icon="fa-solid fa-check"
              />
            </div>
            <b>CHECK</b>
          </div>
        </div>

        <div class="payment_type_table">
          <div class="payment_type_tr br1">
            <div class="bb1 pb-1"><b>Drawee Bank</b></div>
            <div class="payment_type_td">{{ this.draweeBank }}</div>
          </div>
          <div class="payment_type_tr br1">
            <div class="bb1 pb-1"><b>Number</b></div>
            <div class="payment_type_td">{{ this.number }}</div>
          </div>
          <div class="payment_type_tr">
            <div class="bb1 pb-1"><b>Date</b></div>
            <div class="payment_type_td">{{ this.dateCheck }}</div>
          </div>
        </div>
      </div>

      <div class="signature">
        <div class="co">
          <u
            ><b>{{ this.colOfficer.toUpperCase() }}</b></u
          >

          <div>Collecting Officer</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { convertNuWithCents } from "../../util/convertNumbertoWords";
export default {
  data() {
    return { totalAmt: 0 };
  },

  props: {
    docno: String,
    productLine: Array,
    payor: String,
    colOfficer: String,
    selectedPaymentType: String,
    draweeBank: String,
    number: String,
    dateCheck: String,
  },

  methods: {
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getRoundOff(num) {
      return (Math.round(num * 100) / 100).toFixed(2);
    },
    fillInBlank() {
      const prodLen = this.productLine.length;
      const maxTableLen = 8;

      this.totalAmt = 0;

      for (let i = 0; i < maxTableLen - prodLen; i++) {
        if (i == maxTableLen - prodLen - 1) {
          this.productLine.forEach(
            function (val) {
              this.totalAmt += Number(val.price);
            }.bind(this)
          );

          this.productLine.push({
            prodName: "TOTAL",
            price: this.getRoundOff(this.totalAmt),
            class: "font-weight-bold bt1",
          });
        } else {
          this.productLine.push({
            prodName: "",
            price: "0.00",
            class: "color-transparent",
          });
        }
      }
    },
  },

  computed: {
    getNumToWord() {
      return convertNuWithCents(this.totalAmt).toUpperCase();
    },
  },

  created() {
    this.fillInBlank();
  },
};
</script>
<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}

.payor {
  display: flex;
}

.h100 {
  height: 100%;
}

.report {
  margin: 0.5in 24px 24px 24px;
  border: 1px solid #000000;
}

.head-section {
  display: flex;
}

.logo {
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
  display: flex;
  padding: 5px;
  width: 50%;
}

.title {
  border-bottom: 1px solid #000000;
  width: 50%;
  text-align: center;
}

.f10 {
  font-size: 10px;
}
.f11 {
  font-size: 11px;
}

.f12 {
  font-size: 12px;
}

.f13 {
  font-size: 13px;
}

.f14 {
  font-size: 14px;
}

.f16 {
  font-size: 16px;
}

img {
  width: 50px;
  height: 50px;

  /* padding: 20px; */
}

.sub-text {
  font-size: 10px;
}

table {
  border-bottom: 1px solid #000000;
  width: 100%;
}

th {
  /* border: 2px solid #000000; */
  padding: 10px 5px;
  font-size: 12px;
}

.payment_type {
  /* border: 2px solid #000000; */
  display: flex;
}

.payment_type_select {
  display: flex;
}

.payment_type_select_box {
  border: 1px solid #000000;
  height: 18px;
  width: 25px;
  text-align: center;
}

.payment_type_group {
  /* border: 2px solid #000000; */
  padding: 10px;
  width: 200px;
}

.payment_type_table {
  display: flex;
  width: 100%;
}

.payment_type_tr {
  /* border: 2px solid #000000; */
  width: 100%;
  text-align: center;
}

.payment_type_table_data {
  height: 100%;
}

.payment_type_th {
  border: 2px solid #000000;
}

.signature {
  text-align: center;
}

.co {
  padding-top: 35px;
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

.color-transparent {
  color: transparent;
}
</style>
