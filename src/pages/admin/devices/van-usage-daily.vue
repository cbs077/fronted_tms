<template>
  <bread-crumb text="일자별 VAN사 사용조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">검색조건</div>

      <div class="my-auto w-4/12 pr-9">
        <el-select
          v-model="filter.select"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in filter.available"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">조회일</div>

      <div class="flex w-10/12">
        <div class="block">
          <el-date-picker v-model="filter.start" size="large" />
        </div>
        <p class="mx-2 translate-y-1 transition">~</p>
        <div class="block">
          <el-date-picker v-model="filter.end" size="large" />
        </div>
      </div>
    </div>

    <options-search-button />
  </div>

  <table-common-button>
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
    </template>
  </table-common-button>
  <div class="rounded border border-sk-gray">
    <el-table :data="items" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="date" label="일자" align="center" />
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
</template>

<script lang="ts">
import faker from "@faker-js/faker";
import { defineComponent, reactive } from "vue";

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import { IDevice } from "~/hooks/devices.hooks";
import { IAdminDeviceVanUsageDaily } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    TableCommonButton,
  },
  setup() {
    const filter = reactive({
      available: [{ value: "test" }],
      select: undefined,
      start: new Date(),
      end: new Date(),
    });

    const displayOptions = reactive({
      all: false,
      modelCode: false,
      van: false,
    });

    const deviceUsageDetail = reactive({
      modal: false,
    });

    const onRowClicked = (row: IDevice) => {
      deviceUsageDetail.modal = true;
    };

    const example: IAdminDeviceVanUsageDaily = {
      date: dateYYYYMMDD(faker.datatype.datetime()),
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

    const items: IAdminDeviceVanUsageDaily[] = [
      ...duplicateMockData<IAdminDeviceVanUsageDaily>(example),
    ];

    return {
      items,
      displayOptions,
      filter,
      deviceUsageDetail,
      onRowClicked,
    };
  },
});
</script>
