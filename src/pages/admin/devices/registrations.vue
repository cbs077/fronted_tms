<template>
  <bread-crumb text="단말기 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6 w-1/12">검색조건</div>

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

      <div class="my-auto mr-6 w-1/12 text-center">검색어</div>

      <div class="w-5/12 pr-5">
        <el-input
          size="large"
          placeholder="Please Input"
          :suffix-icon="Search"
        />
      </div>
    </div>

    <div class="my-6 flex flex-row">
      <div class="my-auto mr-6 block w-1/12 align-middle">결과 데이터</div>
      <div class="w-11/12">
        <el-checkbox
          v-for="header in headers"
          :key="`filter-${header.key}`"
          :label="header.value"
          size="large"
        />
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
      <el-table-column prop="modelCode" label="단말기모델코드" align="center" />
      <el-table-column prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column
        prop="swGroupCode"
        label="S/W Group 코드"
        align="center"
      />
      <el-table-column prop="swVersion" label="S/W Version" align="center" />
      <el-table-column prop="status" label="상태" align="center" />
      <el-table-column prop="applicationDate" label="등록일" align="center" />
      <el-table-column
        prop="lastAccessDate"
        label="최종접속일"
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

  <device-detail-modal
    v-model="deviceDetail.modal"
    admin
    :device="deviceDetail.data"
    @click:positive="() => {}"
  />
</template>
<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ElTable, ElTableColumn } from "element-plus";
import { defineComponent, reactive, ref } from "vue";

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceDetailModal from "~/components/templates/modals/device-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    TableCommonButton,
    ElTableColumn,
    ElTable,
    DeviceDetailModal,
  },
  setup() {
    const { registrationHeaders: headers, devices } = useDevice();
    const { searchOptions } = useConst();

    const deviceDetail = reactive({
      modal: false,
      data: {},
    });

    const onRowClicked = (row: IDevice) => {
      deviceDetail.data = row;
      deviceDetail.modal = true;
    };

    const selectOption = ref();

    return {
      selectOption,
      onRowClicked,
      deviceDetail,
      headers,
      devices,
      searchOptions,
      Search,
    };
  },
});
</script>
