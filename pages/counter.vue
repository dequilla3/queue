<template>
  <div>
    <div class="dontPrint">
      <timeBomb />
      <sidebar />
      <div class="counter_container dontPrint">
        <b-button @click="onPrintQueueReport()" class="btn-print" pill variant="primary">
          <font-awesome-icon style="font-size: 16px" icon="fa-solid fa-print"
        /></b-button>
        <div class="counter_container__main">
          <div class="counter_container__main__text">
            <b class="f18">{{ getWindDesc }}</b>
            <br />
            <b>CURRENT SERVING</b>
            <p class="counter_container__main__text__num">
              {{ getQueueNum() }}
            </p>
          </div>

          <br />

          <div>
            <b-table
              class="queueTbl"
              sticky-header="60vh"
              :items="queues"
              :fields="queueTblFields"
              :tbody-tr-class="setQueueTblBg"
              head-variant="light"
            >
            </b-table>
          </div>
        </div>

        <div class="counter_container__actions">
          <div class="logo">
            <img class="logo__img mr-2" src="../assets/img/logo.png" alt="" />
            <p class="logo__txt">
              PHILIPPINE CROP <br />
              INSURANCE CORPORATION <br />
              REGION XI
            </p>
          </div>
          <hr />
          <b-overlay :show="showOverlayNext">
            <b-button
              :disabled="!audioDone || !donePost"
              @click="onNext()"
              class="counter_container__actions__btn bg-success"
            >
              <font-awesome-icon class="icn" icon="fa-solid fa-arrow-right" />
              NEXT
            </b-button>
          </b-overlay>

          <b-button
            :disabled="!audioDone || !donePost"
            @click="onRecall()"
            class="counter_container__actions__btn bg-warning"
          >
            <font-awesome-icon class="icn" icon="fa-solid fa-rotate-right" />
            RECALL
          </b-button>

          <b-button
            :disabled="!audioDone || !donePost"
            @click="onHold()"
            class="counter_container__actions__btn bg-default"
          >
            <font-awesome-icon class="icn" icon="fa-solid fa-pause" />
            HOLD
          </b-button>

          <b-button
            :disabled="!audioDone || !donePost"
            @click="onInsertHeldNum()"
            class="counter_container__actions__btn bg-info"
            ><font-awesome-icon class="icn" icon="fa-solid fa-arrow-down" />
            INSERT HELD NUMBER
          </b-button>

          <b-overlay :show="showOverlayNext && getRole == 'w1'">
            <b-button
              :disabled="!audioDone || !donePost"
              @click="doPostQueue()"
              v-show="getRole == 'w1'"
              class="counter_container__actions__btn bg-default"
            >
              Queue Window 5
            </b-button>
          </b-overlay>
        </div>

        <b-modal
          no-close-on-backdrop
          no-close-on-esc
          id="held_modal"
          ref="modal"
          title="Re-insert held number"
          size="lg"
        >
          <b-input-group prepend="Search" class="mb-2">
            <b-form-input
              v-model="lblSearch"
              @change="filteredHold()"
              aria-label="Enter text here..."
            ></b-form-input>
          </b-input-group>
          <b-table sticky-header hover :items="filteredHold()" :fields="tblHeldNumFields">
            <template #cell(queue_num)="row">
              <h2>{{ row.item.queue_num }}</h2>
            </template>

            <template #cell(date_queue)="row">
              <h2>{{ new Date(row.item.date_queue).toDateString() }}</h2>
            </template>

            <template #cell(action)="row">
              <b-button @click="onSelectHeldNum(row.item)" variant="success"
                >INSERT</b-button
              >
            </template>
          </b-table>

          <template #modal-footer>
            <div class="w-100">
              <b-button @click="$bvModal.hide('held_modal')" variant="danger"
                >Cancel
              </b-button>
            </div>
          </template>
        </b-modal>

        <b-modal id="reportParam" title="Queue Report Parameter">
          <label for="dateFrom">Date From:</label>
          <b-form-datepicker
            class="mr-1 mb-1"
            v-model="dateFrom"
            locale="en"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
          />

          <label for="dateTo">Date To:</label>
          <b-form-datepicker
            class="mr-1"
            v-model="dateTo"
            locale="en"
            :date-format-options="{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            }"
          />

          <template #modal-footer>
            <div class="w-100">
              <b-button
                variant="primary"
                size="sm"
                class="float-right"
                @click="printQueueReport()"
              >
                <font-awesome-icon icon="fa-solid fa-print" /> Print
              </b-button>
              <b-button
                size="sm"
                class="float-right mr-1"
                @click="$bvModal.hide('reportParam')"
              >
                Cancel
              </b-button>
            </div>
          </template>
        </b-modal>

        <b-alert
          :show="alert.showAlert"
          dismissible
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
          id="alert-message"
        >
          <font-awesome-icon
            :icon="alert.variant == 'success' ? 'check-circle' : 'exclamation'"
            class="alert-icon mr-1"
          />
          {{ alert.message }}
        </b-alert>
      </div>
    </div>
    <!-- ticket  -->
    <queueTicket v-if="isPrintTicket" class="print" />
    <queueReport
      v-if="isPrintReport"
      class="print"
      :queueReportDetails="queueReportDetails"
      :dateFrom="dateFrom"
      :dateTo="dateTo"
    />
  </div>
