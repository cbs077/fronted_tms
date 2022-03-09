<template>
  <bread-crumb text="VAN사별 현황" />
  <table-common-button no-take>
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
    </template>
  </table-common-button>

  <div class="mb-6 rounded border border-sk-gray">
    <el-table
      :data="devices"
      fit
      height="300"
      class="rounded"
      :span-method="arraySpanMethod"
    >
      <el-table-column
        prop="van"
        label="VAN사명"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="modelName"
        label="단말기모델"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="deviceCount"
        label="단말기 수량"
        align="right"
        header-align="center"
      />
      <el-table-column
        prop="init"
        label="초기상태"
        align="right"
        header-align="center"
      />
      <el-table-column
        prop="running"
        label="사용중"
        align="right"
        header-align="center"
      />
      <el-table-column
        prop="idle"
        label="휴면상태"
        align="right"
        header-align="center"
      />
    </el-table>
  </div>

  <hr class="my-6" />
  <bread-crumb text="VAN사별 현황 (상세)" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="flex w-1/3">
        <div class="my-auto w-1/4">단말기 모델</div>
        <div class="my-auto w-3/4 pr-5">
          <el-select clearable  v-model="changeForm.CAT_MODEL_ID" placeholder="선택" size="large" class="w-full">
            <el-option
              v-for="item in changeForm.deviceModels"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="flex w-1/3">
        <div class="my-auto w-1/4">S/W 그룹명</div>
        <div class="my-auto w-3/4 pr-5">
          <el-select clearable v-model="changeForm.SW_GROUP_ID" placeholder="선택" size="large" class="w-full">
            <el-option
              v-for="item in changeForm.deviceGroup"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="flex w-1/3">
        <div class="my-auto w-1/4">단말기 상태</div>
        <div class="my-auto w-3/4 pr-5">
          <el-select clearable  v-model="query" placeholder="선택" size="large" class="w-full">
            <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>

    <div class="my-6 flex flex-row">
      <div class="my-auto block w-1/12 align-middle">결과 데이터</div>
      <div class="flex">
        <el-checkbox label="전체" size="large" />
        <el-checkbox label="단말기 모델명" size="large" />
        <el-checkbox label="주유소 코드" size="large" />
      </div>
    </div>
    <options-search-button
      @click:search="onSearch"
      @click:reset="onReset"
    />
  </div>

  <table-common-button
    @update:take="onTake"
  >
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
    </template>
  </table-common-button>

  <div class="mb-6 rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column
        prop="swGroupNm"
        label="S/W Group명"
        class-name="text-blue"
        class="text-blue"
      />
      <el-table-column prop="regDt" label="등록일" />
      <el-table-column prop="firstUseDt" label="최초VC" />
      <el-table-column prop="lastUseDt" label="마지막VC" />
      <el-table-column prop="idle" label="상태" />
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

  <van-detail-modal v-model="vanDetail.modal" />
  <device-log-modal v-model="deviceLog.modal" />
</template>
<script lang="ts">
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { defineComponent, reactive, ref } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as XLSX from 'xlsx/xlsx.mjs';
import { Search } from "@element-plus/icons-vue";
//import { ElTable, ElTableColumn, ElPagination } from "element-plus";
//rt Pagination from '@/components/Pagination'
import * as _ from "lodash";

import BaseButton from "~/components/atoms/base-button.vue";
import ExcelButton from "~/components/molecules/excel-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceLogModal from "~/components/templates/modals/device-log.modal.vue";
import VanDetailModal from "~/components/templates/modals/van-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

interface SpanMethodProperties {
  row: IDevice;
  column: TableColumnCtx<IDevice>;
  rowIndex: number;
  columnIndex: number;
}
export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    ExcelButton,
    BaseButton,
    TableCommonButton,

    VanDetailModal,
    DeviceLogModal,
  },
  setup() {
    const { registrationHeaders_a: headers, devices, update, renmeObjectKey} = useDevice();
    //const { searchOptions } = useConst();
    const searchOptions =  [
      { id: 1, key: "sw_group_id", value: "초기상태" },
      { id: 2, key: "sw_version", value: "사용중" },
      { id: 3, key: "cat_serial_no", value: "휴면상태" },
    ]
    const query = ref("");
    const displayOptions = reactive({
      all: true,
      modelCode: true,
      stationCode: true,
    });

    const vanDetail = reactive({
      modal: false,
    });

    const deviceLog = reactive({
      modal: false,
    });

    let pageVal = reactive({
      page: 1,
      pageCount: 10,
      total: 10
    })

    let initialState = reactive({
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
    const tableHeader = reactive({ ...initialState });

    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    let initialStateA = reactive({
      SW_GROUP_ID:"",
      CAT_MODEL_ID: "",
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),

      deviceModels: [],
    })
    
    const changeForm = reactive({ ...initialStateA });

    const onRowClicked = (row: IDevice) => {
      deviceLog.modal = true;
    };

    const arraySpanMethod = ({
      rowIndex,
      columnIndex,
    }: // eslint-disable-next-line unicorn/consistent-function-scoping
    SpanMethodProperties) => {
      if (rowIndex === devices.length - 1) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    };
    let excelValue = "";
////
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
      //console.log("paginate", page);
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
        //defaultCheckbox()
      })
    }; 

    const onTake = (pageCount) => {
      //console.log("onTake", pageCount)
      pageVal.pageCount = pageCount
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
        //defaultCheckbox()
      })
    }; 

    const onReset = (event) => {
      console.log("reset")
      selectOption.value = ""
      query.value = ""

      defaultCheckbox()
      Object.assign(tableHeader, initialState);
    };

    const seTtotalCount = (pageCount) => {
      pageVal.total = pageCount
      //console.log("seTtotalCount", pageVal.total)
    }

    const onCheckbox = (name, tst) => {
      tableHeader[name] = tst
    //  tableHeader.checkAll["van"] = true
    }

    function getSwGroup() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
      let response = axios.get('http://tms-test-server.p-e.kr:8081/swgroup/list?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.deviceGroup = _.map(list, function square(n) {
          return {"key" :  n.SW_GROUP_NM, "value": n.SW_GROUP_ID}
        })
      });
    };

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
      let response = axios.get('http://tms-test-server.p-e.kr:8081/terminal_mdl?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.deviceModels = _.map(list, function square(n) {
          return {"key" :  n.CAT_MODEL_NM, "value": n.CAT_MODEL_ID}
        })
      });
    };

    async function getTerminal(param) {
      var vanId = window.localStorage.getItem("vanId")
      var token = window.localStorage.getItem("token")
      var param = param + "&van_id="+ vanId
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
      return responset
    };


    const onSaveDetail = ( val : any) => {
      deviceDetail.modal = false
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
    getTerminalMdl()
    getSwGroup()

    return {
      update,
      vanDetail,
      query,
      deviceLog,
      devices,
      searchOptions,
      displayOptions,
      arraySpanMethod,
      onRowClicked,
      //
      devices,
      update,
      searchOptions,
      Search,
      changeForm,
      onSearch,
      paginate,
      onTake,
      onCheckbox,
      onSaveExcel,
      pageVal,
      excelValue,
      onReset,
      getSwGroup,
      getTerminalMdl
    };
  },
});
</script>

<style lang="scss">
.is-right.el-table__cell {
  color: blue;
}
</style>
