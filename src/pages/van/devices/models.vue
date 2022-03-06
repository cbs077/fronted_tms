<template>
  <bread-crumb text="단말기 모델 조회" />

  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">모델명</div>

      <div class="my-auto ml-5 w-5/12">
        <el-select
          v-model="selectOption"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in changeForm.deviceModels"
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
      <excel-button  @click:excel="onSaveExcel" class="mr-1" />
      <base-button
        text="단말기 모델 등록"
        class="ml-1 w-36"
        @click="modelCreate.modal = true"
      />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="changeForm.data" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="modelCode" label="모델코드" align="center" />
      <el-table-column prop="modelName" label="모델명" align="center" />
      <el-table-column prop="description" label="설명" align="center" />
      <el-table-column prop="applicationDate" label="등록일" align="center" />
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
    :text="deviceUnRegistration.text"
  />

  <model-detail-modal 
    v-model="modelDetail.modal"
    :device="modelDetail.data"
    @click:positive="onSaveDetail"
   />
  <model-create-modal @click:positiveA="onSave" v-model="modelCreate.modal" />
</template>
<script lang="ts">
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import ConfirmModal from "~/components/templates/modals/confirm.modal.vue";
import ModelCreateModal from "~/components/templates/modals/model-create.modal.vue";
import ModelDetailModal from "~/components/templates/modals/model-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,

    ConfirmModal,
    ModelDetailModal,
    ModelCreateModal,
    BaseButton,
  },
  setup() {
    let { registrationHeaders: headers, devices, renmeObjectKey} = useDevice();
    //const { deviceModels } = useConst();
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

    const modelDetail = reactive({
      modal: false,
    });

    const modelCreate = reactive({
      modal: false,
    });

    const onRowClicked = (row) => {
      modelDetail.data = row;
      modelDetail.modal = true;
    };

    const data = reactive({
      slectData: [],
    });   

    ////////////////
    let pageVal = reactive({
      page: 1,
      pageCount: 10,
      total: 10
    })

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [],
      swVersions: [{ value: "-" }],
      data: []
    })

    let excelValue = "";

    const paginate = (page) => {
      //console.log("paginate", page);
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      //검색어
      if(query.value != "") { param = param + "&cat_model_nm=" + query.value }
      else if( selectOption.value != "") param = param + "&cat_model_id=" + selectOption.value 
      
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      console.log("onTake", pageCount)
      pageVal.pageCount = pageCount
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount

      if(query.value != "") { param = param + "&cat_model_nm=" + query.value }
      else if( selectOption.value != "") param = param + "&cat_model_id=" + selectOption.value 
      
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 

    const onSearch = (event) => {
      console.log("onSearch11", selectOption)
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      
      if(query.value != "") { param = param + "&cat_model_id=" + query.value }
      else { param = param + "&cat_model_id=" + selectOption.value }
      
      console.log("param" , param)
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
          return {"key": n.CAT_MODEL_ID, "value": n.CAT_MODEL_NM}
        })
        changeForm.deviceModels.unshift({"key": "", "value": "전체"})
      });
    };


    async function getTerminal(param) {
      //console.log("getTerminal",param)
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = param + "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/terminal_mdl/list?' + param,
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
        XLSX.writeFile(wb, 'terminalmdl.xlsx');
      })
    }

    function onSave(event) {
      modelCreate.modal = false
      modelCreate.data = {}
      getTerminalMdl()
      getTerminal("page=1&page_count=10").then( data => {
        setValue(data)
      })   
      //console.log("onSave", event)
    }

    const onSaveDetail = ( val : any) => {
      console.log("onSaveDetail")
      modelDetail.modal =false
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
      modelCreate,
      onRowClicked,
      selectOption,
      modelDetail,
      //update,
      deviceUnRegistration,
      query,
      headers,
      devices,
      displayOptions,
      //
      pageVal, 
      changeForm,
      onSearch,
      onReset,
      excelValue,
      onSaveExcel,
      paginate,
      onTake,
      onSave,
      onSaveDetail
    };
  },
});
</script>
