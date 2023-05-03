<template>
  <div class="ticket">
    <div class="ticket__header">
      <img class="logoTicket mr-2" src="../../assets/img/logo.png" />
      <p class="headerText">Philippine Crop Insurance Corporation Region XI</p>
    </div>
    <hr />
    <div class="centered">
      <p class="subText">PLEASE WAIT FOR YOUR NUMBER</p>
      <p class="mainText">{{ reportState.windowDesc }}</p>
      <p class="mainTextNumber">
        {{ reportState.windowCode + String(reportState.curNum).padStart(3, "0") }}
      </p>
      <hr />
      <p class="mainTextDate">{{ dateNow }}</p>
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
.ticket {
  font-family: Arial, Helvetica, sans-serif;
  max-width: 200px;
  padding: 0px;
  margin: 50px;
}

.ticket__header {
  display: flex;
}

.centered {
  text-align: center;
  align-content: center;
}

.logoTicket {
  width: 40px;
  height: 40px;
}

.headerText {
  font-size: 12px;
  font-weight: bold;
}

.subText {
  font-size: 12px;
}

.mainText {
  font-size: 14px;
  font-weight: bold;
}

.mainTextNumber {
  font-size: 60px;
  font-weight: bold;
}

.mainTextDate {
  font-size: 12px;
  font-weight: bold;
}
@page {
  size: auto;
}
</style>
