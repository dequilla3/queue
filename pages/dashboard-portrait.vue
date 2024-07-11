<template>
  <div class="">
    <!-- <logout mode="light" pos="left" />
    <input
      class="uploadBtn"
      type="file"
      accept="video/*"
      @change="handleFileUpload($event)"
    /> -->
    <div class="bg-success-dark d-flex p-40 w-full">
      <img :src="logo" class="mr-5" alt="" style="width: 200px; height: auto" />
      <div class="header">PHILIPPINE CROP INSURANCE CORPORATION REGION XI</div>
    </div>
    <div class="pr-100px pl-100px pt-lg-5">
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

    <div class="bg-success-dark footer">
      <div class="date">{{ dateNow.toString().toUpperCase() }}</div>
      <!-- <div class="marquee">
        <p>{{ runningText }}</p>
      </div> -->
    </div>

    <b-modal id="popUp" hide-footer no-close-on-esc size="xl">
      <div class="text-center align-content-center p-100px">
        <p class="my-4 popUp--text">Please make sure audio at high volume.</p>
        <b-button
          @click="$bvModal.hide('popUp')"
          pill
          class="popUp--btn"
          variant="success"
          >Okay</b-button
        >
      </div>
    </b-modal>
  </div>
</template>

<script>
import logo from "../assets/img/logo.png";
import moment from "moment";
import logout from "../components/logout.vue";
import { Howl } from "howler";

export default {
  name: "dashboard-portrait",
  data() {
    return {
      logo: logo,
      file: [],
      sound: new Howl({
        src: ["attention.mp3"],
      }),
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
      await this.$store
        .dispatch("counter/getAllQueueList", val.wCode)
        .then((res) => {
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

<style>
body {
  background-color: green;
  overflow: hidden;
}
.header {
  font-size: 100px;
  padding: 60;
  font-weight: bold;
  color: white;
}

.w-full {
  width: 100%;
}

.p-40 {
  padding: 100px;
}
table {
  width: 100%;
}

th {
  padding-top: 50px;
  font-size: 100px;
  color: white;
}

td {
  padding-top: 50px;
  border-bottom: 5px solid #5d5d5d;
}

.bg-success-dark {
  background-color: darkgreen;
}

.td--window {
  font-size: 130px;
  color: whitesmoke;
}

.td--queue_number {
  font-size: 220px;
  font-weight: bolder;
  color: #ff342a;
  letter-spacing: 0.1em;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
}

.popUp--text {
  font-size: 100px;
  padding-bottom: 100px;
}
.popUp--btn {
  font-size: 100px;
  padding: 50px 80px;
}

.modal-xl {
  max-width: 1000px;
}
.p-100px {
  padding: 100px;
}

.pl-100px {
  padding-left: 100px;
}
.pr-100px {
  padding-right: 100px;
}
.queueColor {
  color: #ffffff;
  text-shadow: 6px -1px 50px rgba(255, 0, 0, 1);
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 50px;
  display: flex;
  color: rgb(41, 41, 41);
}

.date {
  background-color: whitesmoke;
  font-size: 80px;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
}

video {
  width: 100%;
  height: 100%;
  box-shadow: -1px 14px 38px -6px rgba(0, 0, 0, 0.36);
  -webkit-box-shadow: -1px 14px 38px -6px rgba(0, 0, 0, 0.36);
  -moz-box-shadow: -1px 14px 38px -6px rgba(0, 0, 0, 0.36);
}
</style>
