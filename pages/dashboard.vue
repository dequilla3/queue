<template>
  <div>
    <logout mode="light" pos="left" />
    <input
      class="uploadBtn"
      type="file"
      accept="video/*"
      @change="handleFileUpload($event)"
    />
    <timeBomb />
    <div class="dashboard">
      <div class="dashboard__content">
        <div class="dashboard__vid">
          <video id="video-preview" loop autoplay muted controls>
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
                <td :class="`td--queue_number ${item.class}`">
                  {{ `${item.tCode}${String(item.qNum).padStart(3, "0")}` }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bottom_section" @dblclick="editRunningText">
        <div class="bottom_section__time">
          {{ dateNow.toString().toUpperCase() }}
        </div>
        <div class="marquee">
          <p>{{ runningText }}</p>
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

      <b-modal
        id="popUp"
        title="Information!"
        ok-only
        no-close-on-esc
        no-close-on-backdrop
        hide-header-close
      >
        <p class="my-4">Please make sure audio at high volume.</p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import logo from "../assets/img/logo.png";
import logout from "../components/logout.vue";
import { Howl } from "howler";

export default {
  name: "dashboard",
  components: {
    logout,
  },
  data() {
    return {
      file: [],
      sound: new Howl({
        src: ["attention.mp3"],
      }),

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
          class: "",
        },
        {
          windowId: 2,
          windowDesc: "WINDOW 2",
          tCode: "C",
          qNum: 0,
          wCode: "w2",
          class: "",
        },
        {
          windowId: 3,
          windowDesc: "WINDOW 3",
          tCode: "P",
          qNum: 0,
          wCode: "w3",
          class: "",
        },
        {
          windowId: 4,
          windowDesc: "WINDOW 4",
          tCode: "A",
          qNum: 0,
          wCode: "w4",
          class: "",
        },
        {
          windowId: 5,
          windowDesc: "WINDOW 5",
          tCode: "T",
          qNum: 0,
          wCode: "w5",
          class: "",
        },
      ],
    };
  },

  methods: {
    previewVideo() {
      let video = document.getElementById("video-preview");
      const fileURL = URL.createObjectURL(this.file);
      video.src = fileURL;
      localStorage.fileURL = fileURL;
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
      this.previewVideo();
    },
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

    async fetchQueueList(val) {
      await this.$store.dispatch("counter/getAllQueueList", val.wCode).then((res) => {
        let ongoing = res.data.filter(function (val) {
          return val.status == "ONGOING";
        });

        let newQnum = ongoing[0] ? ongoing[0].queue_num : 0;

        /**
         * CONDITION:
         *    - IF new queue number is not equal current queue number and IF new queue number is not equal to 0 wil play the audio
         */
        if (newQnum != val.qNum) {
          val.qNum = newQnum;
          if (newQnum != 0) this.splashQueueNum(val, 6);
          this.playSound(newQnum);
        }
      });
    },

    splashQueueNum(val, blinkCount) {
      //init timeout mili secs
      let timeOutMS = 0;
      //init count of blink. Blink count will be blinkCount / 2
      blinkCount *= 2;
      // loop 12 times and it will blink 6 times
      for (let i = 0; i < blinkCount; i++) {
        // increase timeout ms to blink every loop
        timeOutMS += 400;

        setTimeout(() => {
          /**
           * set and unset css class every loop to make it blink
           * thats why 12 loops equivalent to 6 blinks
           */
          val.class = val.class == "" ? "queueColor" : "";
        }, timeOutMS);
      }
    },

    async playSound(newQnum) {
      //dont execute if incoming number is zero
      if (newQnum == 0) return;
      //stop sound first before playing to prevent mixing of sounds
      this.sound.stop();
      this.sound.play();
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

  mounted() {
    let video = document.getElementById("video-preview");
    video.src = localStorage.fileURL;
    setTimeout(() => {
      if (video.currentTime == 0) {
        video.src = "vid1.mp4";
      }
    }, 1000);

    this.$bvModal.show("popUp");

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
.switchCb {
  position: absolute;
  font-weight: bold;
  color: white;
  left: 5%;
  top: 2%;
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
  width: 100vw;
  height: 100vh;
  position: fixed;

  background: rgb(0, 153, 0);
  &__content {
    display: flex;
    height: 95vh;
  }
  &__vid {
    background: gray;
    width: 70vw;
    margin: 5px 5px 5px 5px;
  }
  &__queue {
    &__logo {
      position: absolute;
      display: flex;
      height: 9vh;
      width: 30.5vw;
      padding: 10px;
      margin-top: 5px;
      color: white;
      background: rgb(0, 116, 0);
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
  height: 93.5vh;
  margin: 5px 5px 5px 0px;
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
  transition: 0.5s;
}

.td--window {
  color: white;
  font-size: 40px;
  font-weight: bolder;
  letter-spacing: -0.1em;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
}

.td--queue_number {
  color: #ff342a;
  font-size: 72px;
  font-weight: bolder;
  letter-spacing: 0.1em;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
  -webkit-text-stroke: 1px white;
}
.queueColor {
  color: #ffffff;
  text-shadow: 6px -1px 50px rgba(255, 0, 0, 1);
}

.bottom_section {
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  background: green;
  color: white;
  text-align: center;
  display: flex;

  &__time {
    text-align: center;
    color: black;
    font-size: 22px;
    background: white;
    padding-top: 5px;

    width: 30vw;
    margin: 0px 5px 5px 5px;
  }
}

.uploadBtn {
  position: absolute;
  z-index: 1000;
  top: 1.8%;
  left: 4%;
  color: white;
  cursor: pointer;
  width: 150px;
  opacity: 0.2;
  font-size: 8px;

  &:hover {
    opacity: 0.5;
  }
}

@media only screen and (max-width: 1500px) {
  td {
    padding: 0 10px;
  }
  .td--window {
    font-size: 28px;
  }
}

@media only screen and (min-width: 1920px) {
  .dashboard {
    &__queue {
      &__logo {
        width: 30vw;
      }
    }
  }
  .td--window {
    font-size: 40px;
  }
  .td--queue_number {
    font-size: 110px;
  }
  th {
    font-size: 40px;
  }

  table {
    height: 94vh;
  }

  .bottom_section {
    &__time {
      font-size: 22px;
      padding-top: 10px;
    }
  }
}
</style>
