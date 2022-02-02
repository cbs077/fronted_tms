<template>
  <bread-crumb text="Transaction 조회" />
  <div
    class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8 text-center"
  >
    <div class="my-3">
      <div class="my-3 flex">
        <div class="my-auto w-1/12">조회일</div>
        <div class="flex w-4/12">
          <div class="block">
            <el-date-picker v-model="filter.start" size="large" />
          </div>
          <p class="mx-auto grow translate-y-1 text-center transition">~</p>
          <div class="block">
            <el-date-picker v-model="filter.end" size="large" />
          </div>
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">VAN사명</div>
        <div class="flex w-4/12">
          <el-select
            v-model="filter.van.select"
            clearable
            placeholder="선택"
            size="large"
            class="w-full"
          >
            <el-option
              v-for="item in filter.van.available"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="my-auto w-1/12 text-center">검색조건</div>
        <div class="flex w-4/12">
          <el-select
            v-model="filter.condition.select"
            clearable
            placeholder="선택"
            size="large"
            class="w-full"
          >
            <el-option
              v-for="item in filter.condition.available"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">검색어</div>
        <div class="flex w-4/12">
          <el-input
            v-model="filter.query"
            size="large"
            placeholder="Please Input"
          />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">응답상태</div>
        <div class="mr-12 flex">
          <div class="mr-12 flex">
            <el-radio-group v-model="filter.status">
              <el-radio label="일반" />
              <el-radio label="오류" />
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">단말기 번호</div>
        <div class="flex w-4/12">
          <el-input
            v-model="filter.deviceNumber"
            size="large"
            placeholder="Please Input"
          />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">서버</div>
        <div class="mr-12 flex">
          <el-radio-group v-model="filter.server">
            <el-radio label="운영서버" />
            <el-radio label="테스트서버" />
          </el-radio-group>
        </div>
      </div>
    </div>
    <options-search-button />
  </div>

  <table-common-button> </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="items" fit class="rounded">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="swGroup" label="S/W Group명" align="center" />
      <el-table-column prop="swVersion" label="S/W Version" align="center" />
      <el-table-column prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column prop="request" label="요청내용" align="center" />
      <el-table-column prop="date" label="요청일시" align="center" />
      <el-table-column prop="responseCode" label="응답코드" align="center" />
      <el-table-column prop="status" label="단말기 상태" align="center" />
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
import { useConst } from "~/hooks/const.hooks";
import { IAdminTransaction } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,
  },
  setup() {
    const { searchOptions } = useConst();

    const filter = reactive({
      start: new Date(),
      end: new Date(),
      van: {
        available: [{ value: "test" }],
        select: undefined,
      },
      condition: { available: [{ value: "test" }], select: undefined },
      query: undefined,
      status: undefined,
      deviceNumber: faker.lorem.word(),
      server: undefined,
    });

    const example: IAdminTransaction = {
      deviceNumber: faker.lorem.word(),
      request: faker.lorem.word(),
      responseCode: faker.lorem.word(),
      status: faker.lorem.word(),
      swGroup: faker.lorem.word(),
      swVersion: faker.lorem.word(),
      van: faker.lorem.word(),
      date: dateYYYYMMDD(new Date()),
    };

    const items: IAdminTransaction[] = [
      ...duplicateMockData<IAdminTransaction>(example),
    ];

    return {
      items,
      filter,
      searchOptions,
    };
  },
});
</script>
