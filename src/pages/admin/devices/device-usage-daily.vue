<template>
  <bread-crumb text="일자별 단말기 사용조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">VAN사명</div>

      <div class="my-auto w-5/12 pr-9">
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

      <div class="my-auto w-1/12">단말기 번호</div>

      <div class="my-auto flex w-5/12">
        <el-input v-model="filter.query" size="large"></el-input>
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

      <el-table-column prop="deviceNumber" label="단말기 번호" align="center" />
      <el-table-column
        prop="printerCutting"
        label="프린터 커팅 횟수"
        align="center"
      />
      <el-table-column
        prop="msrReading"
        label="MSR Reading 횟수"
        align="center"
      />
      <el-table-column
        prop="contactIcCardInsert"
        label="CONTACT IC CARD 삽입 횟수"
        align="center"
      />
      <el-table-column
        prop="rfCardInsert"
        label="RF CARD 삽입 횟수"
        align="center"
      />
      <el-table-column
        prop="hotlineTrade"
        label="전용선 거래 횟수"
        align="center"
      />
      <el-table-column prop="cdmaTrade" label="CDMA 거래 횟수" align="center" />
      <el-table-column
        prop="lineTrade"
        label="전화선 거래 횟수"
        align="center"
      />
      <el-table-column prop="category" label="구분" align="center" />
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
import { IAdminDeviceDeviceUsageDaily } from "~/interfaces/data.interface";
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
      query: faker.lorem.word(),
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

    const example: IAdminDeviceDeviceUsageDaily = {
      date: dateYYYYMMDD(new Date()),
      deviceNumber: faker.lorem.word(),
      cdmaTrade: faker.datatype.number(),
      contactIcCardInsert: faker.datatype.number(),
      hotlineTrade: faker.datatype.number(),
      lineTrade: faker.datatype.number(),
      msrReading: faker.datatype.number(),
      printerCutting: faker.datatype.number(),
      rfCardInsert: faker.datatype.number(),
      van: faker.name.findName(),
      category: faker.lorem.word(),
    };

    const items: IAdminDeviceDeviceUsageDaily[] = [
      ...duplicateMockData<IAdminDeviceDeviceUsageDaily>(example),
    ];

    return { items, filter, displayOptions, deviceUsageDetail, onRowClicked };
  },
});
</script>
