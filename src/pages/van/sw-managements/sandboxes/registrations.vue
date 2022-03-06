<template>
  <bread-crumb text="S/W 조회 및 등록" />
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

    <options-search-button />
  </div>

  <table-common-button>
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
      <base-button
        text="S/W 등록"
        class="ml-1"
        @click="swCreate.modal = true"
      />
    </template>
  </table-common-button>
  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column
        prop="swGroupCode"
        label="S/W Group 코드"
        align="center"
      />
      <el-table-column prop="swVersion" label="S/W Group 명" align="center" />
      <el-table-column prop="swVersion" label="S/W Version" align="center" />
      <el-table-column prop="swVersion" label="Upload 파일명" align="center" />
      <el-table-column
        prop="swVersion"
        label="파일 Size (byte)"
        align="center"
      />
      <el-table-column prop="applicationDate" label="등록일" align="center" />
      <el-table-column prop="lastAccessDate" label="등록자" align="center" />
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

  <sw-detail-modal v-model="swDetail.modal" sandboxes />
  <sw-create-modal v-model="swCreate.modal" />
</template>
<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ElTable, ElTableColumn } from "element-plus";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import SwCreateModal from "~/components/templates/modals/sw-create.modal.vue";
import SwDetailModal from "~/components/templates/modals/sw-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    TableCommonButton,
    ElTableColumn,
    ElTable,
    BaseButton,
    SwDetailModal,
    SwCreateModal,
  },
  setup() {
    const { registrationHeaders: headers, devices } = useDevice();
    const { searchOptions } = useConst();
    const selectOption = ref();

    const swDetail = reactive({
      modal: false,
    });

    const swCreate = reactive({
      modal: false,
    });

    const onRowClicked = (row: IDevice) => {
      swDetail.modal = true;
    };

    return {
      selectOption,
      onRowClicked,
      swCreate,
      swDetail,
      headers,
      devices,
      searchOptions,
      Search,
    };
  },
});
</script>
