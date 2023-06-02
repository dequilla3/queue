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
      this.showMsgBoxConfirmation();
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
            //clear storage  except dashboard running text
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

  mounted() {},
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
