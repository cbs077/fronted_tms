<template>
  <bread-crumb text="VAN사별 현황" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">VAN사명</div>

      <div class="w-11/12 pr-3">
        <el-input />
      </div>
    </div>

    <options-search-button />
  </div>

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
      :height="Math.min(20, devices.length) * 40"
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
</template>
<script lang="ts">
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { defineComponent, reactive, ref } from "vue";

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
    TableCommonButton,
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

    const arraySpanMethod = (span: SpanMethodProperties) => {
      if (span.rowIndex === devices.length - 1) {
        if (span.columnIndex === 0) {
          return [1, 2];
        } else if (span.columnIndex === 1) {
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
