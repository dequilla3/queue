<template>
  <div>
    <sidebar />
    <timeBomb />
    <div class="admin">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-primary"
      >
        <!-- USER TAB -->
        <b-tab title="ADD USER">
          <div class="mt-3">
            <b-button variant="primary" @click="onAddUser()">
              <font-awesome-icon :icon="['fas', 'user-plus']" />
              Add user
            </b-button>

            <div class="admin__tooltip mt-3">
              <b-form-input
                class="admin__tooltip__input mr-1"
                placeholder="Search . . ."
                v-model="inputSearch"
                @keyup.enter="fetchAllUsers()"
              />
              <b-form-select
                title="Filter bt status"
                class="admin__tooltip__select mr-1"
                v-model="selectedRole"
                :options="optionRole"
                @change="fetchAllUsers()"
              ></b-form-select>
            </div>

            <b-table
              class="admin__table mt-4"
              hover
              :items="userList"
              :fields="userTblFields"
              :per-page="perPage"
              :current-page="currentPage"
            >
              <template #cell(user_role)="row">
                {{ row.item.user_role.toUpperCase() }}
              </template>

              <template #cell(action)="row">
                <b-button
                  size="sm"
                  class="admin__action_btn"
                  variant="success"
                  title="Edit user details"
                  @click="onEditUser(row.item)"
                >
                  <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                </b-button>

                <b-button
                  size="sm"
                  title="Reset Password"
                  class="admin__action_btn"
                  variant="info"
                  @click="onResetPassword(row.item)"
                >
                  <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" />
                </b-button>
              </template>
            </b-table>
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
            ></b-pagination>
          </div>
        </b-tab>

        <!-- PRODUCT TAB -->
        <b-tab title="ADD PRODUCT">
          <div class="mt-3">
            <b-button variant="primary" @click="onAddProduct()">
              <font-awesome-icon :icon="['fas', 'user-plus']" />
              Add Product
            </b-button>

            <div class="admin__tooltip mt-3">
              <b-form-input
                class="admin__tooltip__input mr-1"
                placeholder="Search . . ."
                v-model="inputSearch"
                @keyup.enter="fetchAllProducts()"
              />
            </div>

            <b-table
              class="admin__table mt-4"
              hover
              :items="prodList"
              :fields="prodTblFields"
              :per-page="perPage"
              :current-page="currentPage"
            >
            </b-table>
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
            ></b-pagination>
          </div>
        </b-tab>
      </b-tabs>

      <!-- USER MODAL -->
      <b-modal
        class="userModal"
        id="userModal"
        :title="userModalTitle"
        size="medium"
        no-close-on-backdrop
        hide-footer
        centered
      >
        <b-form @submit="onSaveUser">
          <b-form-group id="input-fname" label="First Name:" label-for="input-fname">
            <b-form-input
              id="input-fname"
              v-model="user.firstName"
              type="text"
              placeholder="Enter first name"
              required
              style="text-transform: uppercase"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-mname" label="Middle Name:" label-for="input-mname">
            <b-form-input
              id="input-mname"
              v-model="user.middleName"
              type="text"
              placeholder="Enter middle name"
              required
              style="text-transform: uppercase"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-lname" label="Last Name:" label-for="input-lname">
            <b-form-input
              id="input-lname"
              v-model="user.lastName"
              type="text"
              placeholder="Enter last name"
              required
              style="text-transform: uppercase"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            v-if="action == 'add'"
            id="input-uname"
            label="Username:"
            label-for="input-uname"
          >
            <b-form-input
              id="input-uname"
              v-model="user.userName"
              type="text"
              placeholder="GENERATED USERNAME"
              required
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group id="select-role" label="Select Role:" label-for="select-role">
            <b-form-select
              id="select-role"
              v-model="user.role"
              :options="optionRole"
              required
            />
          </b-form-group>

          <hr class="mt-4" />
          <div class="w-100">
            <b-button variant="primary" class="float-right ml-1" type="submit">
              <font-awesome-icon :icon="['fas', 'floppy-disk']" /> Save User
              <b-spinner small v-show="loadingOnSave" />
            </b-button>
            <b-button @click="$bvModal.hide('userModal')" class="float-right">
              <font-awesome-icon :icon="['fas', 'xmark']" /> Cancel
            </b-button>
          </div>
        </b-form>
      </b-modal>

      <!-- PRODUCT MODAL -->
      <b-modal
        class="prodModal"
        id="prodModal"
        :title="userModalTitle"
        size="sm"
        no-close-on-backdrop
        hide-footer
        centered
      >
        <b-form @submit="onSaveProd">
          <b-form-group
            id="input-prodName"
            label="Product Name:"
            label-for="input-prodName"
          >
            <b-form-input
              id="input-prodName"
              v-model="prodName"
              type="text"
              placeholder="Enter product name"
              required
              style="text-transform: uppercase"
            ></b-form-input>
          </b-form-group>

          <hr class="mt-4" />
          <div class="w-100">
            <b-button size="sm" variant="primary" class="float-right ml-1" type="submit">
              <font-awesome-icon :icon="['fas', 'plus']" /> Add Product
              <b-spinner small v-show="loadingOnSave" />
            </b-button>
            <b-button size="sm" @click="$bvModal.hide('prodModal')" class="float-right">
              <font-awesome-icon :icon="['fas', 'xmark']" /> Cancel
            </b-button>
          </div>
        </b-form>
      </b-modal>
    </div>

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
import sidebar from "../components/sidebar.vue";
import axios from "axios";