</template>
<script>
import queueTicket from "../components/Report/queueTicket.vue";
import queueReport from "../components/Report/queueReport.vue";
import logout from "../components/logout.vue";
import sidebar from "../components/sidebar.vue";
import axios from "axios";
import moment from "moment";

export default {
  components: {
    queueTicket,
    queueReport,
    logout,
    sidebar,
  },
  data() {
    return {
      isPrintReport: false,
      isPrintTicket: false,

      perPage: 10,
      queues: [],
      queueTblFields: [
        { key: "status", label: "Status" },
        { key: "queue_num", label: "Queue #" },
        { key: "gender", label: "Gender" },
      ],

      dateFrom: new Date(),
      dateTo: new Date(),

      donePost: true,
      lblSearch: "",

      audioDone: true,
      ongoing: [],
      done: [],
      hold: [],
      selectedHeldQueueId: [],

      showOverlayNext: false,

      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: "",
      },

      tblHeldNumFields: [
        { key: "queue_num", label: "Queue #" },
        { key: "date_queue", label: "Date Queued" },
        { key: "action", label: "Action" },
      ],

      windowCodeList: [
        { key: "w1", counter: "WINDOW 1" },
        { key: "w2", counter: "WINDOW 2" },
        { key: "w3", counter: "WINDOW 3" },
        { key: "w4", counter: "WINDOW 4" },
        { key: "w5", counter: "WINDOW 5" },
      ],

      queueReportDetails: [],
    };
  },

  methods: {
    filteredHold() {
      return this.hold.filter(
        function (val) {
          return val.queue_num.includes(this.lblSearch);
        }.bind(this)
      );
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 5,
        dismissSecs: 2,

        variant,
        message,
      };

      this.showOverlayNext = false;
    },

    async playAudio() {
      this.audioDone = false;
      // audio.play();
      //enable recall btn after 3.2s
      setTimeout(() => {
        this.audioDone = true;
      }, 3500);
    },

    onRecall() {
      if (this.ongoing < 1) {
        this.showAlert("There is no Ongoing transaction", "danger");
        return;
      }

      this.playAudio();
      this.postRecall();
    },

    onInsertHeldNum() {
      this.fetchQueueByStatus("HOLD");
      this.$bvModal.show("held_modal");
    },

    async onSelectHeldNum(item) {
      /**
       * PROCEDURE:
       *  update ongoing to done then;
       *  update selected held to ongoing
       */
      await this.postByStatus("DONE", "ONGOING").then(() => {
        this.post("ONGOING", "HOLD", item.queue_id);
        this.$bvModal.hide("held_modal");
        this.showOverlayNext = false;
      });
    },

    async onNext() {
      await this.fetchAllQueueList().then(() => {
        if (this.getQueueByStatus("PENDING").length == 0) {
          this.showAlert("No PENDING queue.", "danger");
        }
        this.showOverlayNext = true;
        if (this.ongoing < 1) {
          //if without ongoing transaction then post ongoing only
          this.postOngoing();
        } else {
          /**
           * PROCEDURE:
           *  update ongoing to done then;
           *  update latest pending to ongoing
           */
          this.postByStatus("DONE", "ONGOING").then(() => {
            this.postOngoing();
          });

          this.showOverlayNext = false;
        }
      });
    },

    async onHold() {
      if (this.ongoing < 1) {
        this.showAlert("There is no ongoing transaction.", "danger");
      } else {
        /**
         * PROCEDURE:
         *  update ongoing to hold then;
         *  update latest pending to ongoing
         */
        await this.postByStatus("HOLD", "ONGOING").then(() => {
          this.postOngoing();
        });
      }
    },

    async postOngoing() {
      this.postByStatus("ONGOING", "PENDING").catch((err) => {
        this.showAlert(err, "danger");
        this.donePost = true;
      });
    },

    async postByStatus(newStatus, oldStatus) {
      this.donePost = false;
      return await this.fetchAllQueueList().then(() => {
        const queuedByOldStatus = this.getQueueByStatus(oldStatus);
        if (queuedByOldStatus.length > 0) {
          const latestQueuedByOldStatus = queuedByOldStatus[0];
          this.post(newStatus, oldStatus, latestQueuedByOldStatus.queue_id);
          this.showOverlayNext = false;
        } else {
          if (oldStatus == "PENDING") {
            this.showAlert(`No ${oldStatus} queue!`, "danger");
            this.ongoing = [];
            this.donePost = true;
          }
          this.showOverlayNext = false;
        }
      });
    },

    async post(newStatus, oldStatus, id) {
      await this.$store
        .dispatch("counter/postQueuesByStatus", {
          role: localStorage.role,
          newStatus: newStatus,
          oldStatus: oldStatus,
          queueId: id,
        })
        .then(() => {
          if (newStatus == "ONGOING") {
            this.playAudio();
            this.ongoing = this.getOngoing[0];
            this.donePost = true;
            localStorage.ongoing = this.ongoing;
          }
          this.loadQueueTbl();
          this.showOverlayNext = false;
        })
        .catch((err) => {
          this.showAlert(err, "danger");
        });
    },

    postRecall() {
      /**
       * 1. UPDATE ONGOING TO RECALL
       * 2. THEN UPDATE RECALL BACK TO ONGOING
       *
       * TIP: JUST TO TRIGGER DASHBOARD EVENT AND PLAY AUDIO
       */
      this.fetchAllQueueList().then(() => {
        // #1
        const idOngoing = this.getQueueByStatus("ONGOING")[0].queue_id;
        console.log(idOngoing);
        this.$store
          .dispatch("counter/postQueuesByStatus", {
            role: localStorage.role,
            newStatus: "RECALL",
            oldStatus: "ONGOING",
            queueId: idOngoing,
          })
          .then(() => {
            // #2
            setTimeout(() => {
              this.$store
                .dispatch("counter/postQueuesByStatus", {
                  role: localStorage.role,
                  newStatus: "ONGOING",
                  oldStatus: "RECALL",
                  queueId: idOngoing,
                })
                .then(() => {})
                .catch((err) => {
                  this.showAlert(err, "danger");
                });
            }, 1000);
          });
      });
    },

    async fetchAllQueueList() {
      return await this.$store.dispatch("counter/getAllQueueList", localStorage.role);
    },

    getQueueNum() {
      const ongoingNum = this.ongoing.queue_num ? this.ongoing.queue_num : 0;
      return this.getWindCode[0] + String(ongoingNum).padStart(3, "0");
    },

    getQueueByStatus(status) {
      return this.getAllQueueList.filter(function (val) {
        return val.status == status;
      });
    },

    async fetchQueueByStatus(status) {
      await this.fetchAllQueueList()
        .then(() => {
          const queueByStatus = this.getQueueByStatus(status);

          switch (status) {
            case "ONGOING":
              this.ongoing = queueByStatus.length > 0 ? queueByStatus[0] : [];
              break;
            case "HOLD":
              this.hold = queueByStatus.length > 0 ? queueByStatus : [];
              break;
          }
        })
        .catch((err) => {
          this.showAlert(err, "danger");
        });
    },

    async doPostQueue() {
      if (this.ongoing.length < 1) {
        this.showAlert("There's no ongoing transaction.", "danger");
        return;
      }

      this.showOverlayNext = true;

      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/queuing/generateQueueNum`,
        data: {
          winNum: "w5",
          transType: "t1",
          date_queue: moment().format(),
          gender: this.ongoing.gender,
        },
      })
        .then((res) => {
          /*SET TICKET DETAILS*/
          this.$store.commit("queueticket/SET_REPORTSTATE", {
            curNum: res.data[0] ? res.data[0].queue_num : 0,
            windowCode: "T",
            windowDesc: "WINDOW 5",
          });
          /*TRIGGER PRINT AFTEREACH*/
          this.$nextTick(() => {
            this.isPrintReport = false;
            this.isPrintTicket = true;

            this.showOverlayNext = false;
            this.$bvModal.hide("held_modal");

            setTimeout(() => {
              window.print();
            }, 500);
          });
        })
        .catch((err) => {
          this.showAlert(err, "danger");
        });
    },

    fetchReportQueues() {
      return this.$store.dispatch("reports/getAllQueue");
    },

    isBetweenDates(val) {
      if (this.dateFrom != "" && this.dateTo != "") {
        const dateFrom = new Date(new Date(this.dateFrom).toLocaleDateString()).getTime();
        const dateTo = new Date(new Date(this.dateTo).toLocaleDateString()).getTime();
        const dateTrans = new Date(val.date_queue).getTime();
        return dateTrans >= dateFrom && dateTrans <= dateTo;
      }

      return true;
    },

    setQueueReportDetails() {
      this.queueReportDetails = [];
      this.windowCodeList.forEach(
        function (val) {
          let windowData = this.getReportQueues.filter(
            function (rptQueue) {
              return (
                rptQueue.window_num == val.key &&
                rptQueue.status == "DONE" &&
                this.isBetweenDates(rptQueue)
              );
            }.bind(this)
          );

          let windTotalMale = windowData.filter(function (totalMale) {
            return totalMale.gender == "MALE";
          }).length;

          let windTotalFeMale = windowData.filter(function (totalMale) {
            return totalMale.gender == "FEMALE";
          }).length;

          this.queueReportDetails.push({
            key: val.key,
            counter: val.counter,
            totalNum: windowData.length,
            totalMale: windTotalMale,
            totalFemale: windTotalFeMale,
          });
        }.bind(this)
      );

      let grandTotalNum = 0;
      let grandTotalNumMale = 0;
      let grandTotalNumFemale = 0;
      this.queueReportDetails.forEach(function (val) {
        grandTotalNum += val.totalNum;
        grandTotalNumMale += val.totalMale;
        grandTotalNumFemale += val.totalFemale;
      });

      this.$nextTick(() => {
        this.queueReportDetails.push({
          key: "total",
          counter: "GRAND TOTAL",
          totalNum: grandTotalNum,
          totalMale: grandTotalNumMale,
          totalFemale: grandTotalNumFemale,
        });
      });
    },

    onPrintQueueReport() {
      this.$bvModal.show("reportParam");
    },

    printQueueReport() {
      this.fetchReportQueues().then(() => {
        this.setQueueReportDetails();
        this.isPrintReport = true;
        this.isPrintTicket = false;

        this.$bvModal.hide("reportParam");

        setTimeout(() => {
          window.print();
        }, 1000);
      });
    },

    loadQueueTbl() {
      this.fetchAllQueueList().then((res) => {
        this.queues = res.data.slice().reverse();
      });
    },

    setQueueTblBg(item, type) {
      if (!item || type !== "row") return;
      if (item.status === "PENDING") return "table-primary";
      if (item.status === "DONE") return "table-secondary";
      if (item.status === "ONGOING") return "table-success";
      if (item.status === "HOLD") return "table-dark";
    },
  },

  mounted() {},

  beforeCreate() {
    let codes = this.$store.state.counter.windCodes.filter(function (val) {
      return localStorage.role == val.wNum;
    });
    if (codes.length < 1) this.$router.push({ path: "/" });
    this.roleCheckInterval = setInterval(() => {
      let codes = this.$store.state.counter.windCodes.filter(function (val) {
        return localStorage.role == val.wNum;
      });
      if (codes.length < 1) this.$router.push({ path: "/" });
    }, 5000);
  },

  beforeDestroy() {
    clearInterval(this.roleCheckInterval);
    clearInterval(this.interval);
  },

  created() {
    this.fetchReportQueues();
    this.fetchQueueByStatus("ONGOING");
    this.interval = setInterval(() => {
      this.loadQueueTbl();
    }, 3000);
  },

  computed: {
    getReportQueues() {
      return this.$store.state.reports.allQueue;
    },
    getRole() {
      return localStorage.role ? localStorage.role : "";
    },

    getAllQueueList() {
      return this.$store.state.counter.queue;
    },

    getOngoing() {
      return this.getAllQueueList.filter(function (val) {
        return val.status == "ONGOING";
      });
    },

    getWindCode() {
      let codes = this.$store.state.counter.windCodes.filter(function (val) {
        return localStorage.role == val.wNum;
      });
      return codes[0].wCode;
    },

    getWindDesc() {
      let codes = this.$store.state.counter.windCodes.filter(function (val) {
        return localStorage.role == val.wNum;
      });
      return codes[0].desc;
    },
  },
};
</script>
<style lang="scss" scoped>
.counter_container {
  display: flex;
  &__main {
    height: 100vh;
    width: 100%;
    &__text {
      text-align: center;
      margin-top: 40px;
      &__num {
        font-size: 80px;
        font-weight: bold;
        margin-left: 30vh;
        margin-right: 30vh;
        border: 5px solid forestgreen;
        border-radius: 10px;
      }
    }
  }

  .queueTbl {
    border: 1px solid rgb(165, 165, 165);
    height: 1000px !important;
    margin-left: 30vh;
    margin-right: 30vh;
  }

  &__actions {
    width: 30%;
    padding: 50px 30px;
    border-left: 3px outset forestgreen;
    &__btn {
      width: 100%;
      font-size: 25px;
      margin-bottom: 10px;
      border: 0;
      padding: 1.5vh 0;
    }
  }
}

@media only screen and (max-width: 1280px) {
  .tbl_pending {
    &__th {
      border: 1px solid rgb(255, 255, 255);
      padding: 10px 10px 10px 10px;
      font-size: 18px;
      background: #28a745;
      color: white;
      text-align: center;
    }
    &__td {
      border: 1px solid black;
    }
  }
}

.icn {
  font-size: 25px;
}

@media only screen and (max-width: 1280px) {
  .counter_container {
    &__main {
      &__text {
        margin-top: 30px;
        &__num {
          font-size: 60px;
          font-weight: bold;
          margin-left: 30vh;
          margin-right: 30vh;
          border: 5px solid forestgreen;
          border-radius: 10px;
        }
      }
    }

    &__actions {
      &__btn {
        font-size: 16px;
      }
    }
  }

  .icn {
    font-size: 16px;
  }
}

.logo {
  display: flex;
  text-align: left;
  font-weight: bold;
  opacity: 0.75;
  letter-spacing: 0.2em;
  &__img {
    width: 60px;
    height: 60px;
  }

  &__txt {
    font-size: 14px;
  }
}

@media only screen and (max-width: 1280px) {
  .logo {
    &__img {
      width: 40px;
      height: 40px;
    }

    &__txt {
      font-size: 8px;
    }
  }
}
.btn-print {
  position: absolute;
  left: 100px;
  bottom: 20px;
  padding: 10px;
}

.f18 {
  font-size: 18px;
}
</style>
