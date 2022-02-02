<template>
  <bread-crumb text="단말기 사용정보 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6">조회일</div>

      <div class="mr-12 flex">
        <div class="block">
          <el-date-picker v-model="selectDataRange.start" size="large" />
        </div>
        <p class="mx-2 translate-y-1 transition">~</p>
        <div class="block">
          <el-date-picker v-model="selectDataRange.end" size="large" />
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
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
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

  <device-usage-detail-modal v-model="deviceUsageDetail.modal" />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceUsageDetailModal from "~/components/templates/modals/device-usage-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    TableCommonButton,
    DeviceUsageDetailModal,
    BaseButton,
  },
  setup() {
    const { logHeaders: headers, devices } = useDevice();
    const { deviceModels } = useConst();

    const selectDataRange = reactive({
      start: new Date(),
      end: new Date(),
    });

    const deviceUsageDetail = reactive({
      modal: false,
    });

    const onRowClicked = (row: IDevice) => {
      deviceUsageDetail.modal = true;
    };

    return {
      deviceUsageDetail,
      onRowClicked,
      headers,
      selectDataRange,
      devices,
      deviceModels,
    };
  },
});
</script>
