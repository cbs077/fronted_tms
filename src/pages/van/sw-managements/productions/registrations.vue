<template>
  <bread-crumb text="S/W 조회 및 등록" />
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
            v-for="item in SWsearchOptions"
            :key="item.value"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </div>

      <div class="my-auto mr-6 w-1/12 text-center">검색어</div>

      <div class="w-5/12 pr-5">
        <el-input
          size="large"
          v-model="query" 
          placeholder="Please Input"
          :suffix-icon="Search"
        />
      </div>
    </div>

    <options-search-button 
      @click:search="onSearch"
      @click:reset="onReset"
    />
  </div>

  <table-common-button>
    <template #body>
      <div class="grow" />
      <excel-button  @click:excel="onSaveExcel" class="mr-1" />
      <base-button
        text="S/W 등록"
        class="ml-1"
        @click="swCreate.modal = true"
      />
    </template>
  </table-common-button>
  <div class="rounded border border-sk-gray">
    <el-table :data="changeForm.data" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column
        prop="swGroupCode"
        label="S/W Group 코드"
        align="center"
      />
      <el-table-column prop="swGroupNm" label="S/W Group 명" align="center" />
      <el-table-column prop="swVersion" label="S/W Version" align="center" />
      <el-table-column prop="swFileNm" label="Upload 파일명" align="center" />
      <el-table-column
        prop="swFileSize"
        label="파일 Size (byte)"
        align="center"
      />
      <el-table-column prop="regDt" label="등록일" align="center" />
      <el-table-column prop="regUser" label="등록자" align="center" />
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

  <sw-detail-modal 
    v-model="swDetail.modal" 
    :device="swDetail.data"
    @click:positive="onSaveDetail"
  />
  <sw-create-modal @click:positive="onSave" v-model="swCreate.modal" />
</template>
<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ElTable, ElTableColumn } from "element-plus";
import { defineComponent, reactive, ref } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import SwCreateModal from "~/components/templates/modals/sw-create.modal.vue";
import SwDetailModal from "~/components/templates/modals/sw-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    TableCommonButton,
    ElTableColumn,
    ElTable,
    BaseButton,
    SwDetailModal,
    SwCreateModal,
  },
  setup() {
    const { registrationHeaders: headers, devices, update, renmeObjectKey } = useDevice();
    const { SWsearchOptions } = useConst();
    const selectOption = ref();

    const swDetail = reactive({
      modal: false,
    });

    const swCreate = reactive({
      modal: false,
    });

    const onRowClicked = (row: IDevice) => {
      swDetail.data = row;
      swDetail.modal = true;
    };

////////////////
    // page
    const paginate = (page) => {
      //console.log("paginate", page);
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      //console.log("onTake", pageCount)
      pageVal.pageCount = pageCount
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    const query = ref("");
    let pageVal = reactive({
      page: 1,
      pageCount: 10,
      total: 10
    })

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "-" }],
      swVersions: [{ value: "-" }],
      data: []
    })

    let excelValue = "";

    const onSearch = (event) => {
      console.log()
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      excelValue = param //엑셀 다운로드에서 필요함.
      getTerminal(param).then( data => {
        setValue(data)
      })
    };

    const onReset = (event) => {
      console.log("reset")
      selectOption.value = ""
      query.value = ""
      
    };

    const seTtotalCount = (pageCount) => {
      pageVal.total = pageCount
    }

    function setValue(data) {
      var list = data.list
      var dataArr = []
      for (var object of list){
        var obj = renmeObjectKey(object);
        dataArr.push(obj);
      }   
      seTtotalCount(data.total_count)
      changeForm.data = dataArr

    }

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = "van_id="+ vanId      
      if(token == null) token = "" 

      let data: any[] = [];

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
          return {"value": n.CAT_MODEL_NM}
        })
      });
    };


    async function getTerminal(param) {
      //console.log("getTerminal",param)
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = param + "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/swoprmg/list?' + param,
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
      console.log("onSaveDetail")
      swDetail.modal =false
      getTerminalMdl()
      getTerminal("page=1&page_count=10").then( data => {
        setValue(data)
      })     
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
        XLSX.writeFile(wb, 'swOperation.xlsx');
      })
    }
    function onSave() {
      swCreate.modal = false
      swCreate.data = {}
      getTerminalMdl()
      getTerminal("page=1&page_count=10").then( data => {
        setValue(data)
      })
    }

    getTerminalMdl()
    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
    })

    return {
      selectOption,
      onRowClicked,
      swCreate,
      swDetail,
      headers,
      devices,
      SWsearchOptions,
      Search,
      //
      query,
      pageVal, 
      changeForm,
      onSearch,
      excelValue,
      onSaveExcel,
      onSave,
      paginate,
      onTake,
      update,
      renmeObjectKey,
      onReset,
      onSaveDetail
    };
  },
});
</script>
