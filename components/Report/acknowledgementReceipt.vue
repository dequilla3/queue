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
        <h6 class="pt-3 pb-3 bt2">
          <b>ACKNOWLEDGEMENT RECEIPT</b>
        </h6>
        <h4 class="bt2 pb-2">No. 0001</h4>
        <p class="">Date: {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>

    <div class="body_section">
      <div class="b2 pt-1 pb-1 pl-1 payor">
        PAYOR:
        <h4 class="ml-2">KIM ARIEL DEQUILLA</h4>
      </div>
      <div>
        <table class="">
          <tr>
            <th>PRODUCT LINE</th>
            <th>AMOUNT</th>
          </tr>
          <tr v-for="item in productLine" :key="item.index">
            <td :class="`pl-2 ${item.class}`">{{ item.prodName }}</td>
            <td :class="`pl-2 ${item.class}`">{{ item.price }}</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="footer_section">
      <div class="b2 pl-1"><b>AMOUNT IN WORDS</b></div>
      <div class="b2 pt-2 pb-1">
        <div class="text-center">
          <b class="f16">{{ getNumToWord }}</b>
        </div>
      </div>

      <div class="payment_type">
        <div class="payment_type_group">
          <div class="payment_type_select">
            <div class="payment_type_select_box mr-2 selected_payment" />
            <b>CASH</b>
          </div>
          <div class="payment_type_select">
            <div class="payment_type_select_box mr-2" />
            <b>CHECK</b>
          </div>
        </div>

        <div class="payment_type_table">
          <div class="payment_type_tr">
            <div class="bt2 pb-1"><b>Drawee Bank</b></div>
            <div class="payment_type_td"></div>
          </div>
          <div class="payment_type_tr">
            <div class="bt2 pb-1"><b>Number</b></div>
            <div class="payment_type_td"></div>
          </div>
          <div class="payment_type_tr">
            <div class="bt2 pb-1"><b>Date</b></div>
            <div class="payment_type_td"></div>
          </div>
        </div>
      </div>

      <div class="signature">
        <div class="co">
          <u><b>Mitchell Barcelona</b></u>
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
    return {
      productLine: [
        {
          prodName: "RICE",
          price: 2000,
          class: "",
        },
      ],
    };
  },

  methods: {
    fillInBlank() {
      let prodLen = this.productLine.length;

      for (let i = 0; i < 8 - prodLen; i++) {
        console.log(i);
        if (i == 8) {
          this.productLine.push({
            prodName: "TOTAL",
            price: "2000",
            class: "font-weight-bold",
          });
        } else {
          this.productLine.push({
            prodName: "-",
            price: "-",
            class: "",
          });
        }
      }
    },
  },

  computed: {
    getNumToWord() {
      return convertNuWithCents(2000).toUpperCase();
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
  /* position: absolute; */
  /* margin: 0.5in; */
  margin-left: 100px;
  border: 2px solid #000000;
  width: 5.5in;
  height: 7.5in;
  transform: rotate(-0.25turn);
}

.head-section {
  display: flex;
}

.logo {
  border: 2px solid #000000;
  display: flex;
  padding: 5px;
  width: 50%;
}

.title {
  border: 2px solid #000000;
  width: 50%;
  text-align: center;
}

.f13 {
  font-size: 13px;
}

.f16 {
  font-size: 16px;
}

.bt2 {
  border-bottom: 2px solid #000000;
}

img {
  width: 50px;
  height: 50px;

  /* padding: 20px; */
}
.b2 {
  border: 2px solid #000000;
}

.sub-text {
  font-size: 10px;
}

table {
  border: 2px solid #000000;
  width: 100%;
}
th {
  border: 2px solid #000000;
  padding: 10px 5px;
}
td {
  border: 2px solid #000000;
  /* color: transparent; */
}

.payment_type {
  border: 2px solid #000000;
  display: flex;
}

.payment_type_select {
  display: flex;
}

.payment_type_select_box {
  border: 2px solid #000000;
  height: 18px;
  width: 25px;
}
.payment_type_group {
  border: 2px solid #000000;
  padding: 10px;
  width: 200px;
}

.payment_type_table {
  display: flex;
  width: 100%;
}
.payment_type_tr {
  border: 2px solid #000000;
  width: 100%;
  text-align: center;
}

.payment_type_table_data {
  height: 100%;
}

.payment_type_th {
  border: 2px solid #000000;
}

.selected_payment {
  border: 9px solid #000000;
}

.signature {
  text-align: center;
}

.co {
  padding-top: 35px;
}
</style>
