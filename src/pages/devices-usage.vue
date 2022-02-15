<template>
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6">조회일</div>

      <div class="mr-12 flex">
        <div class="block">
          <el-date-picker
            v-model="selectDataRange.start"
            size="large"
          ></el-date-picker>
        </div>
        <p class="mx-2 translate-y-1 transition">~</p>
        <div class="block">
          <el-date-picker
            v-model="selectDataRange.end"
            size="large"
          ></el-date-picker>
        </div>
      </div>
    </div>

    <div class="mb-3 mt-6 text-center">
      <base-button text="초기화" class="mr-1" />
      <base-button text="검색" class="ml-1 bg-sk-lightgray" />
    </div>
  </div>

  <table-common-button>
    <template #body>
      <div class="grow"></div>
      <base-button text="엑셀저장" class="mr-1" />
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
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import DeviceRegister from "~/components/templates/device-register.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    DeviceRegister,
    TableCommonButton,
    SelectBox,
    BaseButton,
  },
  setup() {
    const { logHeaders: headers, devices } = useDevice();
    const { deviceModels } = useConst();

    const selectDataRange = reactive({
      start: new Date(),
      end: new Date(),
    });

    return { headers, selectDataRange, devices, deviceModels };
  },
});
</script>
