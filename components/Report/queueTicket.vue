<template>
  <div class="ticket">
    <div class="ticket__header">
      <img class="logoTicket mr-2" src="../../assets/img/logo.png" alt="" />
      <p class="headerText">Philippine Crop Insurance Corporation Region XI</p>
    </div>
    <div class="body">
      <div class="subText">PLEASE WAIT FOR YOUR NUMBER</div>
      <div class="mainText">{{ reportState.windowDesc }}</div>
      <div class="mainTextNumber">
        {{ reportState.windowCode + String(reportState.curNum).padStart(3, "0") }}
      </div>
      <div class="mainTextDate">{{ dateNow }}</div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "queueTicket",
  data() {
    return {
      dateNow: moment().format("LLLL"),
    };
  },

  method: {},

  created() {
    this.interval = setInterval(() => {
      this.dateNow = moment().format("LLLL");
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  computed: {
    reportState() {
      return this.$store.state.queueticket.reportState;
    },
  },
};
</script>
<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}
.ticket {
  max-width: 200px;
  padding: 0px;
  margin: 20px 40px;
  scale: 120%;
}

.ticket__header {
  display: flex;
}

.centered {
  text-align: center;
  align-content: center;
}

.logoTicket {
  width: 35px;
  height: 30px;
}

.headerText {
  font-size: 12px;
  font-weight: bold;
}

.subText {
  font-size: 10px;
}

.mainText {
  font-size: 16px;
  font-weight: bold;
}

.mainTextNumber {
  font-size: 50px;
  font-weight: bold;
}

.mainTextDate {
  font-size: 12px;
  font-weight: bold;
}
@page {
  size: auto;
}

.body {
  text-align: center;
}
</style>
