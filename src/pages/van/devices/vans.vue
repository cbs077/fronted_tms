<template>
  <bread-crumb text="VAN사별 현황" />
  <table-common-button no-take>
    <template #body>
      <div class="grow" />
      <excel-button  @click:excel="onSaveExcel" class="mr-1" />
    </template>
  </table-common-button>

  <div class="mb-6 rounded border border-sk-gray">
    <el-table
      :data="changeForm.vanData"
      fit
      height="320"
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
        prop="modelCode"
        label="단말기모델"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="deviceCount"
        label="단말기 수량"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="init"
        label="초기상태"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="running"
        label="사용중"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="idle"
        label="거래중지"
        align="center"
        header-align="center"
      />
    </el-table>
  </div>

  <hr class="my-6" />
  <bread-crumb text="VAN사별 현황 (상세)" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div v-if="!isVan" class="flex w-1/3">
      <div class="my-auto w-1/4">VAN사</div>

      <div class="col-span-4 my-auto">
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
        <el-checkbox v-model="changeForm.catModelCheck" label="단말기 모델명" size="large" />
        <el-checkbox v-model="changeForm.ssCodeCheck" label="주유소 코드" size="large" />
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
      <excel-button @click:excel="onSaveExcel1" class="mr-1" />
    </template>
  </table-common-button>

  <div class="mb-6 rounded border border-sk-gray">
    <el-table :data="changeForm.data" fit class="rounded" @row-click="onRowClicked">
      <el-table-column v-if="!isVan" prop="van" label="VAN사" align="center" />
      <el-table-column prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column  
        prop="swGroupNm"
        label="S/W Group"
        class-name="text-blue"
        class="text-blue"
      /> <!-- swGroupCode swGroupNm -->
      <el-table-column v-if="changeForm.catModelCheck==true" prop="modelName" label="단말기 모델" /> <!-- modelCode modelName -->
      <el-table-column v-if="changeForm.ssCodeCheck==true" prop="ssCode" label="주유소 코드" />
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
  <device-log-modal 
     v-model="deviceLog.modal" 
     :logs="deviceLog.data"
  />
</template>
<script lang="ts">
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { defineComponent, reactive, ref } from "vue";
import { computed, defineComponent, reactive } from "vue";
import  axios, { AxiosResponse } from "axios";
import writeXlsxFile from 'write-excel-file'
import { Search } from "@element-plus/icons-vue";
import * as _ from "lodash";

import BaseButton from "~/components/atoms/base-button.vue";
import ExcelButton from "~/components/molecules/excel-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceLogModal from "~/components/templates/modals/device-log.modal.vue";
import VanDetailModal from "~/components/templates/modals/van-detail.modal.vue";
import { getTerminalVan } from "~/hooks/api.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";
import { useStore } from "vuex";

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
    const { registrationHeaders_a: headers, devices, update, renmeObjectKey, renmeObjectAKey} = useDevice();
    const store = useStore();
    let isVan = computed(() => store.state.isVan); 

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
      pageCount: 20,
      total: 20
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
      checkAll: false,
      ssCodeCheck: false,
      catModelCheck: false,
    })
    const tableHeader = reactive({ ...initialState });

    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    let initialStateA = reactive({
      SW_GROUP_ID:"",
      CAT_MODEL_ID: "",
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),

      deviceModels: [],
      data: [],
      vanData: [],
      vanList: [{ value: "-" }],
      vanSelect: ""  
    })
    
    const changeForm = reactive({ ...initialStateA });

    const onRowClicked = (row: IDevice) => {
      deviceLog.data = row;
      console.log("aa", row)
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

    function common_query(){
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      if(changeForm.CAT_MODEL_ID != "") param = param + "&cat_model_id=" + changeForm.CAT_MODEL_ID
      if(changeForm.SW_GROUP_ID != "") param = param + "&sw_group_id=" + changeForm.SW_GROUP_ID

      excelValue = param 
      getTerminal(param).then( data => {
        setValue(data)
      })
      return param
    }

    const onSearch = (event) => {
      common_query()
    };

    const paginate = (page) => {
      pageVal.page = page
      common_query()
    }; 

    const onTake = (pageCount) => {
      store.state.pageCount = pageCount
      store.commit("pageCount", pageCount);
      common_query()
    }; 

    const onReset = (event) => {
      console.log("reset")
      changeForm.CAT_MODEL_ID = ""
      changeForm.SW_GROUP_ID = ""

      //defaultCheckbox()
      Object.assign(tableHeader, initialState);
    };

    const setTotalCount = (pageCount) => {
      pageVal.total = pageCount
      //console.log("setTotalCount", pageVal.total)
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
      let response = axios.get( '/api' +  '/swgroup/list?' + param,
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
      if( isVan == true) var vanId = window.localStorage.getItem("vanId")
      else var vanId = changeForm.vanSelect
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
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
          return {"key" :  n.CAT_MODEL_NM, "value": n.CAT_MODEL_ID}
        })
      });
    };

    async function getTerminalStat(param) {
      var vanId = window.localStorage.getItem("vanId")
      var token = window.localStorage.getItem("token")
      var param = param + "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get( '/api' +  '/terminal/stat/van/list?' + param,
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

    async function getTerminal(param) {
      if( isVan == true) var vanId = window.localStorage.getItem("vanId")
      else var vanId = changeForm.vanSelect
      var token = window.localStorage.getItem("token")
      var param = param + "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get( '/api' +  '/terminal/list?' + param,
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
      var data = getTerminalStat("page=1&page_count=1000").then( data => {
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
          fileName: 'VAN사별 현황.xlsx'
        })
      })
    }

    const onSaveExcel1 = () => {   
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
          fileName: 'VAN사별 현황(상세).xlsx'
        })
      })
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

    function setVanValue(data) {
      var list = data.list
      var dataArr = []
      for (var object of list){
        var obj = renmeObjectKey(object);
        dataArr.push(obj);
      }   
      setTotalCount(data.total_count)
      changeForm.vanData = dataArr 
    }

    function onSelectVanId(){
      console.log("onSelectVanId")
      getTerminalMdl()
    }

    getTerminalVan().then( data => {
        var list = data.list
        changeForm.vanList = _.map(list, function square(n) {
          return {"key": n.VAN_ID, "value": n.VAN_NM}
        })
    })

    const selectOption = ref();
    Object.assign(tableHeader, initialState);
    getTerminal("page=1&page_count="+store.state.pageCount).then( data => {
      setValue(data)
    })
    getTerminalStat("page=1&page_count="+store.state.pageCount).then( data => {
      setVanValue(data)
    })

    getTerminalMdl()
    getSwGroup()

    return {
      update,
      vanDetail,
      query,
      deviceLog,
      devices,
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
      onSaveExcel1,
      pageVal,
      excelValue,
      onReset,
      getSwGroup,
      getTerminalMdl,
      getTerminalVan,
      onSelectVanId
    };
  },
});
</script>

<style lang="scss">
.is-right.el-table__cell {
  color: blue;
}
</style>
