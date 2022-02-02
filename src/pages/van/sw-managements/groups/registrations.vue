<template>
  <bread-crumb text="S/W Group 조회 및 등록" />
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
        text="S/W Group 등록"
        class="ml-1"
        @click="swGroupCreate.modal = true"
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

  <result-modal
    v-model="registrationResult.modal"
    title="단말기 일괄등록 처리 결과"
    :items="registrationResult.items"
  />

  <sw-group-detail-modal v-model="swGroupDetail.modal" />
  <sw-group-create-modal v-model="swGroupCreate.modal" />
</template>
<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ElTable, ElTableColumn } from "element-plus";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import ResultModal from "~/components/templates/modals/result.modal.vue";
import SwGroupCreateModal from "~/components/templates/modals/sw-group-create.modal.vue";
import SwGroupDetailModal from "~/components/templates/modals/sw-group-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    TableCommonButton,
    ResultModal,
    ElTableColumn,
    ElTable,
    BaseButton,

    SwGroupDetailModal,
    SwGroupCreateModal,
  },
  setup() {
    const { registrationHeaders: headers, devices } = useDevice();
    const { searchOptions } = useConst();

    const deviceRegistration = reactive({
      modal: false,
    });

    const registrationResult = reactive({
      modal: false,
      items: [
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
      ],
    });

    const swGroupDetail = reactive({
      modal: false,
      data: {},
    });

    const swGroupCreate = reactive({
      modal: false,
      data: {},
    });

    const onRegistration = () => {
      deviceRegistration.modal = false;
      setTimeout(() => {
        registrationResult.modal = true;
      }, 1000);
    };

    const onRowClicked = (row: IDevice) => {
      swGroupDetail.data = row;
      swGroupDetail.modal = true;
    };

    const selectOption = ref();

    return {
      selectOption,
      onRowClicked,
      onRegistration,
      swGroupCreate,
      swGroupDetail,
      headers,
      devices,
      searchOptions,
      registrationResult,
      Search,
    };
  },
});
</script>
