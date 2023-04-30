<template>
  <div class="login">
    <p class="login__header-text">
      <img src="../assets/img/logo.png" class="logo" /> PCIC Systems
    </p>
    <b-form class="login__form" @submit="userLogin">
      <b-form-input required class="mb-2" placeholder="Username"></b-form-input>
      <b-form-input required class="mb-4" placeholder="Password"></b-form-input>
      <b-button type="submit" class="login__form__btn" variant="primary"
        >Login <font-awesome-icon icon="fa-solid fa-arrow-right"
      /></b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "IndexPage",

  methods: {
    userLogin(e) {
      e.preventDefault();
      this.$router.push({ path: "/dashboard" });
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("@fontsource/poppins");
* {
  font-family: "Poppins";
}

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
