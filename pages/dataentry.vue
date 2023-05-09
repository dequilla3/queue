<template>
  <div>
    <sidebar />
    <div class="dataentry">
      <b-button variant="primary" @click="onNewTrans()">
        <font-awesome-icon icon="fa-solid fa-plus" />
        New Receipt
      </b-button>

      <div class="dataentry__tooltip mt-3">
        <b-form-input
          class="dataentry__tooltip__input mr-1"
          placeholder="Search . . ."
        />
        <b-form-select
          title="Filter bt status"
          class="dataentry__tooltip__select mr-1"
          v-model="selectedStatus"
          :options="optionStatus"
        ></b-form-select>

        <b-form-datepicker
          class="dataentry__tooltip__date mr-1"
          v-model="dateFrom"
          locale="en"
        ></b-form-datepicker>

        <label class="pt-2 mr-1">
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </label>

        <b-form-datepicker
          class="dataentry__tooltip__date mr-1"
          v-model="dateTo"
          locale="en"
        ></b-form-datepicker>
        <b-button>
          <font-awesome-icon :icon="['fas', 'magnifying-glass']"
        /></b-button>
      </div>

      <b-table
        class="dataentry__table mt-3"
        sticky-header
        hover
        :items="arEntries"
        :fields="arEntriesTblFields"
      >
        <template #cell(action)="row">
          <b-button
            class="dataentry__action_btn mb-1"
            variant="success"
            v-show="row.item.docstatus == 'DR'"
            title="Process Transaction"
          >
            <font-awesome-icon icon="fa-solid fa-cogs" />
          </b-button>
          <b-button
            title="View Transaction Details"
            class="dataentry__action_btn"
            variant="info"
          >
            <font-awesome-icon icon="fa-solid fa-eye" />
          </b-button>
        </template>

        <template #cell(dateTrans)="row">
          {{ row.item.dateTrans.toLocaleDateString() }}
        </template>
      </b-table>
    </div>

    <b-modal
      id="newTransModal"
      title="New receipt"
      size="xl"
      no-close-on-backdrop
    >
      <template #modal-footer>
        <div class="w-100">
          <b-button variant="primary" class="float-right ml-1">
            <font-awesome-icon :icon="['fas', 'floppy-disk']" /> Save Receipt
          </b-button>
          <b-button
            @click="$bvModal.hide('newTransModal')"
            variant="danger"
            class="float-right"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" /> Cancel
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
          dateTrans: new Date(),
        },
      ],

      arEntriesTblFields: [
        { key: "docnum", label: "Document No." },
        { key: "docstatus", label: "Status" },
        { key: "payor", label: "Payor" },
        { key: "transType", label: "Transaction Type" },
        { key: "collectingOfficer", label: "Collecting Officer" },
        { key: "dateTrans", label: "Date Transaction" },
        { key: "action", label: "Actions" },
      ],

      selectedStatus: "a",
      optionStatus: [
        { value: "a", text: "Filter by Status" },
        { value: "b", text: "DR" },
        { value: "c", text: "PR" },
        { value: "d", text: "ALL" },
      ],

      dateFrom: "",
      dateTo: "",
    };
  },

  methods: {
    onNewTrans() {
      this.$bvModal.show("newTransModal");
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
  padding: 56px;
  margin: 64px 44px 64px 124px;
  box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);
  -webkit-box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);
  -moz-box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);

  &__action_btn {
    font-size: 12px;
    border-radius: 100%;
  }

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
