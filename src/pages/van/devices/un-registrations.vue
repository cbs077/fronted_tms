<template>
  <bread-crumb text="단말기 삭제" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">검색조건</div>

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

      <div class="my-auto w-1/12 text-center">검색어</div>
      <div class="w-80 w-5/12">
        <el-input v-model="query" size="large" />
      </div>
    </div>

    <div class="my-6 flex">
      <div class="my-auto block w-1/12 align-middle">결과 데이터</div>
      <el-checkbox v-model="displayOptions.all" label="전체" size="large" />
      <el-checkbox
        v-model="displayOptions.modelCode"
        label="단말기 모델 코드"
        size="large"
      />
      <el-checkbox
        v-model="displayOptions.swGroupCode"
        label="S/W Group 코드"
        size="large"
      />
      <el-checkbox
        v-model="displayOptions.swVersion"
        label="S/W Version"
        size="large"
      />
      <el-checkbox v-model="displayOptions.status" label="상태" size="large" />
      <el-checkbox
        v-model="displayOptions.registrationDate"
        label="등록일"
        size="large"
      />
      <el-checkbox
        v-model="displayOptions.lastAccessDate"
        label="최종 접속일"
        size="large"
      />
    </div>
    <options-search-button />
  </div>

  <table-common-button>
    <template #body>
      <base-button class="ml-1" @click="deviceUnRegistration.modal = true">
        <template #button-body>
          <div class="flex justify-center">
            <trash-icon class="mr-3 w-5" /> 삭제
          </div>
        </template>
      </base-button>
      <div class="grow" />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded">
      <el-table-column type="selection" primary-text class="text-black" />
      <el-table-column prop="van" label="VAN사명" />
      <el-table-column prop="modelCode" label="단말기모델코드" />
      <el-table-column prop="deviceNumber" label="단말기번호" />
      <el-table-column prop="swGroupCode" label="S/W Group 코드" />
      <el-table-column prop="swVersion" label="S/W Version" />
      <el-table-column prop="status" label="상태" />
      <el-table-column prop="applicationDate" label="등록일" />
      <el-table-column prop="lastAccessDate" label="최종접속일" />
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
</template>
<script lang="ts">
import { TrashIcon } from "@heroicons/vue/outline";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import ConfirmModal from "~/components/templates/modals/confirm.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    BaseButton,
    TableCommonButton,
    TrashIcon,
    ConfirmModal,
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

    const deviceUnRegistration = reactive({
      modal: false,
      text: "선택한 항목을 삭제 하시겠습니까?",
    });

    return {
      selectOption,
      update,
      deviceUnRegistration,
      query,
      headers,
      devices,
      searchOptions,
      displayOptions,
    };
  },
});
</script>
