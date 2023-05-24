<template>
  <div>
    <acknowledgementReceipt
      docno="PR00001"
      :productLine="productLine"
      payor="Kim Ariel N. Dequilla"
      colOfficer="Mitchell Rosauro Barcelona"
      selectedPaymentType="CASH"
    />
  </div>
</template>
<script>
import acknowledgementReceipt from "../../components/Report/acknowledgementReceipt.vue";
export default {
  components: {
    acknowledgementReceipt,
  },

  data() {
    return {
      productLine: [
        {
          prodName: "RICE",
          price: 2000.5,
          class: "bb1",
        },
      ],
    };
  },
  mounted() {
    // window.print();
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>
