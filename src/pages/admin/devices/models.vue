<template>
  <bread-crumb text="단말기 모델 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">모델명</div>

      <div class="my-auto ml-5 w-5/12">
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

      <div class="my-auto w-1/12 text-center">검색어</div>
      <div class="w-80 w-5/12">
        <el-input v-model="filter.query" size="large" />
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
      <el-table-column prop="modelId" label="모델 ID" align="center" />
      <el-table-column prop="model" label="모델명" align="center" />
      <el-table-column prop="date" label="등록일" header-align="center" />
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

import ExcelButton from "~/components/molecules/excel-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { IAdminDeviceModel } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,
    ExcelButton,
  },
  setup() {
    const { deviceModels } = useConst();

    const filter = reactive({
      available: [...deviceModels],
      select: undefined,
      query: faker.lorem.word(),
    });

    const example: IAdminDeviceModel = {
      model: faker.lorem.word(),
      modelId: faker.lorem.word(),
      van: faker.lorem.word(),
      date: dateYYYYMMDD(new Date()),
    };

    const items: IAdminDeviceModel[] = [
      ...duplicateMockData<IAdminDeviceModel>(example),
    ];

    return { items, filter };
  },
});
</script>
