<template>
  <div class="login">
    <p class="login__header-text">
      <img src="../assets/img/logo.png" class="logo" /> PCIC Systems
    </p>
    <b-form class="login__form" @submit="userLogin">
      <b-form-input
        v-model="uName"
        required
        class="mb-2"
        placeholder="Username"
      ></b-form-input>

      <b-form-input
        v-model="pw"
        required
        class="mb-4"
        placeholder="Password"
        type="password"
      ></b-form-input>

      <b-button type="submit" class="login__form__btn" variant="primary"
        >Login <font-awesome-icon icon="fa-solid fa-arrow-right"
      /></b-button>
    </b-form>

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
export default {
  name: "IndexPage",

  data() {
    return {
      uName: "",
      pw: "",

      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: "",
      },
    };
  },

  methods: {
    showAlert(message, variant) {
      this.alert = {
        showAlert: 5,
        dismissSecs: 2,

        variant,
        message,
      };
    },

    userLogin(e) {
      e.preventDefault();

      let userExists = this.getUsers.filter(
        function (val) {
          return val.uname == this.uName && val.pw == this.pw;
        }.bind(this)
      );

      if (userExists.length > 0) {
        let role = userExists[0].role;
        localStorage.role = role;

        this.$nextTick(() => {
          switch (role) {
            case "guard":
              this.$router.push({ path: "/releaseticket" });
              break;

            case "dashboard":
              this.$router.push({ path: "/dashboard" });
              break;

            default:
              this.$router.push({ path: "/counter" });
              localStorage.activeMenu = "counter";
              localStorage.activePath = "/counter";
              break;
          }
        });
      } else {
        this.showAlert("User doesn't exists!", "danger");
      }
    },
  },

  mounted() {
    localStorage.role = "";
  },

  computed: {
    getUsers() {
      return this.$store.state.user.users;
    },
  },
};
</script>

<style lang="scss" scoped>
$x: 35%;
$y: 15%;

.logo {
  width: 30px;
  height: 30px;
}
.login {
  padding: 40px;
  background: whitesmoke;
  margin-left: $x;
  margin-right: $x;
  margin-top: $y;
  margin-bottom: $y;
  &__header-text {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  &__form {
    margin-left: 10%;
    margin-right: 10%;
    &__btn {
      width: 100%;
    }
  }
}
</style>
