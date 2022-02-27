<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 업데이트 상태"
    no-action
    no-exit-guard
  >
    <template #modalBody>
      <div>
        <table class="mb-4 w-full text-black">
          <tbody>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                S/W Group 코드
              </td>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                S/W Group 명
              </td>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                S/W Version
              </td>
            </tr>
            <tr>
              <td class="h-10 w-3/12 border border-sk-gray text-center">
                4000
              </td>
              <td class="h-10 w-3/12 border border-sk-gray text-center">
                유선
              </td>
              <td class="h-10 w-3/12 border border-sk-gray text-center">
                12312312312
              </td>
            </tr>
          </tbody>
        </table>
        <table class="w-full border-collapse border border-sk-gray text-black">
          <tbody>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                Update 파일명
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                파일 Size
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                등록일
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                등록자
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                업데이트 이력 (완료)
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                업데이트 이력 (실패)
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-show="!admin" class="mt-3 rounded border border-sk-gray">
        <el-table :data="items" fit class="rounded">
          <el-table-column
            prop="deviceNumber"
            label="S/W Group 코드"
            align="center"
          />
          <el-table-column
            prop="requestDate"
            label="단말기 번호"
            align="center"
          />
          <el-table-column
            prop="responseCode"
            label="S/W Group 명"
            align="center"
          />
          <el-table-column
            prop="responseCode"
            label="에러코드"
            align="center"
          />
          <el-table-column prop="responseCode" label="상태" align="center" />
          <el-table-column
            prop="responseCode"
            label="업그레이드"
            align="center"
          >
            <template #default>
              <div><base-button text="업데이트" /></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { IDataTableHeader } from "~/interfaces/data.interface";

export default defineComponent({
  components: {
    BaseModal,
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
      required: false,
      default: () => [],
    },
    admin: {
      type: Boolean,
      default: false,
      required: false,
    },
    sandboxes: {
      type: Boolean,
      default: false,
      required: false,
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
