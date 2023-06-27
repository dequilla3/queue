<template>
  <div>
    <div class="dontPrint">
      <timeBomb />
      <sidebar />
      <div class="dataentry">
        <b-overlay :show="isLoading" rounded="sm" no-wrap />
        <h5 class="font-weight-bold">ACKNOWLEDGEMENT RECEIPT</h5>
        <br />
        <b-button class="shadow" variant="primary" @click="openTransModal('NEW')">
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
          <b-button
            variant="primary"
            title="Filter transaction list"
            @click="onFilter()"
            class="mr-1"
          >
            <font-awesome-icon :icon="['fas', 'filter']" />
          </b-button>

          <b-button
            variant="secondary"
            class="mr-1"
            title="Reset filter parameter"
            @click="resetFilterParams()"
          >
            <font-awesome-icon :icon="['fas', 'rotate-right']" />
          </b-button>

          <b-button
            variant="info"
            class="mr-1"
            @click="onPrintReport()"
            v-if="selectedStatus == 'pr'"
            title="Print report"
          >
            <font-awesome-icon :icon="['fas', 'print']" />
          </b-button>

          <b-button
            variant="success"
            @click="exportToExcel()"
            v-if="selectedStatus == 'pr'"
            title="Export to excel"
          >
            <font-awesome-icon :icon="['fas', 'file-excel']" />
          </b-button>
        </div>

        <!-- main table -->
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

          <template #cell(totalAmt)="row">
            &#8369; {{ numberWithCommas(getRoundOff(row.item.totalAmt)) }}
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
              @click="openTransModal('VIEW', row.item.id)"
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

            <b-button
              size="sm"
              class="mb-1 rounded-circle shadow"
              title="Update transaction"
              variant="dark"
              v-if="row.item.docstatus == 'DR'"
              @click="openTransModal('UPDATE', row.item.id)"
            >
              <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            </b-button>

            <b-button
              class="mb-1 rounded-circle shadow"
              variant="warning"
              v-if="row.item.docstatus == 'PR'"
              title="Override Transaction"
              size="sm"
              @click="openTransModal('OVR', row.item.id)"
            >
              <font-awesome-icon :icon="['fas', 'repeat']" />
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
        class="transModal"
        id="transModal"
        :title="transModalTitle"
        size="huge"
        no-close-on-backdrop
      >
        <div class="transModal__container">
          <div class="transModal__form">
            <b-form>
              <b-form-group
                id="seriesno-group"
                label="Series No.:"
                label-for="input-seriesno"
              >
                <b-form-input
                  class="text-uppercase"
                  id="input-seriesno"
                  v-model="transModalForm.seriesNo"
                  type="text"
                  required
                  disabled
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="payor-group"
                label="Payor Name:"
                label-for="input-dateTrans"
              >
                <b-form-input
                  class="text-uppercase"
                  id="input-dateTrans"
                  v-model="transModalForm.payorName"
                  type="text"
                  placeholder="Enter payor name"
                  required
                  :disabled="isActionView"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="date-trans"
                label="Date Transaction:"
                label-for="input-dateTrans"
              >
                <b-form-datepicker
                  required
                  id="date-trans"
                  v-model="transModalForm.dateTrans"
                  :disabled="isActionView"
                ></b-form-datepicker>
              </b-form-group>

              <b-form-group label="Payment type:" v-slot="{ ariaDescribedby }">
                <b-form-radio-group
                  v-model="transModalForm.selectedPaymentType"
                  :options="transModalForm.paymentTypeOptions"
                  :aria-describedby="ariaDescribedby"
                  name="radio-inline"
                  size="lg"
                  plain
                  :disabled="isActionView"
                ></b-form-radio-group>
              </b-form-group>

              <div v-if="transModalForm.selectedPaymentType == 'CHECK'">
                <b-form-group
                  id="drawee-group"
                  label="Drawee Bank:"
                  label-for="input-drawee"
                >
                  <b-form-input
                    class="text-uppercase"
                    id="input-drawee"
                    v-model="transModalForm.draweeBank"
                    type="text"
                    placeholder="Enter drawee bank"
                    required
                    :disabled="isActionView"
                  ></b-form-input>
                </b-form-group>
                <b-form-group id="number-group" label="Number:" label-for="input-number">
                  <b-form-input
                    id="input-number"
                    v-model="transModalForm.number"
                    type="text"
                    placeholder="Enter number"
                    required
                    :disabled="isActionView"
                  ></b-form-input>
                </b-form-group>

                <label for="date-check">Date Check:</label>
                <b-form-datepicker
                  id="date-check"
                  v-model="transModalForm.dateCheck"
                  :disabled="isActionView"
                ></b-form-datepicker>
              </div>
            </b-form>
          </div>
          <div class="transModal__line">
            <b-button
              @click="onInsertProduct()"
              class="mb-1"
              variant="primary"
              size="sm"
              v-if="isActionView ? false : true"
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
                  :disabled="isActionView"
                />
              </template>

              <template #cell(action)="row">
                <b-button
                  @click="removeSelectedProduct(row.index)"
                  title="Remove product from the list"
                  variant="danger"
                  size="sm"
                  v-if="!isActionView"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </b-button>
              </template>
            </b-table>
          </div>
        </div>

        <template #modal-footer>
          <div class="w-100">
            <!-- print btn footer trans modal -->
            <b-button
              class="shadow float-right ml-1"
              title="Print transaction"
              variant="info"
              @click="doPrintReceipt(selectedTransId)"
              v-if="isActionView"
            >
              <font-awesome-icon icon="fa-solid fa-print" /> Print Transaction
            </b-button>

            <!-- save btn footer trans modal-->
            <b-button
              v-if="!isActionView"
              @click="onSaveReceipt()"
              variant="primary"
              class="float-right ml-1 shadow"
            >
              <font-awesome-icon :icon="['fas', 'floppy-disk']" /> Save Receipt
            </b-button>

            <!-- close btn footer trans modal-->
            <b-button @click="$bvModal.hide('transModal')" class="float-right shadow">
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

      <b-modal hide-footer id="ovrTransModal" title="Override Transaction" size="small">
        <b-form @submit="userLoginOvr" class="ovrModal__form">
          <b-form-group id="usernameGroup" label="Username:" label-for="userNameInput">
            <b-form-input
              id="userNameInput"
              v-model="ovrData.userName"
              type="text"
              placeholder="Enter username"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="passwordGroup"
            label="Password:"
            label-for="passwordInput"
            description="We'll never share your password with anyone else."
          >
            <b-form-input
              id="passwordInput"
              v-model="ovrData.password"
              type="password"
              placeholder="********"
              required
            ></b-form-input>
          </b-form-group>

          <b-button
            :disabled="isLoadingOvr"
            class="ovrModal__btn"
            type="submit"
            variant="danger"
          >
            Override
          </b-button>
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
    <acknowledgementReceipt
      v-if="isPrintReceipt"
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

    <arReport
      v-if="isPrintReport"
      class="print"
      :transactions="transactionsReport"
      :dateFrom="dateFrom"
      :dateTo="dateFrom"
    />
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import axios from "axios";
import acknowledgementReceipt from "../components/Report/acknowledgementReceipt.vue";
import arReport from "../components/Report/arReport.vue";
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";

