<template>
  <bread-crumb text="Transaction 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3">
      <div class="my-3 flex">
        <div class="my-auto w-1/12">조회일</div>
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
        <div class="my-auto w-1/12">응답상태</div>
        <div class="mr-12 flex">
          <div class="mr-12 flex">
            <el-radio-group>
              <el-radio label="일반" />
              <el-radio label="오류" />
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">단말기 번호</div>
        <div class="flex w-4/12">
          <el-input size="large" placeholder="Please Input" />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">서버</div>
        <div class="mr-12 flex">
          <el-radio-group>
            <el-radio label="운영서버" />
            <el-radio label="테스트서버" />
          </el-radio-group>
        </div>
      </div>
    </div>
    <options-search-button />
  </div>

  <table-common-button>
    <template #body>
      <base-button class="mr-1" text="사용 중지" />
      <base-button class="ml-1" text="사용 재개" />
      <div class="grow" />
      <base-button class="ml-1" text="엑셀 저장" />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded">
      <el-table-column
        type="selection"
        primary-text
        class="text-black"
        align="center"
      />
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="modelCode" label="S/W Group명" align="center" />
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

  <confirm-modal
    v-model="deviceUnRegistration.modal"
    title="Confirm"
    positive-text="삭제"
    negative-text="취소"
    :text="deviceUnRegistration.text"
  />
</template>
<script lang="ts">
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
