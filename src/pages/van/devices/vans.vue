<template>
  <bread-crumb text="VAN사별 현황" />
  <table-common-button no-take>
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
    </template>
  </table-common-button>

  <div class="mb-6 rounded border border-sk-gray">
    <el-table
      :data="devices"
      fit
      height="300"
      class="rounded"
      :span-method="arraySpanMethod"
    >
      <el-table-column
        prop="van"
        label="VAN사명"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="modelName"
        label="단말기모델"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="deviceCount"
        label="단말기 수량"
        align="right"
        header-align="center"
      />
      <el-table-column
        prop="init"
        label="초기상태"
        align="right"
        header-align="center"
      />
      <el-table-column
        prop="running"
        label="사용중"
        align="right"
        header-align="center"
      />
      <el-table-column
        prop="idle"
        label="휴면상태"
        align="right"
        header-align="center"
      />
    </el-table>
  </div>

  <hr class="my-6" />
  <bread-crumb text="VAN사별 현황 (상세)" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="flex w-1/3">
        <div class="my-auto w-1/4">단말기 모델</div>
        <div class="my-auto w-3/4 pr-5">
          <el-select clearable placeholder="선택" size="large" class="w-full">
            <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="flex w-1/3">
        <div class="my-auto w-1/4">S/W 그룹명</div>
        <div class="my-auto w-3/4 pr-5">
          <el-select clearable placeholder="선택" size="large" class="w-full">
            <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="flex w-1/3">
        <div class="my-auto w-1/4">단말기 상태</div>
        <div class="my-auto w-3/4 pr-5">
          <el-select clearable placeholder="선택" size="large" class="w-full">
            <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>

    <div class="my-6 flex flex-row">
      <div class="my-auto block w-1/12 align-middle">결과 데이터</div>
      <div class="flex">
        <el-checkbox label="전체" size="large" />
        <el-checkbox label="단말기 모델명" size="large" />
        <el-checkbox label="주유소 코드" size="large" />
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

  <div class="mb-6 rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column
        prop="modelName"
        label="단말기모델"
        class-name="text-blue"
        class="text-blue"
      />
      <el-table-column prop="deviceCount" label="단말기 수량" />
      <el-table-column prop="init" label="초기상태" />
      <el-table-column prop="running" label="사용중" />
      <el-table-column prop="idle" label="휴면상태" />
    </el-table>
  </div>

  <van-detail-modal v-model="vanDetail.modal" />
  <device-log-modal v-model="deviceLog.modal" />
</template>
<script lang="ts">
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import ExcelButton from "~/components/molecules/excel-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceLogModal from "~/components/templates/modals/device-log.modal.vue";
import VanDetailModal from "~/components/templates/modals/van-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

interface SpanMethodProperties {
  row: IDevice;
  column: TableColumnCtx<IDevice>;
  rowIndex: number;
  columnIndex: number;
}
export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    ExcelButton,
    BaseButton,
    TableCommonButton,

    VanDetailModal,
    DeviceLogModal,
  },
  setup() {
    let { devices, update } = useDevice();
    const { searchOptions } = useConst();
    const query = ref("");
    const displayOptions = reactive({
      all: true,
      modelCode: true,
      stationCode: true,
    });

    const vanDetail = reactive({
      modal: true,
    });

    const deviceLog = reactive({
      modal: false,
    });

    const onRowClicked = (row: IDevice) => {
      deviceLog.modal = true;
    };

    const arraySpanMethod = ({
      rowIndex,
      columnIndex,
    }: // eslint-disable-next-line unicorn/consistent-function-scoping
    SpanMethodProperties) => {
      if (rowIndex === devices.length - 1) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    };

    return {
      update,
      vanDetail,
      query,
      deviceLog,
      devices,
      searchOptions,
      displayOptions,
      arraySpanMethod,
      onRowClicked,
    };
  },
});
</script>

<style lang="scss">
.is-right.el-table__cell {
  color: blue;
}
</style>
