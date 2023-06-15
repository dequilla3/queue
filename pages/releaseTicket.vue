<template>
  <div>
    <div class="release_ticket dontPrint">
      <timeBomb />
      <logout mode="light" pos="left top-1" />
      <div class="logo"><img src="../assets/img/logo.png" alt="" /></div>
      <div class="release_ticket__header">WELCOME</div>
      <div class="release_ticket__sub_header">PLEASE SELECT TRANSACTION</div>
      <hr />
      <div class="window_container">
        <div
          v-for="(wind, index) in getWindowsTransaction"
          :key="index"
          class="window_container__item"
        >
          <h6 class="window_container__item__header">{{ wind.desc }}</h6>
          <button
            v-for="(trans, index) in wind.transactions"
            :key="index"
            class="window_container__item__button"
            @click="onSelecTransaction(wind, trans)"
          >
            <h2>{{ trans.headText }}</h2>
            <h6>({{ trans.subText }})</h6>
          </button>
        </div>
      </div>

      <b-modal
        no-close-on-backdrop
        no-close-on-esc
        hide-footer
        id="gender_modal"
        ref="modal"
        title="Select Gender"
      >
        <b-overlay :show="isLoading" rounded="sm" opacity="0.5">
          <b-button
            @click="onSelectGender('MALE')"
            variant="primary"
            class="gender_btn mb-1"
            >MALE</b-button
          >
          <b-button
            @click="onSelectGender('FEMALE')"
            variant="success"
            class="gender_btn mb-1"
            >FEMALE</b-button
          >

          <b-button @click="$bvModal.hide('gender_modal')" variant="danger w-100 mt-5"
            ><font-awesome-icon icon="fa-solid fa-close" />
            CANCEL
          </b-button>
        </b-overlay>
      </b-modal>
    </div>
    <!-- ticket  -->
    <queueTicket class="print" />
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import queueTicket from "../components/Report/queueTicket.vue";
import logout from "../components/logout.vue";

export default {
  name: "release-ticket",
  components: {
    queueTicket,
    logout,
  },
  data() {
    return {
      isLoading: false,
      wind: [],
      trans: [],
      gender: [],
    };
  },

  methods: {
    onSelecTransaction(wind, trans) {
      this.wind = wind;
      this.trans = trans;
      this.$bvModal.show("gender_modal");
    },

    async onSelectGender(gender) {
      this.gender = gender;
      this.isLoading = true;
      this.doPostTransaction();
    },

    async doPostTransaction() {
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/queuing/generateQueueNum`,
        data: {
          winNum: this.wind.winNum,
          transType: this.trans.transCode,
          date_queue: moment().format(),
          gender: this.gender,
        },
      })
        .then((res) => {
          /*SET TICKET DETAILS*/
          this.$store.commit("queueticket/SET_REPORTSTATE", {
            curNum: res.data[0].queue_num,
            windowCode: this.wind.windowCode,
            windowDesc: this.wind.desc,
          });
          /*TRIGGER PRINT AFTEREACH*/
          this.$nextTick(() => {
            this.isLoading = false;
            this.$bvModal.hide("gender_modal");

            setTimeout(() => {
              window.print();
            }, 100);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    setReportState() {},
  },

  beforeCreate() {
    if (localStorage.role != "guard") this.$router.push({ path: "/" });
    this.roleCheckInterval = setInterval(() => {
      if (localStorage.role != "guard") this.$router.push({ path: "/" });
    }, 5000);
  },

  beforeDestroy() {
    clearInterval(this.roleCheckInterval);
  },

  computed: {
    getWindowsTransaction() {
      return [
        {
          desc: "WINDOW 1",
          winNum: "w1",
          windowCode: "M",
          transactions: [
            {
              headText: "SUBMIT INSURANCE APPLICATION",
              subText: "ISUMITE ANG APLIKASYON SA SEGURO",
              transCode: "t1",
            },
            {
              headText: "INQUIRY INSURANCE POLICY",
              subText: "PAGTATANONG TUNGKOL SA PATAKARAN NG SEGURO",
              transCode: "t2",
            },
          ],
        },

        {
          desc: "WINDOW 2",
          winNum: "w2",
          windowCode: "C",
          transactions: [
            {
              headText: "SUBMIT CLAIMS APPLICATION",
              subText: "ISUMITE ANG APLIKASYON NG INYONG CLAIM",
              transCode: "t1",
            },
            {
              headText: "INQUIRY CHECK STATUS",
              subText: "PAGTATANONG KUNG ANU ANG KATAYUAN NG TSEKE",
              transCode: "t2",
            },
          ],
        },

        {
          desc: "WINDOW 3",
          winNum: "w3",
          windowCode: "P",
          transactions: [
            {
              headText: "PWD / SENIOR CITEZEN / PREGNANT",
              subText: "MAY KAPANSANAN / MATATANDA / BUNTIS",
              transCode: "t1",
            },
          ],
        },

        {
          desc: "WINDOW 4",
          winNum: "w4",
          windowCode: "A",
          transactions: [
            {
              headText: "CLAIM INDEMNITY CHECK",
              subText: "PAGKUHA NG BAYAD PINSALA",
              transCode: "t1",
            },
            {
              headText: "INQUIRY CHECK AVAILABILITY",
              subText: "PAGTATANONG KUNG MAYROONG TSEKE",
              transCode: "t2",
            },
          ],
        },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
$margin: 15%;
.logo {
  position: absolute;
  top: 5%;
  left: 25%;
  z-index: -1;
  & img {
    width: 50vw;
    height: 90vh;
    opacity: 0.08;
  }
}
.release_ticket {
  &__header {
    background: forestgreen;
    color: white;
    margin: 0px 0 5px 0;
    text-align: center;
    padding: 10px;
    font-size: 25px;
    letter-spacing: 0.5em;
  }

  &__sub_header {
    font-size: 20px;
    text-align: center;
  }
}

.window_container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
  margin-left: $margin;
  margin-right: $margin;

  &__item {
    padding-bottom: 20px;
    margin-left: 5px;
    margin-right: 5px;

    &__header {
      text-align: center;
    }
    &__button {
      background: forestgreen;
      border: 0;
      width: 100%;
      color: white;
      padding-top: 5vh;
      padding-bottom: 5vh;
      margin-bottom: 10px;
      box-shadow: 10px 10px 32px 2px rgba(0, 0, 0, 0.26);
      -webkit-box-shadow: 10px 10px 32px 2px rgba(0, 0, 0, 0.26);
      -moz-box-shadow: 10px 10px 32px 2px rgba(0, 0, 0, 0.26);
      &:active {
        opacity: 0.9;
      }
    }
  }
}

.gender_btn {
  font-size: 50px;
  width: 100%;
}

@media screen and (max-height: 900px) {
  .window_container {
    &__item {
      &__button {
        padding-top: 3.5vh;
        padding-bottom: 3.5vh;
      }
    }
  }
}
</style>
