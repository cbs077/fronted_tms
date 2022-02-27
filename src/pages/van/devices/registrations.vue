<template>
  <bread-crumb text="단말기 조회 및 등록" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6 w-1/12">검색조건</div>

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
            :value="item.key"
          />
        </el-select>
      </div>

      <div class="my-auto w-1/12 text-center">검색어</div>
      <div class="w-80 w-5/12">
        <el-input
          v-model="query" 
          size="large" 
          placeholder="Please Input"
          :suffix-icon="Search"
        />
      </div>
    </div>

    <div class="my-6 flex flex-row">
      <div class="my-auto mr-6 block w-1/12 align-middle">결과 데이터</div>
      <div class="w-11/12">
          <el-checkbox
            v-for="header in headers"
            v-model="tableHeader.checkAll[header.key]"
            :key="`filter-${header.key}`"
            :label="header.value"
            @change="onCheckbox(header.key, tableHeader.checkAll[header.key])"
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
       <excel-button @click:excel="onSaveExcel" class="mr-1" />
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
      <el-table-column v-if="tableHeader.modelCode==true" prop="modelCode" label="단말기모델코드" align="center" />
      <el-table-column v-if="tableHeader.deviceNumber==true"  prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column
        v-if="tableHeader.swGroupCode==true"
        prop="swGroupCode"
        label="S/W Group 코드"
        align="center"
      />
      <el-table-column v-if="tableHeader.swVersion==true" prop="swVersion" label="S/W Version" align="center" />
      <el-table-column v-if="tableHeader.status==true" prop="status" label="상태" align="center" />
      <el-table-column v-if="tableHeader.applicationDate==true" prop="applicationDate" label="등록일" align="center" />
      <el-table-column
        v-if="tableHeader.lastAccessDate==true"
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
      :page-count="pageVal.total"   
    /> 
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
    @click:positive="onSaveDetail"
  />
</template>
<script lang="ts">
import  axios, { AxiosResponse } from "axios";
import * as XLSX from 'xlsx/xlsx.mjs';
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

//import {makeExcelFile5} from "~/components/molecules/excel-button.vue";


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
    const { registrationHeaders_a: headers, devices, update, renmeObjectKey} = useDevice();
    const { searchOptions } = useConst();

    const deviceRegistration = reactive({
      modal: false,
    });
    const query = ref("");
    const deviceDetail = reactive({
      modal: false,
      data: {},
    });

    let excelValue = "";
    let pageVal = reactive({
      page: 1,
      pageCount: 10,
      total: 10
    })

    let tableHeader = reactive({
      van: true,
      modelCode: true,
      deviceNumber: true,
      swGroupCode: true,
      swVersion: true,
      status: true,
      applicationDate: true,
      lastAccessDate: true,
      checkAll: []
    })

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

    const onRegistration = (value) => {
      console.log("onRegistration", value)
      if( value.type == "multi"){
        registrationResult.items = value.data
        deviceRegistration.modal = false;
        setTimeout(() => {
          registrationResult.modal = true;
        }, 1000);
      }else{
        deviceRegistration.modal = false;
      }
    };

    const onRowClicked = (row: IDevice) => {
      console.log("onRowClicked", row)
      deviceDetail.data = row;
      deviceDetail.modal = true;


    };

// 없애야 함.
    const onSelect = (event) => {
      searchKey = event
    };

    const onSearch = (event) => {
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      excelValue = param //엑셀 다운로드에서 필요함.
      getTerminal(param).then( data => {
        setValue(data)
        //defaultCheckbox()
      })
    };

    const paginate = (page) => {
      console.log("paginate", page);
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
        //defaultCheckbox()
      })
    }; 

    const onTake = (pageCount) => {
      console.log("onTake", pageCount)
      pageVal.pageCount = pageCount
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
        //defaultCheckbox()
      })
    }; 
    const seTtotalCount = (pageCount) => {
      pageVal.total = pageCount
      console.log("seTtotalCount", pageVal.total)
    }

    const onCheckbox = (name, tst) => {
      tableHeader[name] = tst
    //  tableHeader.checkAll["van"] = true
    }

    async function getTerminal(param) {
      console.log("getTerminal",param)
      var token = window.localStorage.getItem("token")
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/terminal/list?' + param,
          {
            headers: {
                Authorization: token
            }
          }
        )
        .then(response => {
          return response.data;
        });
      console.log("response", responset)
      return responset
    };


    const onSaveDetail = ( val : any) => {
      console.log("onSaveDetail", val.modelCode)
    }

    const onSaveExcel = () => {   
      var data = getTerminal("page=1&page_count=1000"+ excelValue).then( data => {
        var dataWS = XLSX.utils.json_to_sheet(data.list);
        // 엑셀의 workbook을 만든다
        // workbook은 엑셀파일에 지정된 이름이다.
        var wb = XLSX.utils.book_new();
        // workbook에 워크시트 추가
        // 시트명은 'nameData'
        XLSX.utils.book_append_sheet(wb, dataWS, 'nameData');
        // 엑셀 파일을 내보낸다.
        XLSX.writeFile(wb, 'terminal.xlsx');
      })
    }

    function setValue(data) {
      var list = data.list
      var dataArr = []
      for (var object of list){
        var obj = renmeObjectKey(object);
        dataArr.push(obj);
      }   
      seTtotalCount(data.total_count)
      update(dataArr); 
    }

    function defaultCheckbox() {
     //tableHeader.checkAll["van"] = true
      tableHeader.checkAll["modelCode"] = true
      tableHeader.checkAll["deviceNumber"] = true
      tableHeader.checkAll["swGroupCode"] = true
      tableHeader.checkAll["swVersion"] = true
      tableHeader.checkAll["status"] = true
      tableHeader.checkAll["applicationDate"] = true
      tableHeader.checkAll["lastAccessDate"] = true
    }

    const selectOption = ref();

    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
      defaultCheckbox()
    })

    return {
      // searchKey,
      // searchVal,
      pageVal,
      excelValue,
      selectOption,
      onRowClicked,
      onRegistration,
      deviceDetail,
      tableHeader,
      headers,
      query,
      devices,
      update,
      searchOptions,
      deviceRegistration,
      registrationResult,
      Search,
      //onSelect,
      onSearch,
      paginate,
      onTake,
      onCheckbox,
      onSaveExcel
    };
  },
});
</script>
