<template>
  <bread-crumb text="단말기 등록 이력" />

  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex">
      <div class="my-auto mr-6 w-1/12">업데이트일</div>

      <div class="flex w-5/12">
        <div class="block">
          <el-date-picker v-model="condition.start" size="large" />
        </div>
        <p class="mx-2 translate-y-1 transition">~</p>
        <div class="block">
          <el-date-picker v-model="condition.end" size="large" />
        </div>
      </div>

      <div class="w-1-12 my-auto mr-6">모델명</div>
      <div class="my-auto w-5/12 pr-5">
        <el-select
          v-model="condition.select"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in condition.available"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
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
    <el-table :data="items" fit class="rounded">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="model" label="단말기 모델명" align="center" />
      <el-table-column
        prop="deviceNumberFrom"
        label="단말기 번호 (From)"
        align="center"
      />
      <el-table-column
        prop="deviceNumberTo"
        label="단말기 번호 (To)"
        align="center"
      />
      <el-table-column prop="createdAt" label="등록일" align="center" />
      <el-table-column prop="user" label="등록자" align="center" />
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

import BreadCrumb from "~/components/atoms/breadcrumb.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDeviceLog } from "~/interfaces/data.interface";
import { duplicateMockData } from "~/utils/filter";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    BreadCrumb,
    TableCommonButton,
  },
  setup() {
    const { searchOptions } = useConst();

    const condition = reactive({
      available: searchOptions,
      select: undefined,
      start: new Date(),
      end: new Date(),
    });

    const example: IDeviceLog = {
      createdAt: faker.lorem.word(),
      deviceNumberFrom: faker.lorem.word(),
      deviceNumberTo: faker.lorem.word(),
      model: faker.lorem.word(),
      user: faker.lorem.word(),
      van: faker.lorem.word(),
    };

    const items: IDeviceLog[] = [...duplicateMockData<IDeviceLog>(example)];

    return { items, condition };
  },
});
</script>
