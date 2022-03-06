<template>
  <bread-crumb text="단말기 Update 이력" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3">
      <div class="my-3 flex">
        <div class="my-auto w-1/12">Update 일</div>
        <div class="flex w-4/12">
          <div class="block">
            <el-date-picker size="large" />
          </div>
          <p class="mx-auto grow translate-y-1 text-center transition">~</p>
          <div class="block">
            <el-date-picker size="large" />
          </div>
        </div>
      </div>

      <div class="my-3 flex">
        <div class="my-auto w-1/12">검색조건</div>
        <div class="flex w-4/12">
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
        <div class="flex w-4/12">
          <el-input size="large" placeholder="Please Input" />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">단말기 번호</div>
        <div class="flex w-4/12">
          <el-input size="large" placeholder="Please Input" />
        </div>
      </div>
    </div>
    <options-search-button 
      @click:search="onSearch"
    />
  </div>

  <table-common-button />

  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="swGroupNm" label="S/W Group명" align="center" />
      <el-table-column prop="swVersion" label="S/W Version" align="center" />
      <el-table-column prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column prop="swGroupCode" label="요청내용" align="center" />
      <el-table-column prop="regDt" label="요청일시" align="center" />
      <el-table-column prop="status" label="응답코드" align="center" />
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

  <device-update-detail-modal v-model="deviceUpdateDetail.modal" />
</template>
<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ElTable, ElTableColumn } from "element-plus";
import { defineComponent, reactive, ref } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceUpdateDetailModal from "~/components/templates/modals/device-update-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,
    DeviceUpdateDetailModal,
  },
  setup() {
    let { registrationHeaders: headers, devices, update, renmeObjectKey } = useDevice();
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

    const deviceUpdateDetail = reactive({
      modal: false,
    });

    const onRowClicked = (row) => {
      deviceUpdateDetail.modal = true;
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
    let pageVal = reactive({
      page: 1,
      pageCount: 10,
      total: 10
    })

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "-" }],
      swVersions: [{ value: "-" }],
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

    const seTtotalCount = (pageCount) => {
      pageVal.total = pageCount
      //console.log("seTtotalCount", pageVal.total)
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

        //console.log("changeForm.deviceModels", changeForm.deviceModels)
      });
    };


    async function getTerminal(param) {
      //console.log("getTerminal",param)
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = param + "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/swoprmg/up/list?' + param,
          {
            headers: {
                Authorization: token
            }
          }
        )
        .then(response => {
          return response.data;
        });
      //console.log("response", responset)
      return responset
    };

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
    }


    getTerminalMdl()
    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
    })
    return {
      onRowClicked,
      deviceUpdateDetail,
      selectOption,
      update,
      query,
      headers,
      devices,
      searchOptions,
      displayOptions,
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
      renmeObjectKey          
    };
  },
});
</script>
