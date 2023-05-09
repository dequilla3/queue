<template>
  <div title="Logout">
    <font-awesome-icon
      @click="logout()"
      :class="`logout ${this.mode} ${this.pos} `"
      icon="fa-solid fa-arrow-right-to-bracket"
    />
  </div>
</template>
<script>
export default {
  name: "logout",
  props: {
    mode: String,
    pos: String,
    rotate: Boolean,
  },
  methods: {
    logout() {
      localStorage.role = "";
      this.$router.push({ path: "/" });
    },
  },

  mounted() {
    console.log(this.pos);
  },
};
</script>
<style lang="scss" scoped>
.logout {
  position: absolute;
  font-size: 30px;
  transform: rotate(180deg);
  z-index: 1000;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.5;
  }
}

.light {
  color: white;
}

.dark {
  color: black;
}

.left {
  top: 2%;
  left: 2%;
}

.right {
  top: 3%;
  right: 3%;
}

.left-1 {
  left: 1%;
}
.top-1 {
  top: 1%;
}
</style>
