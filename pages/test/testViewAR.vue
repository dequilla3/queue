<template>
  <div><acknowledgementReceipt /></div>
</template>
<script>
import acknowledgementReceipt from "../../components/Report/acknowledgementReceipt.vue";
export default {
  components: {
    acknowledgementReceipt,
  },
  mounted() {
    window.print();
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>
