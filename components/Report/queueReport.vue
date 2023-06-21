<template>
  <div>
    <div class="text-center">
      <h5>
        PHILIPPINE CROP INSURANCE CORPORATION <br />
        Queue Management System <br />
        <sub
          >FOR THE PERIOD OF <b>{{ dateFrom }}</b> TO <b>{{ dateTo }}</b>
        </sub>
      </h5>
    </div>

    <br />

    <table>
      <caption></caption>
      <thead>
        <tr>
          <th rowspan="2" scope="col">COUNTER</th>
          <th scope="col">Male</th>
          <th scope="col">Female</th>
          <th rowspan="2" scope="col">Total Number Client.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in queueReportDetails" :key="index">
          <td :class="getTotalClassName(item)">
            {{ item.counter }}
          </td>
          <td :class="getTotalClassName(item)">
            {{ item.totalMale }}
          </td>
          <td :class="getTotalClassName(item)">
            {{ item.totalFemale }}
          </td>
          <td :class="getTotalClassName(item)">
            {{ item.totalNum }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    queueReportDetails: Array,
    dateFrom: String,
    dateTo: String,
  },

  mounted() {},

  methods: {
    getTotalClassName(item) {
      return `${item.key == "total" ? "font-weight-bold" : ""}`;
    },
  },
};
</script>
<style scoped>
table {
  width: 100%;
}
table,
th {
  border: 1px solid black;
  text-align: center;
  padding: 5px;
}

td {
  border: 1px solid black;
  text-align: center;
  padding: 3px;
}
</style>
