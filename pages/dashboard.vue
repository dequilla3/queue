<template>
  <div>
    <sidebar />
    <bottomSection />
    <div
      v-bind:class="{
        main_container_collapse: getIsBarClicked,
        main_container: !getIsBarClicked,
      }"
    >
      <div class="row">
        <div class="col">
          <video loop preload="metadata" autoplay muted>
            <source src="test.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div class="col-7">
          <div class="row">
            <div class="col col_header">Counter</div>
            <div class="col col_header">Customer</div>
            <div class="col col_header">Next</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import bottomSection from "../components/bottomSection.vue";
export default {
  name: "dashboard",
  data() {
    return {};
  },
  components: {
    sidebar,
    bottomSection,
  },
  computed: {
    getIsBarClicked() {
      return this.$store.state.dashboard.barIsClicked;
    },
  },
};
</script>

<style lang="scss" scoped>
.col_header {
  text-align: center;
  padding: 20px;
  background: whitesmoke;
  margin-right: 5px;
  font-size: 80px;
  font-weight: bold;
}
.vid {
  height: 100vh;
}
video {
  object-fit: fill;
  width: 100%;
  height: 90vh;
  bottom: 50px;
}
</style>
