<template>
  <div v-bind:class="{ sideBar_collapse: barIsClicked, sideBar: !barIsClicked }">
    <ul>
      <li @click="collapseSidebar">
        <font-awesome-icon class="sideBar__brand mr-2" icon="fa-solid fa-bars" />
        <label v-show="!barIsClicked"> QMS</label>
      </li>
      <li
        :class="{ active: item.isActive }"
        v-for="(item, index) in modules"
        :key="index"
        @click="setActiveModule(item.code)"
      >
        <font-awesome-icon class="mr-1" :icon="['fa-solid', item.icon]" />
        <label v-show="!barIsClicked"> {{ item.moduleName }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  data() {
    return {
      barIsClicked: true,
      modules: [
        {
          id: 1,
          moduleName: "Dashboard",
          path: "/dashboard",
          isActive: false,
          code: "db",
          icon: "table-columns",
        },
        {
          id: 2,
          moduleName: "Ticket Releasing",
          path: "/ticket",
          isActive: false,
          code: "tr",
          icon: "ticket",
        },
        {
          id: 3,
          moduleName: "Counter",
          path: "/counter",
          isActive: false,
          code: "ct",
          icon: "user-tie",
        },
      ],
    };
  },

  methods: {
    collapseSidebar() {
      this.barIsClicked = !this.barIsClicked;
      this.$store.commit("dashboard/triggerClick");
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
  },

  mounted() {
    if (!localStorage.activeMenu) {
      localStorage.activeMenu = "db";
      localStorage.activePath = "/dashboard";
    }
    this.setActiveModule(localStorage.activeMenu);
  },
};
</script>

<style lang="scss" scoped>
.sideBar_collapse {
  position: fixed;
  background: whitesmoke;
  left: 0;
  top: 0;
  bottom: 0;
  transition: 0.1s ease;
  width: 60px;

  &__bars {
    position: absolute;
    cursor: pointer;
    top: 30px;
    left: 20px;
  }

  &__brand {
    font-size: 20px;
  }

  &__text {
    font-size: 18px;
  }
}

.sideBar {
  position: fixed;
  background: whitesmoke;
  left: 0;
  top: 0;
  bottom: 0;
  transition: 0.1s ease;
  width: 250px;

  &__bars {
    position: absolute;
    cursor: pointer;
    top: 20px;
    left: 20px;
  }

  &__brand {
    font-size: 20px;
  }

  &__text {
    font-size: 18px;
  }
}

ul {
  list-style-type: none;
  margin-top: 20px;
}
li {
  padding: 20px;
  font-size: 14px;
  margin-bottom: 10px;
  transition: 0.1s ease;

  cursor: pointer;

  &:hover {
    background: rgb(216, 216, 216);
  }
}

.active {
  background: rgb(216, 216, 216);
}
</style>
