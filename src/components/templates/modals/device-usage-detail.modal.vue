<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 사용정보 상세"
    no-action
    no-exit-guard
  >
    <template #modalBody>
      <table-common-button no-take>
        <template #body>
          <div class="grow" />
          <excel-button class="mr-1" />
        </template>
      </table-common-button>

      <div class="mb-6 rounded">
        <table class="w-full border-collapse border border-sk-lightgray">
          <tbody>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-lightgray bg-sk-lightgray text-center"
              >
                VAN사명
              </td>
              <td class="border border-sk-lightgray text-center">TEST</td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-lightgray bg-sk-lightgray text-center"
              >
                단말기 모델
              </td>
              <td class="border border-sk-lightgray text-center">TEST</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="rounded border border-sk-gray">
        <el-table :data="items" fit class="rounded">
          <el-table-column prop="request" label="요청내용" align="center" />

          <el-table-column
            prop="deviceNumber"
            label="단말기번호"
            align="center"
          />
          <el-table-column prop="requestDate" label="요청일시" align="center" />
          <el-table-column prop="update" label="업데이트" align="center">
            <template #default>
              <div><base-button text="강제 업데이트" /></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="responseCode"
            label="응답코드"
            align="center"
          />
        </el-table>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { IDataTableHeader } from "~/interfaces/data.interface";

export default defineComponent({
  components: {
    BaseModal,
    TableCommonButton,
    BaseButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
    items: {
      type: Array,
      required: true,
      default: () => [
        {
          request: "업데이트",
          deviceNumber: "111",
          requestDate: new Date(),
          responseCode: "실패",
        },
      ],
    },
  },
  emits: ["update:modelValue"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value: boolean) => {
        emit("update:modelValue", value);
      },
    });

    const header: IDataTableHeader[] = [
      { key: "deviceNumber", value: "단말기 번호" },
      { key: "status", value: "상태" },
    ];

    return {
      header,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
