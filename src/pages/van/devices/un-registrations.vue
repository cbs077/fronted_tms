<template>
  <bread-crumb text="단말기 삭제" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">검색조건</div>

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
            :value="item.value"
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

  <table-common-button>
    <template #body>
      <base-button class="ml-1" @click="deviceUnRegistration.modal = true">
        <template #button-body>
          <div class="flex justify-center">
            <trash-icon class="mr-3 w-5" /> 삭제
          </div>
        </template>
      </base-button>
      <div class="grow" />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @select="onCheckboxT" @row-click="onRowClicked">
      <el-table-column v-model="data.checkbox" type="selection" primary-text class="text-black" />
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

  <confirm-modal
    v-model="deviceUnRegistration.modal"
    title="Confirm"
    positive-text="삭제"
    negative-text="취소"
    @click:positive="onDeleteItems"
    :text="deviceUnRegistration.text"
  />
</template>
<script lang="ts">
import  axios, { AxiosResponse } from "axios";
import * as XLSX from 'xlsx/xlsx.mjs';
import { Search } from "@element-plus/icons-vue";
import { TrashIcon } from "@heroicons/vue/outline";
import { defineComponent, reactive, ref } from "vue";
import * as _ from "lodash";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import ConfirmModal from "~/components/templates/modals/confirm.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    BaseButton,
    TableCommonButton,
    TrashIcon,
    ConfirmModal,
  },
  setup() {
    let { registrationHeaders_a: headers, devices, update, renmeObjectKey} = useDevice();
    const { searchOptions } = useConst();
    const query = ref("");
    const displayOptions = reactive({
      all: false,
      modelCode: false,
      swGroupCode: false,
      swVersion: false,
      status: true,
      registrationDate: true,
      lastAccessDate: true,
    });
    const selectOption = ref();

    const deviceUnRegistration = reactive({
      modal: false,
      text: "선택한 항목을 삭제 하시겠습니까?",
    });
// 없애야 함.
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

    let excelValue = "";
    let pageVal = reactive({
      page: 1,
      pageCount: 10,
      total: 10
    })

    let data = reactive({
      checkbox: 1,
    })

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
    const seTtotalCount = (pageCount) => {
      pageVal.total = pageCount
    }

    const onCheckbox = (name, tst) => {
      tableHeader[name] = tst
    }

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

    async function delTerminal(deviceNumber) {
      var vanId = window.localStorage.getItem("vanId")
      var token = window.localStorage.getItem("token")
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.delete('http://tms-test-server.p-e.kr:8081/terminal?',
          { 
            data: {
              "VAN_ID" : vanId,
              "CAT_SERIAL_NO": deviceNumber,
            },
             headers: {
                Authorization: token
            }
          }
        )
        .then(response => {
          getTerminal("page=1&page_count=10").then( data => {
            setValue(data)
            defaultCheckbox()
          })

          return response.data;
        });
      return responset
    };

    const onSaveDetail = ( val : any) => {
      //console.log("onSaveDetail", val.modelCode)
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

    function onDeleteItems() {
      data.checkbox.forEach(function(value, index) {
        delTerminal(value)
        console.log('array index: ' + index + ' value : ' + value);
      })
      deviceUnRegistration.modal = false
      console.log("onDeleteItems")
    }

    function onRowClicked() {  
      console.log("onRowClicked", data.checkbox)
    }

    function onCheckboxT(event) {
      console.log("onRowClicked", event)
      data.checkbox = _.map(event, "deviceNumber")
      console.log(" data.checkbox ",  data.checkbox )
    }

    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
      defaultCheckbox()
    })
    return {
      selectOption,
      update,
      deviceUnRegistration,
      query,
      headers,
      devices,
      searchOptions,
      displayOptions,
      // 
      onSearch,   
      tableHeader,
      paginate,
      onTake,
      onCheckbox,
      onSaveExcel,
      pageVal,
      excelValue,
      onDeleteItems,
      onRowClicked,
      delTerminal,
      data,
      onCheckboxT
    };
  },
});
</script>
