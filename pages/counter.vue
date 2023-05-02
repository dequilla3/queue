<template>
  <div class="counter_container">
    <div class="counter_container__main">
      <div class="counter_container__main__text">
        <h2 class="mb-5">WINDOW 1</h2>
        <p class="counter_container__main__text__num">A001</p>
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
      <b-button class="counter_container__actions__btn bg-success">
        <font-awesome-icon class="icn" icon="fa-solid fa-arrow-right" />
        NEXT</b-button
      >
      <b-button class="counter_container__actions__btn bg-warning"
        ><font-awesome-icon class="icn" icon="fa-solid fa-rotate-right" />
        RECALL</b-button
      >
      <b-button class="counter_container__actions__btn bg-default"
        ><font-awesome-icon class="icn" icon="fa-solid fa-pause" />
        HOLD</b-button
      >

      <b-button
        @click="onSelectHeldNum()"
        class="counter_container__actions__btn bg-info"
        ><font-awesome-icon class="icn" icon="fa-solid fa-arrow-down" /> INSERT
        HELD NUMBER</b-button
      >
    </div>

    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      id="held_modal"
      ref="modal"
      title="Re-insert held number"
    >
      <b-table hover :items="getHeldNumber" :fields="tblHeldNumFields">
        <template #cell(queueNum)="row">
          <h2>{{ row.item.queueNum }}</h2>
        </template>
        <template #cell(action)="row">
          <b-button variant="success">INSERT</b-button>
        </template>
      </b-table>

      <template #modal-footer>
        <div class="w-100">
          <b-button @click="$bvModal.hide('held_modal')" variant="danger"
            >Cancel</b-button
          >
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tblHeldNumFields: [
        { key: "queueNum", label: "Queue #" },
        { key: "dateQueue", label: "Date Queued" },
        { key: "action", label: "Action" },
      ],
    };
  },
  methods: {
    onSelectHeldNum() {
      this.$bvModal.show("held_modal");
    },
  },

  computed: {
    getHeldNumber() {
      return this.$store.state.counter.heldNumber;
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
