<template>
  <div class="sideBar">
    <ul>
      <li class="brand">
        <img class="brand__img" src="../assets/img/logo.png" alt="" />
        <label
          >PCIC XI <br /><sub>{{ version }}</sub></label
        >
      </li>
      <hr />
      <li
        :class="`icon ${item.isActive ? 'active' : ''}`"
        v-for="(item, index) in modules"
        :key="index"
        @click="onClickItem(item)"
        :title="item.title"
        v-if="item.show"
      >
        <div>
          <font-awesome-icon class="mr-1" :icon="['fa-solid', item.icon]" />
        </div>
        <div>{{ item.moduleName }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  data() {
    return {
      version: "",
      barIsClicked: true,
      modules: [
        {
          id: 1,
          moduleName: "Counter",
          path: "/counter",
          isActive: false,
          code: "counter",
          icon: "layer-group",
          title: "Counter",
          show: localStorage.role != "admin",
        },
        {
          id: 2,
          moduleName: "A/R",
          path: "/dataentry",
          isActive: false,
          code: "entry",
          icon: "receipt",
          title: "Acknowledgement Receipt",
          show: localStorage.role == "w5",
        },
        {
          id: 3,
          moduleName: "Admin",
          path: "/admin",
          isActive: localStorage.role == "admin",
          code: "admin",
          icon: "user-shield",
          title: "Admin",
          show: localStorage.role == "admin",
        },
        {
          id: 4,
          moduleName: "Logout",
          path: "/",
          isActive: false,
          code: "logout",
          icon: "arrow-right-to-bracket",
          title: "Logout",
          show: true,
        },
      ],
    };
  },

  methods: {
    collapseSidebar() {
      this.barIsClicked = !this.barIsClicked;
      this.$store.commit("dashboard/triggerClick", this.barIsClicked);
    },

    onClickItem(item) {
      this.setActiveModule(item.code);
      if (item.code != "logout") {
        this.$router.push({ path: item.path });
        return;
      }

      this.showMsgBoxConfirmation();
    },

    setActiveModule(code) {
      this.modules.forEach(function (val) {
        val.isActive = false;
        if (code == val.code) {
          val.isActive = true;
          localStorage.activeMenu = val.code;
          localStorage.activePath = val.path;
        }
      });
    },

    showMsgBoxConfirmation() {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to Logout?", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.$router.push({ path: "/" });
            //clear storage except dashboard running text
            const runText = localStorage.runningText;
            localStorage.clear();
            localStorage.runningText = runText;
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
  },

  mounted() {
    this.setActiveModule(localStorage.activeMenu);
    this.version = process.env.VERSION;
  },
};
</script>

<style lang="scss" scoped>
.sideBar {
  position: fixed;
  background: whitesmoke;
  left: 0;
  top: 0;
  bottom: 0;
  transition: 0.1s ease;
  width: 80px;
  box-shadow: 3px 2px 53px -33px rgba(0, 0, 0, 0.71);
  -webkit-box-shadow: 3px 2px 53px -33px rgba(0, 0, 0, 0.71);
  -moz-box-shadow: 3px 2px 53px -33px rgba(0, 0, 0, 0.71);

  &__bars {
    position: absolute;
    cursor: pointer;
    top: 30px;
    left: 20px;
  }

  &__text {
    font-size: 18px;
  }
}

ul {
  list-style-type: none;
  margin-top: 50px;
}

li {
  text-align: center;
  align-items: center;
  font-size: 16px;
  margin-bottom: 30px;
  transition: 0.1s ease;
  padding: 20px 0px;

  cursor: pointer;

  &:hover {
    background: rgb(216, 216, 216);
  }
}

.active {
  background: rgb(216, 216, 216);
}

.icon {
  display: block;
}

.brand {
  align-items: center;
  cursor: pointer;
  font-weight: bold;

  &__img {
    width: 50px;
    height: 50px;
  }
}
</style>
