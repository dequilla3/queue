<template>
  <div>
    <sidebar />
    <div class="dataentry">
      <b-overlay :show="isLoading" rounded="sm" no-wrap />
      <h5 class="font-weight-bold">ACKNOWLEDGEMENT RECEIPT</h5>
      <br />
      <b-button variant="primary" @click="onNewTrans()">
        <font-awesome-icon icon="fa-solid fa-plus" />
        New Receipt
      </b-button>

      <div class="dataentry__tooltip mt-3">
        <b-form-input class="dataentry__tooltip__input mr-1" placeholder="Search . . ." />
        <b-form-select
          title="Filter bt status"
          class="dataentry__tooltip__select mr-1"
          v-model="selectedStatus"
          :options="optionStatus"
        />

        <b-form-datepicker
          class="dataentry__tooltip__date mr-1"
          v-model="dateFrom"
          locale="en"
        />

        <label class="pt-2 mr-1">
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </label>

        <b-form-datepicker
          class="dataentry__tooltip__date mr-1"
          v-model="dateTo"
          locale="en"
        ></b-form-datepicker>
        <b-button> <font-awesome-icon :icon="['fas', 'magnifying-glass']" /></b-button>
      </div>

      <b-table
        class="dataentry__table mt-4"
        hover
        :items="arEntries"
        :fields="arEntriesTblFields"
        :per-page="perPage"
        :current-page="currentPage"
      >
        <template #cell(dateTrans)="row">
          {{ row.item.dateTrans }}
        </template>

        <template #cell(action)="row">
          <b-button
            class="mb-1"
            variant="success"
            v-show="row.item.docstatus == 'DR'"
            title="Process Transaction"
            size="sm"
            @click="process(row.item)"
          >
            Process
            <font-awesome-icon icon="fa-solid fa-cogs" />
          </b-button>
          <b-button size="sm" class="mb-1" title="View full details" variant="info">
            View
            <font-awesome-icon icon="fa-solid fa-eye" />
          </b-button>
        </template>
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
      ></b-pagination>
    </div>

    <b-modal
      class="newTransModal"
      id="newTransModal"
      title="New receipt"
      size="huge"
      no-close-on-backdrop
    >
      <div class="newTransModal__container">
        <div class="newTransModal__form">
          <b-form>
            <b-form-group
              id="seriesno-group"
              label="Series No.:"
              label-for="input-seriesno"
            >
              <b-form-input
                id="input-seriesno"
                v-model="newTransModalForm.seriesNo"
                type="text"
                required
                disabled
              ></b-form-input>
            </b-form-group>

            <b-form-group id="payor-group" label="Payor:" label-for="input-payor">
              <b-form-input
                id="input-payor"
                v-model="newTransModalForm.payorName"
                type="text"
                placeholder="Enter payor name"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Payment type:" v-slot="{ ariaDescribedby }">
              <b-form-radio-group
                v-model="newTransModalForm.selectedPaymentType"
                :options="newTransModalForm.paymentTypeOptions"
                :aria-describedby="ariaDescribedby"
                name="radio-inline"
                size="lg"
                plain
              ></b-form-radio-group>
            </b-form-group>

            <div v-if="newTransModalForm.selectedPaymentType == 'CHECK'">
              <b-form-group
                id="drawee-group"
                label="Drawee Bank:"
                label-for="input-drawee"
              >
                <b-form-input
                  id="input-drawee"
                  v-model="newTransModalForm.draweeBank"
                  type="text"
                  placeholder="Enter drawee bank"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group id="number-group" label="Number:" label-for="input-number">
                <b-form-input
                  id="input-number"
                  v-model="newTransModalForm.number"
                  type="text"
                  placeholder="Enter number"
                  required
                ></b-form-input>
              </b-form-group>

              <label for="date-check">Date:</label>
              <b-form-datepicker
                id="date-check"
                v-model="newTransModalForm.dateCheck"
              ></b-form-datepicker>
            </div>
          </b-form>
        </div>
        <div class="newTransModal__line">
          <b-button
            @click="$bvModal.show('insertProdModal')"
            class="mb-1"
            variant="primary"
            size="sm"
          >
            <font-awesome-icon :icon="['fas', 'arrow-down']" />
            Insert Product
          </b-button>
          <b-table
            striped
            hover
            :items="newReceiptSelectedProd"
            :fields="newReceiptTbleFields"
          >
            <template #cell(amount)="row">
              <b-input
                title="insert"
                class="w-25"
                placeholder="0.00"
                type="number"
                v-model="newReceiptSelectedProd[row.index].amount"
              />
            </template>

            <template #cell(action)="row">
              <b-button
                @click="removeSelectedProduct(row.item)"
                title="Remove product from the list"
                variant="danger"
                size="sm"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </b-button>
            </template>
          </b-table>
        </div>
      </div>

      <template #modal-footer>
        <div class="w-100">
          <b-button @click="onsaveReceipt()" variant="primary" class="float-right ml-1">
            <font-awesome-icon :icon="['fas', 'floppy-disk']" /> Save Receipt
          </b-button>
          <b-button @click="$bvModal.hide('newTransModal')" class="float-right">
            <font-awesome-icon :icon="['fas', 'xmark']" /> Close
          </b-button>
        </div>
      </template>
    </b-modal>

    <b-modal
      id="insertProdModal"
      class="insertProdModal"
      title="Insert Product"
      size="medium"
    >
      <b-input
        placeholder="Search . . ."
        size="sm"
        v-model="insertProductModalData.searchProd"
      />
      <b-table
        class="mt-3"
        striped
        hover
        :fields="insertProductModalData.insertProdFields"
        :items="insertProductModalData.products"
        small
      >
        <template #cell(actions)="row">
          <b-button @click="insertProduct(row.item)" size="sm" variant="info"
            ><font-awesome-icon :icon="['fas', 'plus']" />
          </b-button>
        </template>
      </b-table>

      <template #modal-footer>
        <div class="w-100">
          <b-button
            class="float-right"
            @click="$bvModal.hide('insertProdModal')"
            size="sm"
            variant="primary"
          >
            Done
            <font-awesome-icon :icon="['fas', 'check']" />
          </b-button>
        </div>
      </template>
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
</template>

