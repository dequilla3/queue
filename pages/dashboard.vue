<template>
  <div class="dashboard">
    <div class="dashboard__content">
      <div class="dashboard__vid">
        <video loop preload="metadata" controls>
          <source src="gagss.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="dashboard__queue">
        <div class="dashboard__queue__logo">
          <img src="../assets/img/logo.png" class="mr-2" />
          <p class="dashboard__queue__logo__title">
            PHILIPPINE CROP <br />
            INSURANCE CORPORATION <br />
            REGION XI
          </p>
        </div>
        <table>
          <tr>
            <th>COUNTER</th>
            <th>CLIENT NO.</th>
          </tr>
          <tr v-for="(item, index) in windowQueue" :key="index">
            <td class="td--window">{{ item.windowDesc }}</td>
            <td class="td--queue_number">{{ item.serving }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="bottom_section" @dblclick="ruuningTextEdit">
      <marquee class="bottom_section__running_text">{{ runningText }}</marquee>
      <div class="bottom_section__time"></div>
    </div>

    <b-modal
      id="edit_runningtext_modal"
      ref="modal"
      title="Edit running text"
      @ok="handleOk"
    >
      <form ref="form">
        <b-form-group label="Text" label-for="text-input">
          <b-form-input id="text-input" v-model="tempRunningText" required></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "dashboard",
  data() {
    return {
      runningText: "<>Double Click to edit running text<> ",
      tempRunningText: "",
      windowQueue: [
        {
          windowId: 1,
          windowDesc: "WINDOW 1",
          serving: "M001",
        },
        {
          windowId: 2,
          windowDesc: "WINDOW 2",
          serving: "C001",
        },
        {
          windowId: 3,
          windowDesc: "WINDOW 3",
          serving: "P004",
        },
        {
          windowId: 4,
          windowDesc: "WINDOW 4",
          serving: "A003",
        },
        {
          windowId: 5,
          windowDesc: "WINDOW 5",
          serving: "T004",
        },
      ],
    };
  },

  methods: {
    ruuningTextEdit() {
      this.$bvModal.show("edit_runningtext_modal");
    },

    handleOk() {
      this.$bvModal.hide("edit_runningtext_modal");
      this.runningText = this.tempRunningText;
      localStorage.runningText = this.runningText;
    },
  },

  mounted() {
    this.runningText = localStorage.runningText;
  },
};
</script>

<style lang="scss" scoped>
video {
  object-fit: fill;
  width: 100%;
  height: 100%;
  border: 0;
}

.dashboard {
  display: block;
  background: rgb(0, 153, 0);
  &__content {
    display: flex;
    height: 92vh;
    width: 100vw;
  }
  &__vid {
    background: gray;
    width: 70vw;
    margin: 5px 5px 5px 5px;
  }
  &__queue {
    &__logo {
      display: flex;
      height: 9.5vh;
      width: 30vw;
      padding: 10px;
      margin-top: 5px;
      margin-right: 5px;
      color: white;
      background: yellowgreen;
      &__title {
        -webkit-text-stroke: 0.6px black;
        font-size: 1.8vh;
        font-weight: 600;
        text-shadow: 4px 4px 11px rgba(0, 0, 0, 0.35);
      }
    }
  }
}

table {
  background: rgb(0, 79, 0);
  width: 30vw;
  height: 81.5vh;
  margin-right: 5px;
}

th {
  color: white;
  font-size: 30px;
  letter-spacing: -0.05em;
  padding-left: 20px;
  border: 1px solid #2e2e2e;
}
td {
  border: 1px solid #2e2e2e;
  padding-left: 20px;
}

.td--window {
  color: white;
  font-size: 40px;
  font-weight: bolder;
  letter-spacing: -0.1em;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
}

.td--queue_number {
  color: #ff5047;
  font-size: 70px;
  font-weight: bolder;
  letter-spacing: 0.1em;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
  -webkit-text-stroke: 1px white;
}

.bottom_section {
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  background: yellowgreen;
  color: white;
  text-align: center;
  height: 8vh;
  display: flex;
  &__running_text {
    font-size: 30px;
    padding-top: 2vh;
  }
  &__time {
    background: white;
    height: 7vh;
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    width: 43vw;
  }
}
</style>
