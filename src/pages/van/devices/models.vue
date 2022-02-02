<template>
  <bread-crumb text="단말기 모델 조회" />

  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">모델명</div>

      <div class="my-auto ml-5 w-5/12">
        <el-select
          v-model="selectOption"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in deviceModels"
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

    <options-search-button />
  </div>

  <table-common-button>
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
      <base-button
        text="단말기 모델 등록"
        class="ml-1"
        @click="modelCreate.modal = true"
      />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="modelCode" label="모델코드" align="center" />
      <el-table-column prop="deviceNumber" label="모델명" align="center" />
      <el-table-column prop="swGroupCode" label="설명" header-align="center" />
      <el-table-column prop="applicationDate" label="등록일" align="center" />
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

  <confirm-modal
    v-model="deviceUnRegistration.modal"
    title="Confirm"
    positive-text="삭제"
    negative-text="취소"
    :text="deviceUnRegistration.text"
  />

  <model-detail-modal v-model="modelDetail.modal" />
  <model-create-modal v-model="modelCreate.modal" />
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import ConfirmModal from "~/components/templates/modals/confirm.modal.vue";
import ModelCreateModal from "~/components/templates/modals/model-create.modal.vue";
import ModelDetailModal from "~/components/templates/modals/model-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,

    ConfirmModal,
    ModelDetailModal,
    ModelCreateModal,
    BaseButton,
  },
  setup() {
    let { registrationHeaders: headers, devices, update } = useDevice();
    const { deviceModels } = useConst();
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

    const deviceUnRegistration = reactive({
      modal: false,
      text: "선택한 항목을 삭제 하시겠습니까?",
    });

    const modelDetail = reactive({
      modal: false,
    });

    const modelCreate = reactive({
      modal: false,
    });

    const onRowClicked = () => {
      modelDetail.modal = true;
    };
    return {
      modelCreate,
      onRowClicked,
      selectOption,
      modelDetail,
      update,
      deviceUnRegistration,
      query,
      headers,
      devices,
      deviceModels,
      displayOptions,
    };
  },
});
</script>