<script>
import sidebar from "../components/sidebar.vue";
import axios from "axios";

export default {
  components: {
    sidebar,
  },

  data() {
    return {
      isLoading: false,
      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: "",
      },

      perPage: 8,
      currentPage: 1,
      arEntries: [],

      arEntriesTblFields: [
        { key: "docnum", label: "Document No." },
        { key: "docstatus", label: "Status" },
        { key: "payor", label: "Payor" },
        { key: "transType", label: "Transaction Type" },
        { key: "checkNo", label: "Check No" },
        { key: "checkDate", label: "Check Date" },
        { key: "collectingOfficer", label: "Collecting Officer" },
        { key: "totalAmt", label: "Total Amount" },
        { key: "dateTrans", label: "Date Transaction" },
        { key: "action", label: "Actions" },
      ],

      selectedStatus: "dr",
      optionStatus: [
        { value: null, text: "ALL" },
        { value: "dr", text: "DR" },
        { value: "pr", text: "PR" },
      ],

      dateFrom: "",
      dateTo: "",

      newTransModalForm: {
        seriesNo: "",
        payorName: "",
        selectedPaymentType: "CASH",
        paymentTypeOptions: [
          { text: "CASH", value: "CASH" },
          { text: "CHECK", value: "CHECK" },
        ],
        draweeBank: "",
        number: "",
        dateCheck: null,
      },

      newReceiptSelectedProd: [],
      newReceiptTbleFields: [
        { key: "prodName", label: "Product Name" },
        { key: "amount", label: "Amount" },
        { key: "action", label: "Actions" },
      ],

      insertProductModalData: {
        products: [],
        insertProdFields: [
          { key: "prodName", label: "Product Name" },
          { key: "actions", label: "Action" },
        ],
        searchProd: "",
      },

      seriesNo: "",
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

    onNewTrans() {
      this.newReceiptSelectedProd = [];
      this.newTransModalForm = {
        seriesNo: "",
        payorName: "",
        selectedPaymentType: "CASH",
        paymentTypeOptions: [
          { text: "CASH", value: "CASH" },
          { text: "CHECK", value: "CHECK" },
        ],
        draweeBank: "",
        number: "",
        dateCheck: null,
      };

      this.$bvModal.show("newTransModal");
      this.getSeriesNo();
      this.setProductList();
    },

    setProductList() {
      let tempProdList = [];
      this.getAllProducts.forEach(
        function (prod) {
          // check if product exists in selected products
          let prodExists =
            this.newReceiptSelectedProd.filter(function (selectedProd) {
              return selectedProd.prodId == prod.prodId;
            }).length > 0;
          // if not exists then push product to product selection list
          if (!prodExists) tempProdList.push(prod);
        }.bind(this)
      );
      this.insertProductModalData.products = tempProdList;
    },

    insertProduct(item) {
      this.newReceiptSelectedProd.push({
        prodId: item.prodId,
        prodName: item.prodName,
        amount: "",
      });
      this.setProductList();
    },

    removeSelectedProduct(item) {
      this.newReceiptSelectedProd.splice(item, 1);
      this.setProductList();
    },

    getSeriesNo() {
      const seriesNo = this.getAllTransaction.transHeader.filter(function (val) {
        return val.transaction_status == "PR";
      }).length;

      this.newTransModalForm.seriesNo = String(seriesNo + 1).padStart(6, "0");
      return String(seriesNo + 1).padStart(6, "0");
    },

    onsaveReceipt() {
      const trans_header = {
        payor: this.newTransModalForm.payorName,
        amount: this.getTotalAmount,
        payment_type: this.newTransModalForm.selectedPaymentType,
        check_no: this.newTransModalForm.number,
        transaction_date: new Date().toLocaleDateString(),
        user_id: localStorage.user_id,
        check_date: this.newTransModalForm.dateCheck,
      };

      let trans_line = [];
      this.newReceiptSelectedProd.forEach(
        function (val) {
          trans_line.push({ product_id: val.prodId, quantity: 1, amount: val.amount });
        }.bind(this)
      );

      axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/transaction/draftTransaction`,
        data: {
          trans_header,
          trans_line,
        },
      }).then(
        (res) => {
          this.showAlert("Successfully saved draft.", "success");
          this.fetchAllTransaction();
          this.$bvModal.hide("newTransModal");
          this.$bvModal
            .msgBoxConfirm(
              `Transaction successfully saved as draft with Document#: ${res.data.trans_header[0].transaction_code} would you like to process transaction?`,
              {
                title: "Information",
                size: "sm",
                buttonSize: "sm",
                okVariant: "success",
                okTitle: "YES",
                cancelTitle: "NO",
                footerClass: "p-2",
                hideHeaderClose: false,
                centered: true,
              }
            )
            .then((value) => {
              if (value) {
                this.isLoading = true;
                setTimeout(() => {
                  this.doProecss(res.data.trans_header[0].transaction_id);
                }, 3000);
              }
            })
            .catch((err) => {
              // An error occurred
            });
        },
        (err) => {
          this.showAlert(err.response ? err.response.data.errorMsg : err, "danger");
        }
      );
    },

    async fetchAllTransaction() {
      this.$store.dispatch("dataentry/getAllTransaction");
    },

    fetchAllUsers() {
      this.$store.dispatch("user/getAllUsers");
    },

    setArEntries() {
      this.arEntries = [];
      const trans = this.getAllTransaction ? this.getAllTransaction.transHeader : [];
      trans.forEach(
        function (val) {
          this.arEntries.push({
            id: val.transaction_id,
            docnum: val.transaction_code,
            docstatus: val.transaction_status,
            payor: val.payor,
            transType: val.payment_type,
            checkNo: val.check_no,
            check_date: val.check_date,
            collectingOfficer: `${this.getUser[0].firstname} ${this.getUser[0].lastname}`,
            totalAmt: val.amount_total,
            dateTrans: val.transaction_date.split("T")[0],
          });
        }.bind(this)
      );
      this.arEntries.reverse();
    },

    process(item) {
      this.fetchAllTransaction();
      this.$bvModal
        .msgBoxConfirm("Are you sure you want to process transcation?", {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "primary",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.isLoading = true;
            setTimeout(() => {
              this.doProecss(item.id);
            }, 3000);
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    async doProecss(transId) {
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/transaction/processTransaction`,
        data: {
          trans_id: transId,
          transCodePR: `PR${this.getSeriesNo()}`,
        },
      }).then(
        (res) => {
          this.isLoading = false;
          this.showAlert("Successfully processed transaction.", "success");
          this.fetchAllTransaction();
        },
        (err) => {
          this.isLoading = false;
          this.showAlert(err, "danger");
          console.log(err.response);
        }
      );
    },
  },

  created() {
    this.fetchAllTransaction();
    this.fetchAllUsers();

    setInterval(() => {
      this.setArEntries();
    }, 1000);
  },

  computed: {
    rows() {
      return this.arEntries.length;
    },

    getBarIsClicked() {
      return this.$store.state.dashboard.barIsClicked;
    },

    getTotalAmount() {
      let total = 0;
      this.newReceiptSelectedProd.forEach(
        function (val) {
          total += Number(val.amount);
        }.bind(this)
      );
      return total;
    },

    getAllProducts() {
      return this.$store.state.dataentry.products;
    },

    getAllTransaction() {
      return this.$store.state.dataentry.transactions;
    },

    getAllUsers() {
      return this.$store.state.user.users;
    },

    getUser() {
      return this.getAllUsers.filter(function (val) {
        return val.user_id == localStorage.user_id;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dataentry {
  height: 80vh;
  padding: 32px 56px;
  margin: 60px 40px 60px 120px;
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

.newTransModal {
  $boxShadow: 0px 0px 18px -3px rgba(0, 0, 0, 0.15);

  &__container {
    display: flex;
  }

  &__form {
    width: 24%;
    margin: 20px;
    padding: 20px;
    box-shadow: $boxShadow;
  }

  &__line {
    width: 100%;
    margin: 20px;
    padding: 20px;
    box-shadow: $boxShadow;
  }
}
</style>
