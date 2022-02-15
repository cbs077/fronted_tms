<template>
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6">검색어</div>
      <div class="w-11/12">
        <el-input v-model="query" size="large" />
      </div>
    </div>

    <div class="my-3 text-center">
      <base-button text="초기화" class="mr-1" />
      <base-button text="검색" class="ml-1 bg-sk-lightgray" />
    </div>
  </div>

  <table-common-button no-take>
    <template #body>
      <div class="grow"></div>
      <base-button class="ml-1">
        <template #button-body>
          <div class="flex justify-center">엑셀저장</div>
        </template>
      </base-button>
    </template>
  </table-common-button>

  <div class="mb-6 rounded border border-sk-gray">
    <el-table
      :data="devices"
      fit
      class="rounded"
      :span-method="arraySpanMethod"
    >
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="modelName" label="단말기모델" />
      <el-table-column prop="deviceCount" label="단말기 수량" />
      <el-table-column prop="init" label="초기상태" />
      <el-table-column prop="running" label="사용중" />
      <el-table-column prop="idle" label="휴면상태" />
    </el-table>
  </div>
</template>
<script lang="ts">
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
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
    BaseButton,
    TableCommonButton,
  },
  setup() {
    let { devices, update } = useDevice();
    const { searchOptions } = useConst();
    const query = ref("");
    const displayOptions = reactive({
      all: true,
      modelCode: true,
      swGroupCode: true,
      swVersion: true,
      status: true,
      registrationDate: true,
    });

    const arraySpanMethod = ({
      row,
      column,
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
      query,
      devices,
      searchOptions,
      displayOptions,
      arraySpanMethod,
    };
  },
});
</script>

<style scoped>
.el-table__footer-wrapper tbody td.el-table__cell {
  background: white !important;
}
</style>
