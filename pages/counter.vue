<template>
  <div class="counter_container">
    <div class="counter_container__main">
      <div class="counter_container__main__text">
        <h2 class="mb-5">{{ getWindDesc }}</h2>
        <p class="counter_container__main__text__num">{{ getQueueNum() }}</p>
      </div>
    </div>
    <div class="counter_container__actions">
      <div class="logo">
        <img class="logo__img mr-2" src="../assets/img/logo.png" />
        <p>
          PHILIPPINE CROP <br />
          INSURANCE CORPORATION <br />
          REGION XI
        </p>
      </div>
      <hr />
      <b-overlay :show="showOverlayNext">
        <b-button @click="onNext()" class="counter_container__actions__btn bg-success">
          <font-awesome-icon class="icn" icon="fa-solid fa-arrow-right" />
          NEXT
        </b-button>
      </b-overlay>

      <b-button
        :disabled="!audioDone"
        @click="onRecall()"
        class="counter_container__actions__btn bg-warning"
      >
        <font-awesome-icon class="icn" icon="fa-solid fa-rotate-right" />
        RECALL
      </b-button>

      <b-button
        :disabled="!audioDone"
        @click="onHold()"
        class="counter_container__actions__btn bg-default"
      >
        <font-awesome-icon class="icn" icon="fa-solid fa-pause" />
        HOLD
      </b-button>

      <b-button @click="onSelectHeldNum()" class="counter_container__actions__btn bg-info"
        ><font-awesome-icon class="icn" icon="fa-solid fa-arrow-down" />
        INSERT HELD NUMBER
      </b-button>

      <b-button
        v-show="getRole == 'w1'"
        class="counter_container__actions__btn bg-default"
      >
        Queue Window 5
      </b-button>
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
          <b-button variant="success">INSERT</b-button>
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
</template>
<script>
const audio = new Audio("attention.mp3");
export default {
  data() {
    return {
      lblSearch: "",

      audioDone: true,
      ongoing: [],
      done: [],
      hold: [],

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
      audio.play();
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
    },

    onSelectHeldNum() {
      this.fetchQueueByStatus("HOLD");
      this.$bvModal.show("held_modal");
    },

    async onNext() {
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
        await this.postByStatus("DONE", "ONGOING").then(() => {
          this.postOngoing();
        });

        this.showOverlayNext = false;
      }
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
      });
    },

    async postByStatus(newStatus, oldStatus) {
      return await this.fetchAllQueueList().then(() => {
        /*FETCH Queue by old status and get the latest one and update to new status*/
        const queuedByOldStatus = this.getQueueByStatus(oldStatus);
        if (queuedByOldStatus.length > 0) {
          const latestQueuedByOldStatus = queuedByOldStatus[0];
          //ACTUAL: post request here
          this.post(newStatus, oldStatus, latestQueuedByOldStatus.queue_id);
          this.showOverlayNext = false;
        } else {
          if (oldStatus == "PENDING") {
            this.showAlert(`No ${oldStatus} queue!`, "danger");
            this.ongoing = [];
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
          const listByStatus = this.getQueueByStatus(newStatus);

          this.$nextTick(() => {
            switch (newStatus) {
              case "ONGOING":
                // set new ongoing
                this.ongoing = listByStatus.length > 0 ? listByStatus[0] : [];
                this.playAudio();
                break;
              case "DONE":
                break;
            }
            this.showOverlayNext = false;
          });
        })
        .catch((err) => {
          this.showAlert(err, "danger");
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
  },

  mounted() {
    this.fetchQueueByStatus("ONGOING");
  },

  beforeCreate() {
    let codes = this.$store.state.counter.windCodes.filter(function (val) {
      return localStorage.role == val.wNum;
    });
    if (codes.length < 1) this.$router.push({ path: "/" });
  },

  created() {},

  computed: {
    getRole() {
      return localStorage.role ? localStorage.role : "";
    },

    getAllQueueList() {
      return this.$store.state.counter.queue;
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
    width: 70vw;
    &__text {
      text-align: center;
      margin-top: 20vh;
      &__num {
        font-size: 120px;
        font-weight: bold;
        margin-left: 30vh;
        margin-right: 30vh;
        border: 5px solid forestgreen;
        border-radius: 10px;
      }
    }
  }

  &__actions {
    width: 30vw;
    padding: 50px 30px;
    border-left: 3px outset forestgreen;
    &__btn {
      width: 100%;
      font-size: 32px;
      margin-bottom: 10px;
      border: 0;
      padding: 3vh 0;
    }
  }
}

.icn {
  font-size: 40px;
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
}
</style>
