<template>
  <div>
    <sidebar />
    <div
      :class="`dataentry ${
        this.getBarIsClicked ? 'dataentry__collapse' : 'dataentry__expand'
      }  dontPrint`"
    >
      <b-button variant="primary">
        <font-awesome-icon icon="fa-solid fa-plus" />
        New Transaction
      </b-button>

      <div class="dataentry__tooltip mt-3">
        <b-form-input class="dataentry__tooltip__input mr-1" placeholder="Search . . ." />
        <b-form-select v-model="selected" :options="options"></b-form-select>
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
            class="dataentry__action_btn"
            variant="success"
            v-show="row.item.docstatus == 'DR'"
          >
            <font-awesome-icon icon="fa-solid fa-cogs" />
            Process
          </b-button>
          <b-button class="dataentry__action_btn" variant="info">
            <font-awesome-icon icon="fa-solid fa-eye" />
            View Details
          </b-button>
        </template>
      </b-table>
    </div>
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
    };
  },

  methods: {},

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
  padding: 64px;

  box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);
  -webkit-box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);
  -moz-box-shadow: 1px 1px 27px -14px rgba(0, 0, 0, 0.53);

  &__collapse {
    margin: 64px 64px 64px 124px;
  }

  &__expand {
    margin: 64px 64px 64px 314px;
  }

  &__action_btn {
    font-size: 12px;
  }

  &__table {
    font-size: 12px !important;
  }

  &__tooltip {
    display: flex;
    height: 40px;
    width: 100%;

    &__input {
      width: 500px;
    }
  }
}
</style>
