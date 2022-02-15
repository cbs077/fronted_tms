<template>
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6">검색조건</div>

      <select-box :items="searchOptions" class="ml-6 mr-6 w-72 bg-white" />

      <div class="my-auto mr-6">검색어</div>
      <div class="w-80">
        <el-input v-model="query" size="large" />
      </div>
    </div>

    <div class="my-6 flex flex-row">
      <div class="my-auto mr-6 block align-middle">결과 데이터</div>
      <input
        id="checkbox-all"
        v-model="displayOptions.all"
        class="my-auto ml-4 mr-2 rounded text-black"
        type="checkbox"
        value="yes"
      />
      <label for="checkbox-all">전체</label>
      <input
        id="checkbox-model-code"
        v-model="displayOptions.modelCode"
        class="my-auto ml-4 mr-2 rounded text-black"
        type="checkbox"
        value="yes"
      />
      <label for="checkbox-model-code">단말기 모델 코드</label>
      <input
        id="checkbox-sw-group-code"
        v-model="displayOptions.swGroupCode"
        class="my-auto ml-4 mr-2 rounded text-black"
        type="checkbox"
        value="yes"
      />
      <label for="checkbox-sw-group-code">S/W Group 코드</label>
      <input
        id="checkbox-sw-version"
        v-model="displayOptions.swVersion"
        class="my-auto ml-4 mr-2 rounded text-black"
        type="checkbox"
        value="yes"
      />
      <label for="checkbox-sw-version">S/W Version</label>
      <input
        id="checkbox-status"
        v-model="displayOptions.status"
        class="my-auto ml-4 mr-2 rounded text-black"
        type="checkbox"
        value="yes"
      />
      <label for="checkbox-all">상태</label>
      <input
        id="checkbox-registration-date"
        v-model="displayOptions.registrationDate"
        class="my-auto ml-4 mr-2 rounded text-black"
        type="checkbox"
        value="yes"
      />
      <label for="checkbox-registration-date">등록일</label>
    </div>
    <div class="my-3 text-center">
      <base-button text="초기화" class="mr-1" />
      <base-button text="검색" class="ml-1 bg-sk-lightgray" />
    </div>
  </div>

  <table-common-button>
    <template #body>
      <base-button class="ml-1" @click="deviceUnRegistration.modal = true">
        <template #button-body>
          <div class="flex justify-center">
            <trash-icon class="mr-3 w-5"></trash-icon> 삭제
          </div>
        </template>
      </base-button>
      <div class="grow"></div>
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
    ></el-pagination>
  </div>

  <confirm-modal
    v-model="deviceUnRegistration.modal"
    title="Confirm"
    positive-text="삭제"
    negative-text="취소"
    :text="deviceUnRegistration.text"
  ></confirm-modal>
</template>
<script lang="ts">
import { TrashIcon } from "@heroicons/vue/outline";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import ConfirmModal from "~/components/templates/confirm.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    SelectBox,
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
      all: true,
      modelCode: true,
      swGroupCode: true,
      swVersion: true,
      status: true,
      registrationDate: true,
    });

    const deviceUnRegistration = reactive({
      modal: false,
      text: "선택한 항목을 삭제 하시겠습니까?",
    });

    return {
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
