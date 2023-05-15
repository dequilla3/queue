<template>
  <div>
    <sidebar />
    <div class="dataentry">
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
        sticky-header
        hover
        :items="arEntries"
        :fields="arEntriesTblFields"
      >
        <template #cell(dateTrans)="row">
          {{ row.item.dateTrans.toLocaleDateString() }}
        </template>

        <template #cell(action)="row">
          <b-button
            class="mb-1"
            variant="success"
            v-show="row.item.docstatus == 'DR'"
            title="Process Transaction"
          >
            Process
            <font-awesome-icon icon="fa-solid fa-cogs" />
          </b-button>
          <b-button class="mb-1" title="View full details" variant="info">
            View
            <font-awesome-icon icon="fa-solid fa-eye" />
          </b-button>
        </template>
      </b-table>
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
          <b-form @submit="">
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
                placeholder="Enter payor full name"
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
            <div v-if="newTransModalForm.selectedPaymentType == 'check'">
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
          <b-button variant="primary" class="float-right ml-1">
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
      no-close-on-backdrop
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
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import moment from "moment";

export default {
  components: {
    sidebar,
  },

  data() {
    return {
      arEntries: [
        {
          id: 1,
          docnum: "001",
          docstatus: "DR",
          payor: "John Doe",
          transType: "CASH",
          collectingOfficer: "Juan Dela Cruz",
          checkDetails: { draweeBank: "", number: "", date: "" },
          prodLine: [{ id: 1, prodName: "RICE", amount: 2000 }],
          totalAmt: 2000,
          dateTrans: new Date(),
        },
      ],

      arEntriesTblFields: [
        { key: "docnum", label: "Document No." },
        { key: "docstatus", label: "Status" },
        { key: "payor", label: "Payor" },
        { key: "transType", label: "Transaction Type" },
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
        selectedPaymentType: "cash",
        paymentTypeOptions: [
          { text: "CASH", value: "cash" },
          { text: "CHECK", value: "check" },
        ],
        draweeBank: "",
        number: "",
        dateCheck: "",
      },

      newReceiptSelectedProd: [],
      newReceiptTbleFields: [
        { key: "prodName", label: "Product Name" },
        { key: "amount", label: "Amount" },
        { key: "action", label: "Actions" },
      ],

      insertProductModalData: {
        products: [{ prodId: 1, prodName: "RICE" }],
        insertProdFields: [
          { key: "prodName", label: "Product Name" },
          { key: "actions", label: "Action" },
        ],
        searchProd: "",
      },
    };
  },

  methods: {
    onNewTrans() {
      this.$bvModal.show("newTransModal");
    },

    insertProduct(item) {
      this.newReceiptSelectedProd.push({
        prodId: item.prodId,
        prodName: item.prodName,
        amount: 0.0,
      });
      this.insertProductModalData.products.splice(item, 1);
    },

    removeSelectedProduct(item) {
      this.newReceiptSelectedProd.splice(item, 1);
    },
  },

  created() {},
  computed: {
    getBarIsClicked() {
      return this.$store.state.dashboard.barIsClicked;
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
