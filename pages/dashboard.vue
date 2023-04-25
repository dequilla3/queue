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
      <div class="grid-container-2">
        <!-- video section -->
        <div class="grid-item mb-2">
          <video loop preload="metadata" autoplay muted>
            <source src="test.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <!-- queue section -->
        <div class="grid-item">
          <div class="grid-container-3 ml-2">
            <div class="grid-item">
              <div class="col_header mb-2 bg-info">Window</div>
              <div
                v-for="(item, index) in windowList"
                :key="index"
                class="col_row mb-2 bg-dark"
              >
                {{ item.desc }}
              </div>
            </div>
            <div class="grid-item">
              <div class="col_header mb-2 bg-info">Serving</div>
              <div
                v-for="(item, index) in windowList"
                :key="index"
                class="col_row mb-2 bg-success"
              >
                {{ item.serving }}
              </div>
            </div>
            <div class="grid-item">
              <div class="col_header mb-2 bg-info">Next</div>
              <div
                v-for="(item, index) in windowList"
                :key="index"
                class="col_row mb-2 bg-warning"
              >
                {{ item.next }}
              </div>
            </div>
          </div>
        </div>
        <!-- end of queue section -->
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
    return {
      windowList: [
        {
          id: 1,
          desc: "#1",
          serving: "001",
          next: "002",
        },
        {
          id: 2,
          desc: "#2",
          serving: "003",
          next: "004",
        },
        {
          id: 3,
          desc: "#3",
          serving: "005",
          next: "006",
        },
        {
          id: 4,
          desc: "#4",
          serving: "007",
          next: "008",
        },
      ],
    };
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
  background: rgb(218, 218, 218);
  margin-right: 5px;
  font-size: 40px;
  font-weight: bold;
}
.col_row {
  text-align: center;
  padding: 18px;
  margin-right: 5px;
  font-size: 65px;
  font-weight: bold;
  color: white;
  height: 21%;
}
video {
  object-fit: fill;
  width: 100%;
  height: 100%;
  bottom: 50px;
}
</style>
