<template>
  <div><queueTicket /></div>
</template>
<script>
import queueTicket from "../../components/Report/queueTicket.vue";
export default {
  components: {
    queueTicket,
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
