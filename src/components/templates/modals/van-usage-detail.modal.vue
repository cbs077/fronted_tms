<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="VAN사 사용조회 상세내용"
    large
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
      <table
        class="mb-6 w-full border-collapse border border-sk-gray text-black"
      >
        <tr>
          <td class="h-10 border border-sk-gray bg-sk-lightgray text-center">
            VAN사명
          </td>
          <td colspan="2" class="h-10 border border-sk-gray text-center">
            {{ data.van }}
          </td>
        </tr>
      </table>

      <div class="rounded border border-sk-gray">
        <el-table :data="items" max-height="400" fit class="rounded">
          <el-table-column
            prop="deviceNumber"
            label="단말기번호"
            align="center"
          />
          <el-table-column
            prop="printerCuttingCount"
            label="프린터 커팅 횟수"
            align="center"
          />
          <el-table-column
            prop="msrReadingCount"
            label="MSR Reading 횟수"
            align="center"
          />
          <el-table-column
            prop="contactIcCardInsertCount"
            label="CONTACT IC CARD 삽입 횟수"
            align="center"
          />
          <el-table-column
            prop="rfCardInsertCount"
            label="RF CARD 삽입 횟수"
            align="center"
          />
          <el-table-column
            prop="hotlineTradeCount"
            label="전용선 거래 횟수"
            align="center"
          />
          <el-table-column
            prop="cdmaTradeCount"
            label="CDMA 거래 횟수"
            align="center"
          />
          <el-table-column
            prop="lineTradeCount"
            label="전화선 거래 횟수"
            align="center"
          />

          <el-table-column prop="firstDate" label="최초일" align="center" />
          <el-table-column prop="lastDate" label="최종일" align="center" />
        </el-table>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import faker from "@faker-js/faker";
import { computed, defineComponent, PropType } from "vue";

import ExcelButton from "~/components/molecules/excel-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import {
  IAdminDeviceVanUsage,
  IAdminDeviceVanUsageDetail,
} from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";

export default defineComponent({
  components: {
    ExcelButton,
    TableCommonButton,
    BaseModal,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
    data: {
      type: Object as PropType<IAdminDeviceVanUsage>,
      required: true,
      default: () => ({}),
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

    const example: IAdminDeviceVanUsageDetail = {
      lineTradeCount: faker.datatype.number(),
      cdmaTradeCount: faker.datatype.number(),
      contactIcCardInsertCount: faker.datatype.number(),
      deviceNumber: faker.datatype.number(),
      firstDate: dateYYYYMMDD(faker.datatype.datetime()),
      hotlineTradeCount: faker.datatype.number(),
      lastDate: dateYYYYMMDD(faker.datatype.datetime()),
      msrReadingCount: faker.datatype.number(),
      printerCuttingCount: faker.datatype.number(),
      rfCardInsertCount: faker.datatype.number(),
    };

    const items: IAdminDeviceVanUsageDetail[] = [
      ...duplicateMockData<IAdminDeviceVanUsageDetail>(example),
    ];

    return {
      items,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
