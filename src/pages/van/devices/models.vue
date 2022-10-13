<template>
  <bread-crumb text="단말기 모델 조회 및 등록" />

  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div v-if="!isVan" class="my-3 flex flex-row">
      <div class="my-auto mr-6 w-1/12">VAN사</div>

      <div class="my-auto w-5/12 pr-5">
        <el-select
          v-model="changeForm.vanSelect"
          clearable
          placeholder="선택"
          @change="onSelectVanId"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in changeForm.vanList"
            :key="item.value"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </div>
    </div>

    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6 w-1/12">모델명</div>

      <div class="my-auto w-5/12 pr-5">
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
import { defineComponent, reactive, computed, ref } from "vue";
import writeXlsxFile from 'write-excel-file'

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import ConfirmModal from "~/components/templates/modals/confirm.modal.vue";
import ModelCreateModal from "~/components/templates/modals/model-create.modal.vue";
import ModelDetailModal from "~/components/templates/modals/model-detail.modal.vue";
import { useDevice, } from "~/hooks/devices.hooks";
import { getTerminalVan } from "~/hooks/api.hooks";
import { useStore } from "vuex";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,

    ConfirmModal,
    ModelDetailModal,
    ModelCreateModal,
    BaseButton,
  },
  mounted() {
    console.log("mounted"); 
    this.init();
  },  
  setup() {
    let { registrationHeaders: headers, devices, renmeObjectKey, renmeObjectAKey } = useDevice();
    const store = useStore();
    const query = ref("");
    let isVan = computed(() => store.state.isVan); 

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

    const onSaveDetail = ( val : any) => {
      modelDetail.modal = false
    }

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

    const data = reactive({
      slectData: [],
    });   

    let pageVal = reactive({
      page: 1,
      pageCount: 20,
      total: 20
    })

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [],
      swVersions: [{ value: "-" }],
      data: [],
      vanList: [{ value: "-" }],
      vanSelect: ""
    })

    let excelValue = "";

    const onRowClicked = (row) => {
      console.log("row", row)
      modelDetail.data = row;
      modelDetail.modal = true;
    };

    const paginate = (page) => {
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      //검색어
      if( query.value != "") { param = param + "&cat_model_nm=" + query.value }
      if( selectOption.value != undefined ) param = param + "&cat_model_id=" + selectOption.value 
      
      console.log("paginate:", param, selectOption.value)
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      console.log("onTake")
      store.state.pageCount = pageCount
      store.commit("pageCount", pageCount);
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount

      if( query.value != "") { param = param + "&cat_model_nm=" + query.value }
      if( selectOption.value != undefined) param = param + "&cat_model_id=" + selectOption.value 
      
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 

    const onSearch = (event) => {
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      
      if(query.value != "") { param = param + "&cat_model_id=" + query.value }
      
      excelValue = param //엑셀 다운로드에서 필요함.
      getTerminal(param).then( data => {
        setValue(data)
      })
    };

    const onReset = (event) => {
      selectOption.value = ""
      query.value = ""
      changeForm.vanSelect =""
    };

    const setTotalCount = (pageCount) => {
      pageVal.total = pageCount
    }

    function setValue(data) {
      var list = data.list
      var dataArr = []
      for (var object of list){
        var obj = renmeObjectKey(object);
        dataArr.push(obj);
      }   
      setTotalCount(data.total_count)
      changeForm.data = dataArr
    }

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      if( isVan == true) var vanId = window.localStorage.getItem("vanId")
      else var vanId = changeForm.vanSelect
      var param = "van_id="+ vanId      
      if(token == null) token = "" 

      let data: any[] = [];

      let response = axios.get( '/api' +  '/terminal_mdl?' + param,
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
      if(isVan.value) var vanId = window.localStorage.getItem("vanId")
      else var vanId = changeForm.vanSelect

      var token = window.localStorage.getItem("token")
      var param = param + "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get( '/api' +  '/terminal_mdl/list?' + param,
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

    const onSaveExcel = () => {   
      var data = getTerminal("page=1&page_count=1000"+ excelValue).then( data => {
        const columns = [{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20}]

        if(data.list == undefined) return
        var header = _.keys(data.list[0])
 
        var dataT = []
        var arr = []

        header.forEach((val)=>{  
          
          arr.push({
            value:renmeObjectAKey[val],
            backgroundColor: '#eeeeee',
            fontWeight: 'bold',
            align: 'center'
          })
        })
        dataT.push(arr)

        data.list.forEach((value)=>{
          var list = []
          header.forEach((val)=>{
            list.push({value: value[val]})
          })
          dataT.push(list)
        })

        writeXlsxFile(
          dataT, { 
          columns,
          fileName: '단말기모델 조회.xlsx'
        })
      })
    }

    function onSave(event) {
      modelCreate.modal = false
      modelCreate.data = {}
      getTerminalMdl()
      getTerminal("page=1&page_count="+store.state.pageCount).then( data => {
        setValue(data)
      })   
    }

    function onSelectVanId(){
      console.log("onSelectVanId")
      getTerminalMdl()
    }

    function init(){
      getTerminalVan().then( data => {
          var list = data.list
          changeForm.vanList = _.map(list, function square(n) {
            return {"key": n.VAN_ID, "value": n.VAN_NM}
          })
      })

      getTerminalMdl()
      getTerminal("page=1&page_count="+store.state.pageCount).then( data => {
        setValue(data)
      })
    }

    return {
      modelCreate,
      onRowClicked,
      selectOption,
      modelDetail,
      deviceUnRegistration,
      query,
      headers,
      devices,
      displayOptions,
      pageVal, 
      changeForm,
      renmeObjectAKey ,
      onSearch,
      onReset,
      excelValue,
      onSaveExcel,
      paginate,
      onTake,
      onSave,
      isVan,
      onSaveDetail,
      onSelectVanId,
      init
    };
  },
});
</script>
