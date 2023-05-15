<template>
  <div>
    <div class="login">
      <p class="login__header-text mb-5">
        <img src="../assets/img/logo.png" class="logo" alt="" /> PCIC XI
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

        <b-button
          type="submit"
          class="login__form__btn"
          variant="primary"
          :disabled="isLoading"
        >
          Login
          <font-awesome-icon icon="fa-solid fa-arrow-right" v-show="!isLoading" />
          <b-spinner small v-show="isLoading" />
        </b-button>
      </b-form>

      <!-- newpw -->
      <b-modal
        id="changePwModal"
        class="changePwModal"
        size="medium"
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
        hide-footer
        centered
      >
        <template #modal-title>
          <p class="font-weight-bold">
            First login attempt, please update your password
            <font-awesome-icon :icon="['fas', 'face-laugh']" />
          </p>
        </template>

        <b-form @submit="updatePassword">
          <b-form-group id="input-newpw" label="Password:" label-for="input-newpw">
            <b-form-input
              id="input-newpw"
              v-model="newPw"
              type="password"
              placeholder=""
              required
              style="text-transform: uppercase"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-confpw"
            label="Confirm Password:"
            label-for="input-confpw"
          >
            <b-form-input
              id="input-confpw"
              v-model="confirmNewPw"
              type="password"
              placeholder=""
              required
              style="text-transform: uppercase"
            ></b-form-input>
          </b-form-group>

          <!-- footer -->
          <hr class="mt-4" />
          <div class="w-100">
            <b-button
              :disabled="!confirmPassword"
              size="sm"
              variant="primary"
              class="float-right ml-1"
              type="submit"
            >
              <font-awesome-icon :icon="['fas', 'key']" v-show="!isLoading" />
              Update password
              <b-spinner small v-show="isLoading" />
            </b-button>
          </div>
        </b-form>
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
    <div class="polygon" />
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "IndexPage",

  data() {
    return {
      resLogin: "",
      isLoading: false,
      uName: "",
      pw: "",

      newPw: "",
      confirmNewPw: "",

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

    async userLogin(e) {
      e.preventDefault();

      this.isLoading = true;

      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/user/authenticate`,
        data: {
          username: this.uName,
          user_password: this.pw,
        },
      }).then(
        (res) => {
          const results = res.data.result.results;

          if (results.username == results.user_password) {
            this.isLoading = false;
            this.resLogin = results;
            this.$bvModal.show("changePwModal");
          } else {
            this.proceedLogin(results);
          }
        },
        (err) => {
          this.isLoading = false;
          if (err.response) {
            this.showAlert(err.response.data.errorMsg, "danger");
          } else {
            this.showAlert(err, "danger");
          }
        }
      );
    },

    proceedLogin(results) {
      this.isLoading = false;

      let role = results.user_role;
      localStorage.role = role;

      this.$nextTick(() => {
        switch (role) {
          case "guard":
            this.$router.push({ path: "/releaseticket" });
            break;

          case "dashboard":
            this.$router.push({ path: "/dashboard" });
            break;

          case "admin":
            this.$router.push({ path: "/admin" });
            localStorage.activeMenu = "admin";
            localStorage.activePath = "/admin"; //if page uses sidebar add store activePath
            break;

          default:
            this.$router.push({ path: "/counter" });
            localStorage.activeMenu = "counter";
            localStorage.activePath = "/counter";
            break;
        }
      });
    },

    async updatePassword(e) {
      e.preventDefault();
      this.isLoading = true;
      await axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/user/resetUser/${this.resLogin.user_id}`,
        data: {
          newPassword: this.newPw,
        },
      }).then(
        (res) => {
          this.afterUpdatePassword();
        },
        (err) => {
          this.showAlert(err, "danger");
        }
      );
    },

    afterUpdatePassword() {
      this.$bvModal
        .msgBoxOk("Password reset successfully", {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.$bvModal.hide("changePwModal");
            this.isLoading = false;
            this.pw = "";
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
  },

  mounted() {
    localStorage.role = "";
  },

  computed: {
    getUsers() {
      return this.$store.state.user.users;
    },

    confirmPassword() {
      return (
        this.newPw == this.confirmNewPw &&
        this.newPw != "" &&
        this.confirmNewPw != "" &&
        this.newPw != this.resLogin.user_password
      );
    },
  },
};
</script>

<style lang="scss" scoped>
$x: 35%;
$y: 10%;

.logo {
  width: 30px;
  height: 30px;
}
.login {
  background: white;
  z-index: 1;
  padding: 60px 60px 150px 60px;
  margin-left: $x;
  margin-right: $x;
  margin-top: $y;
  margin-bottom: $y;
  box-shadow: 0px 0px 115px -25px rgba(0, 0, 0, 0.46);
  -webkit-box-shadow: 0px 0px 115px -25px rgba(0, 0, 0, 0.46);
  -moz-box-shadow: 0px 0px 115px -25px rgba(0, 0, 0, 0.46);
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

.polygon {
  // clip-path: polygon(100% 0, 0 44%, 100% 100%);
  clip-path: polygon(0 0, 100% 100%, 100% 0); // position: absolute;
  top: 0%;
  right: 0%;
  background: green;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: -1000;
  opacity: 0.7;
}
</style>