export default {
  components: {
    sidebar,
    acknowledgementReceipt,
    arReport,
  },

  data() {
    return {
      isLoadingOvr: false,
      ovrData: {
        userName: "",
        password: "",
      },

      isAuthenticatedOvr: false,

      transactionsReport: [],
      isPrintReport: false,
      isPrintReceipt: false,

      selectedTransId: "",
      action: "VIEW",
      transModalTitle: "",

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

      selectedStatus: "pr",
      optionStatus: [
        { value: "", text: "ALL" },
        { value: "dr", text: "DR" },
        { value: "pr", text: "PR" },
      ],

      selectedPmtType: "",
      optionPaymentTypes: [
        { value: "", text: "ALL" },
        { value: "CASH", text: "CASH" },
        { value: "CHECK", text: "CHECK" },
      ],
      dateFrom: "",
      dateTo: "",

      transModalForm: {
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
        dateTrans: "",
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
    doExportFIle() {
      const fileName = `Acknowledgement Receipt ${
        this.dateFrom != "" && this.dateTo != ""
          ? "_" + this.dateFrom + "_" + this.dateTo
          : ""
      }`;

      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet("Main Sheet");
      const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

      //merge cell from A1 to I1
      ws.mergeCells("A1:I1");

      //set col width
      ws.columns = [
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
        { width: 25 },
      ];

      //set header
      const cellA1 = ws.getCell("A1");
      ws.getRow(1).height = 80;
      cellA1.font = {
        name: "Arial Narrow",
        size: 16,
        underline: false,
        bold: true,
      };

      const datePeriod =
        this.dateFrom != "" && this.dateTo != ""
          ? `FOR THE PERIOD OF ${this.dateFrom} TO ${this.dateTo}`
          : "";

      cellA1.value = `PHILIPPINE CROP INSURANCE CORPORATION \n ACKNOWLEDGEMENT MANAGEMENT SYSTEM REPORT \n ${datePeriod}`;

      cellA1.alignment = {
        vertical: "top",
        horizontal: "center",
        wrapText: true,
      };

      //set col header values
      const row2 = ws.getRow(2);
      row2.height = 30;
      row2.font = { name: "Arial Narrow", size: 13, bold: true };
      row2.alignment = { vertical: "middle", horizontal: "center" };
      row2.values = [
        "Date Transaction",
        "Series No.",
        "Payor Name",
        "CASH",
        "CHECK",
        "Drawee Bank",
        "Number",
        "Date Check",
        "Amount",
      ];

      //set table header border
      for (let col of cols) {
        ws.getCell(`${col}2`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }

      // set data
      let xIndex = 0;
      this.arEntries.forEach(function (val, index) {
        let cashTransType = val.transType == "CASH" ? "CASH" : "";
        let checkTransType = val.transType == "CHECK" ? "CHECK" : "";

        xIndex = index + 3;
        const rows = ws.getRow(xIndex);

        rows.font = { name: "Arial Narrow", size: 12, bold: false };
        rows.values = [
          val.dateTrans,
          val.docnum,
          val.payor,
          cashTransType,
          checkTransType,
          val.bank,
          val.checkNo,
          val.checkDate,
          Number(val.totalAmt),
        ];

        //set boder on table data
        for (let col of cols) {
          ws.getCell(`${col}${xIndex}`).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });

      //data total amount
      const cellAIndex = `A${xIndex + 1}`;
      const cellIIndex = `I${xIndex + 1}`;

      //set total amount border
      for (let col of cols) {
        ws.getCell(`${col}${xIndex + 1}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }

      ws.getCell(cellAIndex).value = "GRAND TOTAL";
      ws.getCell(cellIIndex).value = this.getTotalAmtArEntries;

      ws.getCell(cellAIndex).font = {
        name: "Arial Narrow",
        size: 14,
        underline: false,
        bold: true,
      };
      ws.getCell(cellIIndex).font = {
        name: "Arial Narrow",
        size: 13,
        underline: false,
        bold: true,
      };
      ws.mergeCells(`A${xIndex + 1}:H${xIndex + 1}`);

      //do export file
      const blobType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      wb.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: blobType });
        FileSaver.saveAs(blob, fileName);
      });
    },

    exportToExcel() {
      this.fetchAllTransaction().then(() => {
        this.setArEntries();
        this.doExportFIle();
      });
    },

    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getRoundOff(num) {
      num = Number(num);
      return (Math.round(num * 100) / 100).toFixed(2);
    },
    onPrintReport() {
      this.fetchAllTransaction().then(() => {
        this.setArEntries();
        this.$nextTick(() => {
          this.$bvModal.hide("transModal");
          this.isPrintReceipt = false;
          this.isPrintReport = true;
          this.transactionsReport = [];
          this.arEntries.forEach(
            function (val) {
              this.transactionsReport.push({
                dateTrans: val.dateTrans,
                arNo: val.docnum,
                payorName: val.payor,
                amt: val.totalAmt,
                pmtType: val.transType,
                drawee: val.bank,
                checkNo: val.checkNo,
                dateCheck: val.checkDate,
              });
            }.bind(this)
          );
          setTimeout(() => {
            window.print();
          }, 1000);
        });
      });
    },
    resetFilterParams() {
      this.inpSrchEntries = "";
      this.dateFrom = "";
      this.dateTo = "";
      this.selectedStatus = "dr";
      this.selectedPmtType = "";
      this.onFilter();
    },

    onFilter() {
      this.fetchAllTransaction().then(() => {
        this.setArEntries();
      });
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 5,
        dismissSecs: 2,

        variant,
        message,
      };
    },

    openTransModal(action, id) {
      this.$bvModal.show("transModal");

      //set transaction state
      this.action = action;
      this.selectedTransId = id;

      //reset transaction data
      this.newReceiptSelectedProd = [];
      this.transModalForm = {
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
        dateTrans: new Date(),
      };

      switch (action) {
        case "NEW":
          this.onNewReceipt();
          break;
        case "VIEW":
          this.onViewTrans(id);
          break;
        case "UPDATE":
          this.onUpdateTrans(id);
          break;
        case "OVR":
          this.ovrTransaction(id);
          break;
      }
    },

    onNewReceipt() {
      this.transModalTitle = "NEW RECEIPT";
      this.getSeriesNo();
      this.setProductList();
    },

    onViewTrans(id) {
      this.transModalTitle = "VIEW TRANSACTION DETAILS";
      this.setTransModalFormByTransId(id);
      this.setTransModalFormLineById(id);
    },

    onUpdateTrans(id) {
      this.transModalTitle = "UPDATE TRANSACTION DETAILS";
      this.setTransModalFormByTransId(id);
      this.setTransModalFormLineById(id);
    },

    ovrTransaction(id) {
      this.transModalTitle = "OVERRIDE TRANSACTION DETAILS";
      this.setTransModalFormByTransId(id);
      this.setTransModalFormLineById(id);
    },

    setTransModalFormByTransId(id) {
      const item = this.getTransHeadById(id);
      console.log(item.transaction_date);
      this.transModalForm = {
        seriesNo: item.transaction_code,
        payorName: item.payor,
        selectedPaymentType: item.payment_type,
        paymentTypeOptions: [
          { text: "CASH", value: "CASH" },
          { text: "CHECK", value: "CHECK" },
        ],
        draweeBank: item.bank_code ? item.bank_code : "",
        number: item.check_no,
        dateCheck: item.check_date,
        dateTrans: item.transaction_date ? new Date(item.transaction_date) : "",
      };
    },

    setTransModalFormLineById(id) {
      const lines = this.getLinesById(id);
      lines.forEach(
        function (val) {
          let prod = this.getProductById(val.product_id);
          this.newReceiptSelectedProd.push({
            prodId: prod.prodId,
            prodName: prod.prodName,
            amount: val.amount ? val.amount : 0.0,
          });
        }.bind(this)
      );
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

    removeSelectedProduct(index) {
      this.newReceiptSelectedProd.splice(index, 1);
      this.setProductList();
    },

    getSeriesNo() {
      const trans = this.getAllTransaction.transHeader
        ? this.getAllTransaction.transHeader
        : [];
      const seriesNo = trans.filter(function (val) {
        return val.transaction_status == "PR";
      }).length;

      this.transModalForm.seriesNo = String(seriesNo + 1).padStart(6, "0");
      return String(seriesNo + 1).padStart(6, "0");
    },

    onSaveReceipt() {
      if (this.action == "OVR") {
        this.$bvModal.show("ovrTransModal");
      } else {
        if (!this.isLoading) this.doSaveReceipt();
      }
    },

    doSaveReceipt() {
      this.isLoading = true;
      const pmtType = this.transModalForm.selectedPaymentType;
      //init header
      const trans_header = {
        payor: this.transModalForm.payorName.toUpperCase(),
        amount: this.getTotalAmount,
        payment_type: pmtType,
        check_no: pmtType == "CHECK" ? this.transModalForm.number.toUpperCase() : "",
        transaction_date: this.transModalForm.dateTrans,
        user_id: localStorage.user_id,
        check_date: pmtType == "CHECK" ? this.transModalForm.dateCheck : null,
        bank_code: pmtType == "CHECK" ? this.transModalForm.draweeBank : "",
      };

      //init transline
      let trans_line = [];
      this.newReceiptSelectedProd.forEach(function (val) {
        trans_line.push({
          product_id: val.prodId,
          quantity: 1,
          amount: val.amount,
        });
      });

      if (this.action == "NEW") {
        this.saveNewReceipt(trans_header, trans_line);
      } else if (this.action == "UPDATE") {
        this.updateReceipt(trans_header, trans_line);
      } else if (this.action == "OVR") {
        this.overrideTransaction(trans_header, trans_line);
      }
    },

    async saveNewReceipt(trans_header, trans_line) {
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
          this.$bvModal.hide("transModal");

          //customize modal dialog message
          const h = this.$createElement;
          const messageVNode = h("div", { class: ["foobar"] }, [
            h("p", { class: ["text-left"] }, [
              "Transaction successfully saved as draft with ",
              h("strong", "Document Number: "),
              h("code", `${res.data.trans_header[0].transaction_code}`),
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

    async updateReceipt(trans_header, trans_line) {
      //set seriesno and status to given object
      trans_header.transaction_code = this.transModalForm.seriesNo;
      trans_header.transaction_status = "DR";

      //save here
      await axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/transaction/updateTransaction/${this.selectedTransId}`,
        data: {
          trans_header,
          trans_line,
        },
      }).then(
        (res) => {
          this.isLoading = false;
          this.showAlert("Successfully saved draft.", "success");
          this.$bvModal.hide("transModal");

          //customize modal dialog message
          const h = this.$createElement;
          const messageVNode = h("div", { class: ["foobar"] }, [
            h("p", { class: ["text-left"] }, [
              "Draft transaction with ",
              h("strong", "Document Number: "),
              h("code", `${res.data.trans_header[0].transaction_code}`),
              " was successfully updated, would you like to process transaction? ",
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

    async overrideTransaction(trans_header, trans_line) {
      //set seriesno and status to given object
      trans_header.transaction_id = this.selectedTransId;
      trans_header.transaction_code = this.transModalForm.seriesNo;
      trans_header.transaction_status = "PR";

      console.log(trans_line);

      // save here
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/transaction/overrideTransaction`,
        data: {
          trans_header,
          trans_line,
        },
      }).then(
        (res) => {
          this.isLoading = false;
          this.showAlert("Successfully overriden transaction.", "success");
          this.$bvModal.hide("transModal");
          this.$bvModal.hide("ovrTransModal");
          this.fetchAllTransaction().then(() => {
            this.setArEntries();
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
            (val.collectingOfficer
              .toLowerCase()
              .includes(this.inpSrchEntries.toLowerCase()) ||
              val.docnum.toLowerCase().includes(this.inpSrchEntries.toLowerCase()) ||
              val.payor.toLowerCase().includes(this.inpSrchEntries.toLowerCase())) &&
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
      this.isPrintReceipt = true;
      this.isPrintReport = false;

      this.$bvModal.hide("transModal");
      setTimeout(() => {
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
          draweeBank: item.bank_code ? item.bank_code.toUpperCase() : "",
          number: item.check_no.toUpperCase(),
          dateCheck: item.check_date
            ? new Date(item.check_date).toLocaleDateString()
            : "",
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
      }, 100);
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
      this.fetchProducts().then(() => {
        this.setProductList();
        this.$bvModal.show("insertProdModal");
      });
    },

    async userLoginOvr(e) {
      e.preventDefault();

      this.isLoadingOvr = true;

      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/user/authenticate`,
        data: {
          username: this.ovrData.userName,
          user_password: this.ovrData.password,
        },
      }).then(
        (res) => {
          const results = res.data.result.results;
          if (results.user_role == "admin") {
            this.resetDataOvrTrans();
            this.doSaveReceipt();
          } else {
            this.resetDataOvrTrans();
            this.showAlert("Override transaction is for admin access only.", "danger");
          }
        },
        (err) => {
          this.resetDataOvrTrans();
          if (err.response) {
            this.showAlert(err.response.data.errorMsg, "danger");
          } else {
            this.showAlert(err, "danger");
          }
        }
      );
    },

    resetDataOvrTrans() {
      this.isLoadingOvr = false;
      this.ovrData.userName = "";
      this.ovrData.password = "";
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

  beforeDestroy() {
    clearInterval(this.roleCheckInterval);
  },
  beforeCreate() {
    let codes = this.$store.state.counter.windCodes.filter(function (val) {
      return localStorage.role == val.wNum;
    });
    if (codes.length < 1) this.$router.push({ path: "/" });
    this.roleCheckInterval = setInterval(() => {
      let codes = this.$store.state.counter.windCodes.filter(function (val) {
        return localStorage.role == val.wNum;
      });
      if (codes.length < 1) this.$router.push({ path: "/" });
    }, 5000);
  },

  computed: {
    isActionView() {
      return this.action == "VIEW";
    },
    isActionUpdate() {
      return this.action == "UPDATE";
    },
    rows() {
      return this.arEntries.length;
    },

    getBarIsClicked() {
      return this.$store.state.dashboard.barIsClicked;
    },

    getTotalAmount() {
      let total = 0;
      this.newReceiptSelectedProd.forEach(function (val) {
        total += Number(val.amount);
      });
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

    getTotalAmtArEntries() {
      let totalAmt = 0;
      this.arEntries.forEach(function (val) {
        totalAmt += Number(val.totalAmt);
      });
      return totalAmt;
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

.transModal {
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

.ovrModal {
  &__form {
    padding: 20px 70px 70px 70px;
  }

  &__btn {
    width: 100%;
  }
}

code {
  font-weight: bold;
  color: crimson;
  background-color: #f1f1f1;
  padding: 2px;
  font-size: 16px;
}
</style>
