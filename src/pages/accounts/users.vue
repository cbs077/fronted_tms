<template>
  <bread-crumb text="개인정보 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">소속사</div>

      <div class="my-auto w-5/12 pr-5">
        <el-select
          v-model="filter.squad.select"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in filter.squad.available"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">검색조건</div>

      <div class="my-auto w-5/12 pr-5">
        <el-select
          v-model="filter.condition.select"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in filter.condition.available"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="my-auto w-1/12 text-center">검색어</div>
      <div class="w-5/12 pr-5">
        <el-input v-model="filter.query" size="large" />
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
      <el-table-column prop="id" label="아이디" align="center" />
      <el-table-column prop="manager" label="담당자명" align="center" />
      <el-table-column prop="squad" label="소속사" align="center" />
      <el-table-column prop="date" label="등록일" align="center" />
      <el-table-column prop="user" label="등록자" align="center" />
      <el-table-column label="패스워드 초기화" align="center">
        <template #default>
          <base-button text="초기화" @click.capture.prevent.stop
        /></template>
      </el-table-column>
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

  <user-detail-modal v-model="userDetail.modal"></user-detail-modal>
</template>

<script lang="ts">
import faker from "@faker-js/faker";
import { defineComponent, reactive } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import UserDetailModal from "~/components/templates/modals/user-detail.modal.vue";
import { IAdminUser } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    TableCommonButton,
    BaseButton,
    UserDetailModal,
  },
  setup() {
    const filter = reactive({
      squad: {
        available: [{ value: "test" }],
        select: undefined,
      },
      condition: {
        available: [{ value: "아이디" }, { value: "담당자명" }],
        select: undefined,
      },
      query: faker.lorem.word(),
    });

    const userDetail = reactive({
      modal: false,
    });

    const onRowClicked = () => {
      userDetail.modal = true;
    };

    const example: IAdminUser = {
      id: faker.lorem.word(),
      manager: faker.lorem.word(),
      squad: faker.lorem.word(),
      user: faker.lorem.word(),
      date: dateYYYYMMDD(new Date()),
    };

    const items: IAdminUser[] = [...duplicateMockData<IAdminUser>(example)];

    return { filter, items, userDetail, onRowClicked };
  },
});
</script>
