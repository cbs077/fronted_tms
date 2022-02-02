<template>
  <bread-crumb text="VAN사 사용조회" />
  <table-common-button>
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="items" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사" align="center" />
      <el-table-column
        prop="totalTerminalCount"
        label="Total 단말기 Count"
        align="center"
      />
      <el-table-column
        prop="printerCutting"
        label="프린터 커팅 평균"
        align="center"
      />
      <el-table-column
        prop="msrReading"
        label="MSR Reading 평균"
        align="center"
      />
      <el-table-column
        prop="contactIcCardInsert"
        label="CONTACT IC CARD 삽입 평균"
        align="center"
      />
      <el-table-column
        prop="rfCardInsert"
        label="RF CARD 삽입 평균"
        align="center"
      />
      <el-table-column
        prop="hotlineTrade"
        label="전용선 거래 평균"
        align="center"
      />
      <el-table-column prop="cdmaTrade" label="CDMA 거래 평균" align="center" />
      <el-table-column
        prop="lineTrade"
        label="전화선 거래 평균"
        align="center"
      />
    </el-table>
  </div>

  <div class="flex justify-center">
    <el-pagination
      background
      class="my-6"
      layout="prev, pager, next"
      :total="1000"
    />
  </div>

  <van-usage-detail-modal
    v-model="vanUsageDetail.modal"
    :data="vanUsageDetail.data"
  />
</template>

<script lang="ts">
import faker from "@faker-js/faker";
import { defineComponent, reactive } from "vue";

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import VanUsageDetailModal from "~/components/templates/modals/van-usage-detail.modal.vue";
import { IAdminDeviceVanUsage } from "~/interfaces/data.interface";
import { duplicateMockData } from "~/utils/filter";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    TableCommonButton,
    VanUsageDetailModal,
  },
  setup() {
    const example: IAdminDeviceVanUsage = {
      cdmaTrade: faker.datatype.number(),
      contactIcCardInsert: faker.datatype.number(),
      hotlineTrade: faker.datatype.number(),
      lineTrade: faker.datatype.number(),
      msrReading: faker.datatype.number(),
      printerCutting: faker.datatype.number(),
      rfCardInsert: faker.datatype.number(),
      totalTerminalCount: faker.datatype.number(),
      van: faker.name.findName(),
    };

    const vanUsageDetail = reactive({
      modal: false,
      data: example,
    });

    const onRowClicked = (row: IAdminDeviceVanUsage) => {
      vanUsageDetail.modal = true;
      vanUsageDetail.data = row;
    };

    const items: IAdminDeviceVanUsage[] = [
      ...duplicateMockData<IAdminDeviceVanUsage>(example),
    ];

    return {
      items,
      vanUsageDetail,
      onRowClicked,
    };
  },
});
</script>
