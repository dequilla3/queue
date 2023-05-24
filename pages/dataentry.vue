<template>
  <div>
    <div class="dontPrint">
      <sidebar />
      <div class="dataentry">
        <b-overlay :show="isLoading" rounded="sm" no-wrap />
        <h5 class="font-weight-bold">ACKNOWLEDGEMENT RECEIPT</h5>
        <br />
        <b-button class="shadow" variant="primary" @click="onNewTrans()">
          <font-awesome-icon icon="fa-solid fa-plus" />
          New Receipt
        </b-button>

        <div class="dataentry__tooltip mt-3">
          <b-form-input
            class="dataentry__tooltip__input mr-1"
            placeholder="Search . . ."
            v-model="inpSrchEntries"
            @keyup="setArEntries()"
          />
          <b-form-select
            title="Filter by payment type"
            class="dataentry__tooltip__select mr-1"
            v-model="selectedPmtType"
            :options="optionPaymentTypes"
            @change="setArEntries()"
          />
          <b-form-select
            title="Filter by status"
            class="dataentry__tooltip__select mr-1"
            v-model="selectedStatus"
            :options="optionStatus"
            @change="setArEntries()"
          />

          <b-form-datepicker
            class="dataentry__tooltip__date mr-1"
            v-model="dateFrom"
            locale="en"
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          />

          <label class="pt-2 mr-1">
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </label>

          <b-form-datepicker
            class="dataentry__tooltip__date mr-1"
            v-model="dateTo"
            locale="en"
            :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          />
          <b-button title="Filter transaction list" @click="setArEntries()">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          </b-button>
        </div>

        <b-table
          class="table-style mt-4"
          hover
          :items="arEntries"
          :fields="arEntriesTblFields"
          :per-page="perPage"
          :current-page="currentPage"
          head-variant="light"
        >
          <template #cell(docnum)="row">
            <b>{{ row.item.docnum }}</b>
          </template>
          <template #cell(dateTrans)="row">
            {{ row.item.dateTrans }}
          </template>

          <template #cell(action)="row">
            <b-button
              class="mb-1 rounded-circle shadow"
              variant="success"
              v-if="row.item.docstatus == 'DR'"
              title="Process Transaction"
              size="sm"
              @click="process(row.item)"
            >
              <font-awesome-icon icon="fa-solid fa-cogs" />
            </b-button>

            <b-button
              size="sm"
              class="mb-1 rounded-circle shadow"
              title="View full details"
              variant="info"
            >
              <font-awesome-icon icon="fa-solid fa-eye" />
            </b-button>

            <b-button
              size="sm"
              class="mb-1 rounded-circle shadow"
              title="Print transaction"
              variant="dark"
              v-if="row.item.docstatus == 'PR'"
              @click="doPrintReceipt(row.item.id)"
            >
              <font-awesome-icon icon="fa-solid fa-print" />
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
                  class="text-uppercase"
                  id="input-seriesno"
                  v-model="newTransModalForm.seriesNo"
                  type="text"
                  required
                  disabled
                ></b-form-input>
              </b-form-group>

              <b-form-group id="payor-group" label="Payor:" label-for="input-payor">
                <b-form-input
                  class="text-uppercase"
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
                    class="text-uppercase"
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
            <b-button @click="onInsertProduct()" class="mb-1" variant="primary" size="sm">
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
            <b-button @click="onSaveReceipt()" variant="primary" class="float-right ml-1">
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
          @keyup="filterProducList()"
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
            >
              Close
              <font-awesome-icon :icon="['fas', 'close']" />
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
    <acknowledgementReceipt
      class="print"
      ref="ar"
      :docno="this.receiptData.docno"
      :productLine="this.receiptData.productLine"
      :payor="this.receiptData.payor"
      :colOfficer="this.receiptData.colOfficer"
      :selectedPaymentType="this.receiptData.selectedPaymentType"
      :draweeBank="this.receiptData.draweeBank"
      :number="this.receiptData.number"
      :dateCheck="this.receiptData.dateCheck"
      :dateTrans="this.receiptData.dateTrans"
    />
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import axios from "axios";
import acknowledgementReceipt from "../components/Report/acknowledgementReceipt.vue";

