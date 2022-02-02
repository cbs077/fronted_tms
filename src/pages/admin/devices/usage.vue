<template>
  <bread-crumb text="단말기 사용정보 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">조회일</div>

      <div class="flex w-10/12">
        <div class="block">
          <el-date-picker v-model="selectDataRange.start" size="large" />
        </div>
        <p class="mx-2 translate-y-1 transition">~</p>
        <div class="block">
          <el-date-picker v-model="selectDataRange.end" size="large" />
        </div>
      </div>
    </div>

    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">검색조건</div>

      <div class="my-auto w-5/12 pr-5">
        <el-select
          v-model="selectOption"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="my-auto w-1/12 text-center">검색어</div>
      <div class="w-80 w-5/12">
        <el-input v-model="query" size="large" />
      </div>
    </div>

    <div class="my-3 flex">
      <div class="my-auto block w-1/12 align-middle">결과 데이터</div>
      <el-checkbox v-model="displayOptions.all" label="전체" size="large" />
      <el-checkbox
        v-model="displayOptions.modelCode"
        label="단말기 모델 코드"
        size="large"
      />
      <el-checkbox v-model="displayOptions.van" label="VAN사명" size="large" />
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
    <el-table :data="devices" fit class="rounded">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="modelName" label="단말기 모델" align="center" />

      <el-table-column prop="deviceCount" label="단말기 수량" align="center" />
      <el-table-column
        prop="swDownload"
        label="S/W Download 건수"
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
import { defineComponent, reactive, ref } from "vue";

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    TableCommonButton,
  },
  setup() {
    const { logHeaders: headers, devices } = useDevice();
    const { deviceModels } = useConst();

    const searchOptions = [{ value: "단말기 모델" }, { value: "Van사명" }];
    const selectOption = ref();
    const query = ref("");

    const displayOptions = reactive({
      all: false,
      modelCode: false,
      van: false,
    });

    const selectDataRange = reactive({
      start: new Date(),
      end: new Date(),
    });

    return {
      displayOptions,
      searchOptions,
      query,
      selectOption,
      headers,
      selectDataRange,
      devices,
      deviceModels,
    };
  },
});
</script>
