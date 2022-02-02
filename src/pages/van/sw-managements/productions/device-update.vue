<template>
  <bread-crumb text="단말기 Update 이력" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3">
      <div class="my-3 flex">
        <div class="my-auto w-1/12">Update 일</div>
        <div class="flex w-4/12">
          <div class="block">
            <el-date-picker size="large" />
          </div>
          <p class="mx-auto grow translate-y-1 text-center transition">~</p>
          <div class="block">
            <el-date-picker size="large" />
          </div>
        </div>
      </div>

      <div class="my-3 flex">
        <div class="my-auto w-1/12">검색조건</div>
        <div class="flex w-4/12">
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
        <div class="flex w-4/12">
          <el-input size="large" placeholder="Please Input" />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">단말기 번호</div>
        <div class="flex w-4/12">
          <el-input size="large" placeholder="Please Input" />
        </div>
      </div>
    </div>
    <options-search-button />
  </div>

  <table-common-button />

  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="modelCode" label="S/W Group명" align="center" />
      <el-table-column prop="modelCode" label="S/W Version" align="center" />
      <el-table-column prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column prop="swGroupCode" label="요청내용" align="center" />
      <el-table-column prop="swVersion" label="요청일시" align="center" />
      <el-table-column prop="status" label="응답코드" align="center" />
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

  <device-update-detail-modal v-model="deviceUpdateDetail.modal" />
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceUpdateDetailModal from "~/components/templates/modals/device-update-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,
    DeviceUpdateDetailModal,
  },
  setup() {
    let { registrationHeaders: headers, devices, update } = useDevice();
    const { searchOptions } = useConst();
    const query = ref("");
    const displayOptions = reactive({
      all: false,
      modelCode: false,
      swGroupCode: false,
      swVersion: false,
      status: true,
      registrationDate: true,
      lastAccessDate: true,
    });
    const selectOption = ref();

    const deviceUpdateDetail = reactive({
      modal: false,
    });

    const onRowClicked = (row) => {
      deviceUpdateDetail.modal = true;
    };

    return {
      onRowClicked,
      deviceUpdateDetail,
      selectOption,
      update,
      query,
      headers,
      devices,
      searchOptions,
      displayOptions,
    };
  },
});
</script>