export default {
  name: "admin",
  components: {
    sidebar,
  },
  data() {
    return {
      inputSearch: "",
      perPage: 8,
      currentPage: 1,

      loadingOnSave: false,
      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: "",
      },

      user: {
        firstName: "",
        middleName: "",
        lastName: "",
        userName: "",
        role: null,
      },

      prodName: "",

      action: "",
      userModalTitle: "",
      selectedRole: "",
      optionRole: [
        { value: "", text: "ALL" },
        { value: "admin", text: "ADMIN" },
        { value: "dashboard", text: "DASHBOARD" },
        { value: "guard", text: "GUARD" },
        { value: "w1", text: "WINDOW 1" },
        { value: "w2", text: "WINDOW 2" },
        { value: "w3", text: "WINDOW 3" },
        { value: "w4", text: "WINDOW 4" },
        { value: "w5", text: "WINDOW 5" },
      ],

      userList: [],
      userTblFields: [
        { key: "firstname", label: "First Name" },
        { key: "middlename", label: "Middle Name" },
        { key: "lastname", label: "Last Name" },
        { key: "username", label: "Username" },
        { key: "user_role", label: "User Role" },
        { key: "action", label: "Actions" },
      ],

      prodList: [],
      prodTblFields: [{ key: "prod_name", label: "Product Name" }],
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

    onAddProduct() {
      this.prodName = "";
      this.$bvModal.show("prodModal");
    },

    onAddUser() {
      this.user = {
        firstName: "",
        middleName: "",
        lastName: "",
        role: "",
      };

      this.userModalTitle = "Add new user";
      this.$bvModal.show("userModal");
      this.action = "add";
    },

    onEditUser(item) {
      this.user = {
        userId: item.user_id,
        firstName: item.firstname,
        middleName: item.middlename,
        lastName: item.lastname,
        userName: item.username,
        role: item.user_role,
      };

      this.userModalTitle = "Edit user details";
      this.$bvModal.show("userModal");
      this.action = "edit";
    },

    onResetPassword(item) {
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to Reset user password?", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          centered: true,
        })
        .then((value) => {
          if (value) this.doResetUserPassword(item);
        })
        .catch((err) => {
          this.loadingOnSave = false;
          this.showAlert(err, "danger");
        });
    },
    async doResetUserPassword(item) {
      await axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/user/resetUser/${item.user_id}`,
        data: {
          username: item.username,
        },
      }).then(
        (res) => {
          this.showAlert("Password reset successfully.", "success");
        },
        (err) => {
          this.showAlert(err.response.data.errorMsg, "danger");
        }
      );
    },

    onSaveUser(e) {
      e.preventDefault();
      this.loadingOnSave = true;

      this.$bvModal
        .msgBoxConfirm("Are you sure you want to Save user details?", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "primary",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          centered: true,
        })
        .then((value) => {
          if (value) this.doSaveUser();
          this.loadingOnSave = false;
        })
        .catch((err) => {
          this.loadingOnSave = false;
          this.showAlert(err, "danger");
        });
    },

    async doSaveUser() {
      const isAdd = this.action == "add";
      const data = isAdd
        ? {
            firstName: this.user.firstName,
            middleName: this.user.middleName,
            lastName: this.user.lastName,
            username: this.user.userName.toLowerCase(),
            user_password: this.user.userName.toLowerCase(), //by default password same as username
            user_role: this.user.role,
          }
        : {
            firstName: this.user.firstName,
            middleName: this.user.middleName,
            lastName: this.user.lastName,
            user_role: this.user.role,
          };

      await axios({
        method: `${isAdd ? "POST" : "PUT"}`,
        url: `${this.$axios.defaults.baseURL}/user/${
          isAdd ? "addNewUser" : `updateUser/${this.user.userId}`
        }`,
        data,
      }).then(
        () => {
          this.user = {
            firstName: "",
            middleName: "",
            lastName: "",
            userName: "",
            role: "",
          };
          this.$bvModal.hide("userModal");
          this.showAlert(
            `Successfully ${this.action == "add" ? "added" : "updated"} user.`,
            "success"
          );

          this.loadingOnSave = false;
          this.fetchAllUsers();
        },
        (err) => {
          this.showAlert(err.response.data.errorMsg, "danger");
        }
      );
    },

    onSaveProd(e) {
      e.preventDefault();
      this.loadingOnSave = true;

      this.$bvModal
        .msgBoxConfirm("Are you sure you want to Save product?", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "primary",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          centered: true,
        })
        .then((value) => {
          if (value) this.doSaveProd();
          this.loadingOnSave = false;
        })
        .catch((err) => {
          this.loadingOnSave = false;
          this.showAlert(err, "danger");
        });
    },

    async doSaveProd() {
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/product/addProduct`,
        data: {
          prod_name: this.prodName,
          retail_amt: 0.0,
        },
      }).then(
        () => {
          this.prodName = "";
          this.$bvModal.hide("prodModal");
          this.showAlert(`Successfully added product.`, "success");

          this.loadingOnSave = false;
          this.fetchAllProducts();
        },
        (err) => {
          this.showAlert(err.response.data.errorMsg, "danger");
        }
      );
    },

    generateUserName() {
      const firstNameSplit = this.user.firstName.split(" ");
      let firstChar = "";

      firstNameSplit.forEach(function (val) {
        firstChar += val.charAt(0);
      });

      this.user.userName = firstChar + this.user.lastName;
    },

    async fetchAllUsers() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/user/getAllUser`,
      }).then(
        (res) => {
          this.userList = res.data.filter(
            function (val) {
              return (
                (val.firstname.includes(this.inputSearch) ||
                  val.middlename.includes(this.inputSearch) ||
                  val.username.includes(this.inputSearch) ||
                  val.lastname.includes(this.inputSearch)) &&
                val.user_role.includes(this.selectedRole)
              );
            }.bind(this)
          );
        },
        (err) => {
          this.showAlert(err, "danger");
        }
      );
    },

    async fetchAllProducts() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/product/getAllProduct`,
      }).then(
        (res) => {
          this.prodList = res.data.filter(
            function (val) {
              return val.prod_name.includes(this.inputSearch);
            }.bind(this)
          );
        },
        (err) => {
          this.showAlert(err, "danger");
        }
      );
    },
  },

  watch: {
    "user.firstName": function () {
      this.generateUserName();
    },
    "user.lastName": function () {
      this.generateUserName();
    },
  },

  created() {
    this.fetchAllUsers();
    this.fetchAllProducts();
  },

  beforeDestroy() {},

  mounted() {},

  computed: {
    rows() {
      return this.userList.length;
    },
  },
};
</script>
<style lang="scss">
.admin {
  height: 80vh;
  padding: 32px 56px;
  margin: 64px 44px 64px 124px;
  box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);
  -webkit-box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);
  -moz-box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);

  &__table {
    font-size: 12px !important;
  }

  &__tooltip {
    display: flex;
    width: 100%;
    height: 32px;

    &__input {
      width: 40%;
      height: 100%;
    }

    &__select {
      width: 15%;
      height: 100%;
      cursor: pointer;
    }
    &__date {
      width: 20%;
      border-radius: 4px;
      border: 2px solid #ced4da;
      outline: none;
    }
  }
}
</style>