export default {
  components: {
    sidebar,
    acknowledgementReceipt,
  },

  data() {
    return {
      inpSrchEntries: "",
      receiptData: {
        docno: "",
        productLine: [],
        payor: "",
        colOfficer: "",
        selectedPaymentType: "",
        dateTrans: "",
      },

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
        { key: "bank", label: "Drawee Bank" },
        { key: "checkNo", label: "Check No" },
        { key: "checkDate", label: "Check Date" },
        { key: "collectingOfficer", label: "Collecting Officer" },
        { key: "totalAmt", label: "Total Amount" },
        { key: "dateTrans", label: "Date Transaction" },
        { key: "action", label: "Actions" },
      ],

      selectedStatus: "dr",
      optionStatus: [
        { value: "", text: "ALL" },
        { value: "dr", text: "DR" },
        { value: "pr", text: "PR" },
      ],

      selectedPmtType: "CASH",
      optionPaymentTypes: [
        { value: "", text: "ALL" },
        { value: "CASH", text: "CASH" },
        { value: "CHECK", text: "CHECK" },
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
    getRoundOff(num) {
      return (Math.round(num * 100) / 100).toFixed(2);
    },
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
      const trans = this.getAllTransaction.transHeader
        ? this.getAllTransaction.transHeader
        : [];
      const seriesNo = trans.filter(function (val) {
        return val.transaction_status == "PR";
      }).length;

      this.newTransModalForm.seriesNo = String(seriesNo + 1).padStart(6, "0");
      return String(seriesNo + 1).padStart(6, "0");
    },

    onSaveReceipt() {
      if (!this.isLoading) this.doSaveDraftReceipt();
    },

    async doSaveDraftReceipt() {
      this.isLoading = true;
      //init header
      const trans_header = {
        payor: this.newTransModalForm.payorName.toUpperCase(),
        amount: this.getTotalAmount,
        payment_type: this.newTransModalForm.selectedPaymentType,
        check_no: this.newTransModalForm.number.toUpperCase(),
        transaction_date: new Date().toLocaleDateString(),
        user_id: localStorage.user_id,
        check_date: this.newTransModalForm.dateCheck,
        bank_code: this.newTransModalForm.draweeBank,
      };

      //init transline
      let trans_line = [];
      this.newReceiptSelectedProd.forEach(
        function (val) {
          trans_line.push({
            product_id: val.prodId,
            quantity: 1,
            amount: val.amount,
          });
        }.bind(this)
      );

      //save here
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/transaction/draftTransaction`,
        data: {
          trans_header,
          trans_line,
        },
      }).then(
        (res) => {
          this.isLoading = false;
          this.showAlert("Successfully saved draft.", "success");
          this.$bvModal.hide("newTransModal");

          //customize modal dialog message
          const h = this.$createElement;
          const messageVNode = h("div", { class: ["foobar"] }, [
            h("p", { class: ["text-left"] }, [
              "Transaction successfully saved as draft with Document No.: ",
              h("strong", `${res.data.trans_header[0].transaction_code}`),
              " would you like to process transaction? ",
            ]),
          ]);

          //msgbox process confirmation
          this.fetchAllTransaction().then(() => {
            this.setArEntries();
            this.$bvModal
              .msgBoxConfirm([messageVNode], {
                title: "Successful",
                size: "lg",
                buttonSize: "lg",
                okVariant: "success",
                okTitle: "YES",
                cancelTitle: "NO",
                footerClass: "p-2",
                hideHeaderClose: false,
              })
              .then((value) => {
                if (value) {
                  this.isLoading = true;
                  this.doProecss(res.data.trans_header[0].transaction_id);
                }
              })
              .catch((err) => {
                // An error occurred
              });
          });
        },
        (err) => {
          this.showAlert(err.response ? err.response.data.errorMsg : err, "danger");
          this.isLoading = false;
        }
      );
    },

    async fetchAllTransaction() {
      return this.$store.dispatch("dataentry/getAllTransaction");
    },

    fetchAllUsers() {
      return this.$store.dispatch("user/getAllUsers");
    },

    fetchProducts() {
      return this.$store.dispatch("dataentry/getAllProducts");
    },

    setArEntries() {
      //reset entries
      this.arEntries = [];
      //init all transaction
      const trans = this.getAllTransHeader;
      //set temporary list
      let tmpArList = [];

      trans.forEach(
        function (val) {
          tmpArList.push({
            id: val.transaction_id,
            docnum: val.transaction_code,
            docstatus: val.transaction_status ? val.transaction_status : "",
            payor: val.payor,
            transType: val.payment_type ? val.payment_type : "",
            bank: val.bank_code,
            checkNo: val.check_no,
            checkDate: !val.check_date
              ? ""
              : new Date(val.check_date).toLocaleDateString(),
            collectingOfficer: `${this.getUser[0].firstname} ${this.getUser[0].lastname}`,
            totalAmt: val.amount_total,
            dateTrans: new Date(val.transaction_date).toLocaleDateString(),
          });
        }.bind(this)
      );
      this.filterArEntries(tmpArList);
    },

    filterArEntries(arr) {
      this.arEntries = arr.filter(
        function (val) {
          return (
            val.payor.toLowerCase().includes(this.inpSrchEntries.toLowerCase()) &&
            val.docstatus.toLowerCase().includes(this.selectedStatus.toLowerCase()) &&
            val.transType.toLowerCase().includes(this.selectedPmtType.toLowerCase()) &&
            this.isArEntriesBetweenDates(val)
          );
        }.bind(this)
      );
    },

    isArEntriesBetweenDates(val) {
      if (this.dateFrom != "" && this.dateTo != "") {
        const dateFrom = new Date(new Date(this.dateFrom).toLocaleDateString()).getTime();
        const dateTo = new Date(new Date(this.dateTo).toLocaleDateString()).getTime();
        const dateTrans = new Date(val.dateTrans).getTime();

        console.log("DateFrom: " + dateFrom);
        console.log("DateTo: " + dateTo);
        console.log("DateTrans: " + dateTrans);
        console.log(dateTrans > dateFrom);
        console.log(dateTrans < dateTo);

        return dateTrans >= dateFrom && dateTrans <= dateTo;
      }

      return true;
    },

    process(item) {
      this.fetchAllTransaction().then(() => {
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
          })
          .then((value) => {
            if (value) {
              this.isLoading = true;
              this.doProecss(item.id);
            }
          })
          .catch((err) => {
            // An error occurred
          });
      });
    },

    async doProecss(transId) {
      //do post process here
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/transaction/processTransaction`,
        data: {
          trans_id: transId,
          transCodePR: `PR${this.getSeriesNo()}`,
        },
      }).then(
        () => {
          //init result
          this.isLoading = false;
          this.showAlert("Successfully processed transaction.", "success");

          this.fetchAllTransaction().then(() => {
            setTimeout(() => {
              this.setArEntries();
              this.doPrintReceipt(transId);
            }, 1000);
          });
        },
        (err) => {
          this.isLoading = false;
          this.showAlert(err, "danger");
          console.log(err.response);
        }
      );
    },

    doPrintReceipt(id) {
      this.isLoading = true;
      const item = this.getTransHeadById(id);

      let productLine = [];
      this.getLinesById(item.transaction_id).forEach(
        function (val) {
          productLine.push({
            prodName: this.getProductById(val.product_id).prodName.toUpperCase(),
            price: val.amount,
            class: "bb1", //for report css class border bottom 1px
          });
        }.bind(this)
      );

      //set receipt details
      const user = this.getUserById(item.user_id);
      const tmpColOfficer = `${user.firstname} ${user.lastname}`;

      this.receiptData = {
        docno: item.transaction_code,
        productLine,
        payor: item.payor.toUpperCase(),
        colOfficer: tmpColOfficer.toUpperCase(),
        selectedPaymentType: item.payment_type.toUpperCase(),
        draweeBank: item.bank_code.toUpperCase(),
        number: item.check_no.toUpperCase(),
        dateCheck: item.check_date ? new Date(item.check_date).toLocaleDateString() : "",
        dateTrans: item.transaction_date
          ? new Date(item.transaction_date).toLocaleDateString()
          : "",
      };

      //trigger print dialog
      setTimeout(() => {
        // this will render product lines in receipt
        this.triggerPopulateReceipttRows();
        this.$nextTick(() => {
          window.print();
          this.isLoading = false;
        });
      }, 1000);
    },

    triggerPopulateReceipttRows() {
      this.$refs.ar.fillInBlank();
    },

    getUserById(id) {
      return this.getAllUsers.filter(function (val) {
        return val.user_id == id;
      })[0];
    },

    getTransHeadById(id) {
      return this.getAllTransHeader.filter(function (val) {
        return val.transaction_id == id;
      })[0];
    },

    getLinesById(id) {
      const transLine = this.getAllTransaction.transLine;

      const transLinesById = transLine.filter(function (val) {
        return val.transaction_id == id;
      });

      if (this.getAllTransaction) {
        return transLine ? transLinesById : [];
      } else {
        return [];
      }
    },

    getProductById(id) {
      return this.getAllProducts.filter(function (val) {
        return val.prodId == id;
      })[0];
    },

    filterProducList() {
      this.insertProductModalData.products = this.getAllProducts.filter(
        function (val) {
          return val.prodName
            .toLowerCase()
            .includes(this.insertProductModalData.searchProd.toLowerCase());
        }.bind(this)
      );
    },

    onInsertProduct() {
      this.fetchProducts();
      this.$bvModal.show("insertProdModal");
    },
  },

  created() {
    this.fetchProducts();
    this.fetchAllTransaction().then(() => {
      this.fetchAllUsers().then(() => {
        this.setArEntries();
      });
    });
  },

  beforeDestroy() {},

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

    getAllTransHeader() {
      if (this.getAllTransaction) {
        const transHeader = this.getAllTransaction.transHeader;
        return transHeader ? transHeader : [];
      } else {
        return [];
      }
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
