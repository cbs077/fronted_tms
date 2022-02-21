<template>
  <bread-crumb text="단말기 조회 및 등록" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6 w-1/12">검색조건</div>

      <div class="my-auto w-5/12 pr-5">
        <el-select
          @update:select="onSelect" 
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
            :value="item.key"
          />
        </el-select>
      </div>

      <div class="my-auto w-1/12 text-center">검색어</div>
      <div class="w-80 w-5/12">
        <el-input v-model="query" size="large" />
      </div>

    </div>

    <div class="my-6 flex flex-row">
      <div class="my-auto mr-6 block w-1/12 align-middle">결과 데이터</div>
      <div class="w-11/12">
        <el-checkbox
          v-for="header in headers"
          :key="`filter-${header.key}`"
          :label="header.value"
          size="large"
        />
      </div>
    </div>
    <options-search-button
      @click:search="onSearch"
    />
  </div>

  <table-common-button
    @update:take="onTake"
  >
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
      <base-button
        text="단말기 등록"
        class="ml-1"
        @click="deviceRegistration.modal = true"
      />
    </template>
  </table-common-button>
  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
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
      @current-change="paginate"
      background
      class="my-6"
      layout="prev, pager, next"
      :page-size="20"
      :pager-count="11"
      :total="totalCount"
    /> 
    <!-- v-model:page-count="totalCount"
         v-model:page-size="10"
         @update:page-size="handleSizeChange" -->
    <!--
    <pagination
      :total="totalCount"
      :page.sync="10"
      @pagination="getList" 
    />-->
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

  <device-detail-modal
    v-model="deviceDetail.modal"
    :device="deviceDetail.data"
    @click:positive="() => {}"
  />
</template>
<script lang="ts">
import  axios, { AxiosResponse } from "axios";
import { Search } from "@element-plus/icons-vue";
import { ElTable, ElTableColumn, ElPagination } from "element-plus";
import Pagination from '@/components/Pagination'

import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceDetailModal from "~/components/templates/modals/device-detail.modal.vue";
import DeviceRegisterModal from "~/components/templates/modals/device-register.modal.vue";
import ResultModal from "~/components/templates/modals/result.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    TableCommonButton,
    ResultModal,
    ElTableColumn,
    ElPagination,
    DeviceRegisterModal,
    ElTable,
    BaseButton,
    DeviceDetailModal,
  },
  setup() {
    const { registrationHeaders: headers, devices, update, renmeObjectKey} = useDevice();
    const { searchOptions } = useConst();

    const deviceRegistration = reactive({
      modal: false,
    });
    const query = ref("");
    const deviceDetail = reactive({
      modal: false,
      data: {},
    });

    let searchKey = {"key": "sw_group_id"};
    let searchVal = "bb";
    let pageVal = {
      page: 1,
      pageCount: 10,
      total: 30
    }

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

    const onRowClicked = (row: IDevice) => {
      deviceDetail.data = row;
      deviceDetail.modal = true;
    };

// 없애야 함.
    const onSelect = (event) => {
      searchKey = event
      console.log("onSelect", event)
    };
    const onInput = (event) => {
      console.log("onInput", event)
    };
    const selectCategory = (event) => {
      console.log(event.target.value);
      console.log("this.selected", this.selectedOption.value);
    };

    const onSearch = (event) => {
      totalCount = 30
      console.log("onSearch", query.value);
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param);
    };

    const paginate = (page) => {
      console.log("paginate", page);
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param);
    }; 

    const onTake = (pageCount) => {
      console.log("onTake", pageCount)
      pageVal.pageCount = pageCount
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param);
    }; 
    const seTtotalCount = (pageCount) => {
      console.log("aa")
      totalCount = 30
    }

    const handleSizeChange = (pageCount) => {
      console.log("aa")
      totalCount = 30
    }

    async function getTerminal(param) {
      console.log("getTerminal",param)
      var tokena= "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJ0ZXN0IiwiaWF0IjoxNjQ1NDc2MDY4LCJleHAiOjE2NDU0ODIwNjh9.0N10gnfnYGntzduvPy6gefaPhfV7qk8g64WTDhaI9kQ"
      window.localStorage.setItem("token", tokena)
      var token = window.localStorage.getItem("token")
      if(token == null) token = "" 

      let data: any[] = [];

      let response = await axios.get('http://tms-test-server.p-e.kr:8081/terminal/list?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list

        for (var object of list){
          var obj = renmeObjectKey(object);
          data.push(obj);
        }   
        console.log("totalCount")
        totalCount = 50  
        update(data); 
        return response.data.total_count;
      });
      console.log("response", response)
      totalCount = 20
      seTtotalCount(30)
      return response
    };

    const selectOption = ref();
    var totalCount = 5;

    getTerminal("page=1&page_count=10")
    
    return {
      searchKey,
      searchVal,
      pageVal,
      totalCount,
      selectOption,
      onRowClicked,
      onRegistration,
      deviceDetail,
      headers,
      query,
      devices,
      update,
      searchOptions,
      deviceRegistration,
      registrationResult,
      Search,
      onSelect,
      onInput,
      selectCategory,
      onSearch,
      paginate,
      onTake,
      handleSizeChange
    };
  },
});
</script>
