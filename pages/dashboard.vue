<template>
  <div>
    <logout mode="light" pos="left" />
    <div class="dashboard">
      <div class="dashboard__content">
        <div class="dashboard__vid">
          <video loop autoplay muted>
            <track
              label="English"
              kind="subtitles"
              srclang="en"
              src="captions/vtt/sintel-en.vtt"
              default
            />
            <source src="vid1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div class="dashboard__queue">
          <div class="dashboard__queue__logo">
            <img :src="logo" class="mr-2" alt="" />
            <p class="dashboard__queue__logo__title">
              PHILIPPINE CROP <br />
              INSURANCE CORPORATION REGION XI
            </p>
          </div>
          <table>
            <caption></caption>
            <thead>
              <tr>
                <th>COUNTER</th>
                <th>CLIENT NO.</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in windowQueue" :key="index">
                <td class="td--window">{{ item.windowDesc }}</td>
                <td class="td--queue_number">
                  {{ `${item.tCode}${String(item.qNum).padStart(3, "0")}` }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bottom_section" @dblclick="editRunningText">
        <div class="marquee">
          <p>{{ runningText }}</p>
        </div>
        <div class="bottom_section__time">
          {{ dateNow.toString().toUpperCase() }}
        </div>
      </div>

      <b-modal
        id="edit_runningtext_modal"
        ref="modal"
        title="Edit running text"
        no-close-on-backdrop
        no-close-on-esc
        @ok="handleOk"
      >
        <b-form-textarea
          id="textarea"
          v-model="tempRunningText"
          placeholder="Enter something..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-modal>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import logo from "../assets/img/logo.png";
import logout from "../components/logout.vue";
import { Howl } from "howler";
import io from "socket.io-client";

const sound = new Howl({
  src: ["attention.mp3"],
});

export default {
  name: "dashboard",
  components: {
    logout,
  },
  data() {
    return {
      server: "Connecting...",
      logo: logo,
      dateNow: "",
      runningText: "<>Double Click to edit running text<>",
      tempRunningText: "",
      windowQueue: [
        {
          windowId: 1,
          windowDesc: "WINDOW 1",
          tCode: "M",
          qNum: 0,
          wCode: "w1",
        },
        {
          windowId: 2,
          windowDesc: "WINDOW 2",
          tCode: "C",
          qNum: 0,
          wCode: "w2",
        },
        {
          windowId: 3,
          windowDesc: "WINDOW 3",
          tCode: "P",
          qNum: 0,
          wCode: "w3",
        },
        {
          windowId: 4,
          windowDesc: "WINDOW 4",
          tCode: "A",
          qNum: 0,
          wCode: "w4",
        },
        {
          windowId: 5,
          windowDesc: "WINDOW 5",
          tCode: "T",
          qNum: 0,
          wCode: "w5",
        },
      ],
    };
  },

  methods: {
    editRunningText() {
      this.$bvModal.show("edit_runningtext_modal");
    },

    handleOk() {
      this.runningText = this.tempRunningText;
      localStorage.runningText = this.runningText;
      this.$nextTick(() => {
        this.$bvModal.hide("edit_runningtext_modal");
      });
    },

    playAudio() {
      const audio = new Audio("attention.mp3");
      audio.play();
    },

    async fetchQueueListPerWindow() {
      this.windowQueue.forEach(
        function (val) {
          this.fetchQueueList(val);
        }.bind(this)
      );
    },

    //TODO: play sound on dasboard
    async fetchQueueList(val) {
      await this.$store
        .dispatch("counter/getAllQueueList", val.wCode)
        .then((res) => {
          let ongoing = res.data.filter(function (val) {
            return val.status == "ONGOING";
          });
          let newQnum = ongoing[0] ? ongoing[0].queue_num : 0;
          if (newQnum != val.qNum && newQnum != 0) {
            val.qNum = newQnum;
          }
        });
    },
  },

  beforeCreate() {
    if (localStorage.role != "dashboard") this.$router.push({ path: "/" });
    this.roleCheckInterval = setInterval(() => {
      if (localStorage.role != "dashboard") this.$router.push({ path: "/" });
    }, 5000);
  },

  beforeDestroy() {
    clearInterval(this.timeInterval);
    clearInterval(this.intervalOngoing);
    clearInterval(this.roleCheckInterval);
  },

  // created() {
  //   let serverLink = `${process.env.baseURL}`;
  //   const socket = io.connect(serverLink, {
  //     secure: true,
  //   });
  //   socket.on("dashboard", () => {
  //     console.log("socket connected to server?", socket.connected);
  //   });
  // },

  mounted() {
    this.intervalOngoing = setInterval(() => {
      this.fetchQueueListPerWindow();
    }, 1000);

    this.timeInterval = setInterval(() => {
      this.dateNow = moment().format("LLLL");
    }, 1000);

    this.runningText =
      localStorage.runningText == undefined
        ? "<>Double Click to edit running text<>"
        : localStorage.runningText;
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}
video {
  object-fit: fill;
  width: 100%;
  height: 100%;
  border: 0;
  z-index: 0;
}

.watermark {
  position: absolute;
  left: 3%;
  top: 3%;
  color: white;
  z-index: 1;
  width: 60px;
  height: 60px;
  opacity: 0.5;
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
        -webkit-text-stroke: 0.3px black;
        font-size: 2vh;
        font-weight: bold;
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
    width: 100vw;
  }
  &__time {
    background: white;
    height: 7vh;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    width: 43vw;
    color: rgb(228, 0, 0);
    font-size: 3vh;
    padding-top: 1vh;
  }
}
</style>
