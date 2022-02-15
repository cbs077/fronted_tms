<template>
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6">검색조건</div>

      <select-box :items="searchOptions" class="ml-6 mr-6 w-72 bg-white" />

      <div class="my-auto mr-6">검색어</div>

      <base-input class="bg-white" />
    </div>

    <div class="my-6 flex flex-row">
      <div class="my-auto mr-6 block align-middle">결과 데이터</div>
      <div v-for="header in headers" :key="`filter-${header.key}`">
        <input
          :id="`checkbox-${header.value}`"
          class="my-auto mx-2 rounded text-black"
          type="checkbox"
          :name="header.value"
          value="yes"
        />
        <label :for="`checkbox-${header.value}`">{{ header.value }}</label>
      </div>
    </div>

    <div class="my-3 text-center">
      <base-button text="초기화" class="mr-1" />
      <base-button text="검색" class="ml-1 bg-sk-lightgray" />
    </div>
  </div>

  <table-common-button>
    <template #body>
      <div class="grow"></div>
      <base-button text="엑셀저장" class="mr-1" />
      <base-button
        text="단말기 등록"
        class="ml-1"
        @click="deviceRegistration.modal = true"
      />
    </template>
  </table-common-button>
  <div class="rounded border border-sk-gray">
    <el-table
      :data="devices"
      fit
      class="rounded"
      @selection-change="handleSelectionChange"
    >
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
    ></el-pagination>
  </div>

  <device-register-modal
    v-model="deviceRegistration.modal"
    @click:positive="onRegistration"
  />

  <result-modal
    v-model="registrationResult.modal"
    title="단말기 일괄등록 처리 결과"
    :items="registrationResult.items"
  />
</template>
<script lang="ts">
import { ElTable, ElTableColumn } from "element-plus";
import { defineComponent, reactive } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseInput from "~/components/atoms/base-input.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import DeviceRegisterModal from "~/components/templates/device-register.modal.vue";
import ResultModal from "~/components/templates/result.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    TableCommonButton,
    ResultModal,
    ElTableColumn,
    DeviceRegisterModal,
    ElTable,
    SelectBox,
    BaseButton,
    BaseInput,
  },
  setup() {
    const { registrationHeaders: headers, devices } = useDevice();
    const { searchOptions } = useConst();

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const handleSelectionChange = (value: IDevice[]) => {
      console.log(value);
    };

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

    const onRegistration = () => {
      deviceRegistration.modal = false;
      setTimeout(() => {
        registrationResult.modal = true;
      }, 1000);
    };

    return {
      onRegistration,
      headers,
      devices,
      searchOptions,
      deviceRegistration,
      registrationResult,
      handleSelectionChange,
    };
  },
});
</script>
