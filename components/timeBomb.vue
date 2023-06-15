<template>
  <div>
    <b-modal
      id="timeBomb"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      header-bg-variant="danger"
    >
      <h5 class="mb-3">
        <code>Beta</code> version has expired please contact App Developer.
      </h5>

      <hr />

      <font-awesome-icon :icon="['fas', 'phone-volume']" /> 09183893886
      <br />
      <font-awesome-icon :icon="['fas', 'envelope']" /> deqkim4@gmail.com
    </b-modal>

    <b-modal
      id="timeBombWarning"
      title="Warning!"
      ok-only
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      header-bg-variant="warning"
    >
      <p class="mb-3">
        <code>Beta</code> version will expire on
        <b> {{ new Date(dateExp).toDateString() }}</b
        >.
      </p>

      <hr />

      <font-awesome-icon :icon="['fas', 'phone-volume']" /> 09183893886
      <br />
      <font-awesome-icon :icon="['fas', 'envelope']" /> deqkim4@gmail.com
    </b-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateExp: "",
    };
  },
  mounted() {
    this.dateExp = process.env.DATE_EXP;

    if (new Date(this.getDate) < new Date(process.env.DATE_EXP)) {
      this.$bvModal.show("timeBombWarning");
    }

    this.interval = setInterval(() => {
      if (this.getDate == process.env.DATE_EXP) {
        this.$bvModal.show("timeBomb");
      }
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    getDate() {
      return new Date().toLocaleDateString();
    },
  },
};
</script>
