<template>
  <bread-crumb text="VAN사 관리 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">VAN사</div>

      <div class="my-auto ml-5 w-4/12">
        <el-select
          v-model="filter.select"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in filter.available"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <options-search-button />
  </div>

  <table-common-button>
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="items" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="vanCode" label="VAN사 코드" align="center" />
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="address" label="주소" align="center" />
      <el-table-column prop="contact" label="전화번호" align="center" />
      <el-table-column prop="manager" label="담당자" align="center" />
      <el-table-column prop="date" label="등록일" align="center" />
      <el-table-column prop="user" label="등록자" align="center" />
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

  <van-detail-modal
    v-model="vanDetail.modal"
    :van="vanDetail.data"
  ></van-detail-modal>
</template>
<script lang="ts">
import faker from "@faker-js/faker";
import { defineComponent, reactive } from "vue";

import ExcelButton from "~/components/molecules/excel-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import VanDetailModal from "~/components/templates/modals/van-detail.modal.vue";
import { IAdminVan } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,
    ExcelButton,
    VanDetailModal,
  },
  setup() {
    const filter = reactive({
      available: [{ value: "test" }],
      select: undefined,
    });

    const example: IAdminVan = {
      fax: "",
      address: faker.lorem.word(),
      contact: faker.lorem.word(),
      manager: faker.lorem.word(),
      user: faker.lorem.word(),
      van: faker.lorem.word(),
      vanCode: faker.lorem.word(),
      date: dateYYYYMMDD(new Date()),
    };

    const vanDetail = reactive({
      modal: true,
      data: example,
    });

    const onRowClicked = (row: IAdminVan) => {
      vanDetail.data = row;
      vanDetail.modal = true;
    };

    const items: IAdminVan[] = [...duplicateMockData<IAdminVan>(example)];

    return { items, filter, vanDetail, onRowClicked };
  },
});
</script>
