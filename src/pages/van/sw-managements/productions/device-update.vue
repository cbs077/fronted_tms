<template>
  <bread-crumb text="단말기 Update 이력" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div v-if="!isVan" class="my-3 flex flex-row">
      <div class="my-auto w-1/12">VAN사</div>

      <div class="my-auto w-5/12 pr-5">
        <el-select
          v-model="changeForm.vanSelect"
          clearable
          placeholder="선택"
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

    <div class="my-3">
      <div class="my-3 flex">
        <div class="my-auto w-1/12">Update 일</div>
        <div class="flex w-4/12">
          <div class="block">
            <el-date-picker v-model="condition.start" size="large" />
          </div>
          <p class="mx-auto grow translate-y-1 text-center transition">~</p>
          <div class="block">
            <el-date-picker v-model="condition.end"  size="large" />
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
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="my-auto w-1/12 text-center">검색어</div>
        <div class="flex w-4/12">
          <el-input v-model="query" size="large" placeholder="Please Input" />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">단말기 번호</div>
        <div class="flex w-4/12">
          <el-input  v-model="changeForm.deviceNumber" size="large" placeholder="Please Input" />
        </div>
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
    </template>
  </table-common-button>


  <div class="rounded border border-sk-gray">
    <el-table :data="changeForm.data" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="swGroupNm" label="S/W Group명" align="center" />
      <el-table-column prop="swVersion" label="S/W Version" align="center" />
      <el-table-column prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column prop="request" label="요청내용" align="center" />
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

  <device-update-detail-modal 
    v-model="deviceUpdateDetail.modal"
    :device="deviceUpdateDetail.data"
    :headerDate="deviceUpdateDetail.headerDate"
    :fileInfo="deviceUpdateDetail.fileInfo"
  />
</template>
<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ElTable, ElTableColumn } from "element-plus";
import { defineComponent, reactive, computed, ref } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import writeXlsxFile from 'write-excel-file'

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceUpdateDetailModal from "~/components/templates/modals/device-update-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";
import { getTerminalVan } from "~/hooks/api.hooks";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";
import { useStore } from "vuex";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,
    DeviceUpdateDetailModal,
  },
  setup() {
    let { registrationHeaders: headers, devices, update, renmeObjectKey, renmeObjectAKey} = useDevice();
    const store = useStore();
    let isVan = computed(() => store.state.isVan); 

    const searchOptions = [
      { id: 1, key: "sw_group_id", value: "S/W Group 코드" },
      { id: 2, key: "sw_version", value: "S/W Version" },
    ];
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
      data: {},
      fileInfo: {},
      headerDate: {}
    });

    const condition = reactive({
      start: new Date(),
      end: new Date(),
    });
////////////////
    // page
    let pageVal = reactive({
      page: 1,
      pageCount: 20,
      total: 20
    })

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "-" }],
      swVersions: [{ value: "-" }],
      deviceNumber: "",
      vanList: [{ value: "-" }],
      vanSelect: ""
    })

    let excelValue = "";
    function common_query(){
      console.log("searchOptions", changeForm.deviceNumber)
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&search_start_dt=" + dateYYYYMMDD(condition.start) + "&search_end_dt=" + dateYYYYMMDD(condition.end)
      if(query.value != "") param = param + "&" + selectOption.value+ "=" + query.value
      if(changeForm.deviceNumber != "") param = param + "&cat_serial_no=" + changeForm.deviceNumber
      
      excelValue = param 
      getTerminal(param).then( data => {
        setValue(data)
      })
      return param
    }
    
    const paginate = (page) => {
      pageVal.page = page
      common_query()
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      store.state.pageCount = pageCount
      store.commit("pageCount", pageCount);
      common_query()
    }; 

    const onSearch = (event) => {
      common_query()
      console.log("store.state.pageCount", store.state.pageCount)
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
      changeForm.data =dataArr
    }

    const onRowClicked = (row) => {
      deviceUpdateDetail.headerDate = row
      var swGroupCode = row.swGroupCode
      var swVersion = row.swVersion
      var param = "page=1&page_count=20&sw_group_id=" + swGroupCode + "&sw_version=" + swVersion

      getDetail(param).then( data => {     
        var list = data.list
        var dataArr = []
        for (var object of list){
          var obj = renmeObjectKey(object);
          dataArr.push(obj);
        }  

        let status = _.countBy(dataArr, (rec) => {
            return rec.resultCode == "" ? 'pass': 'fail';
        });
        
        Object.assign(deviceUpdateDetail.headerDate, status);
        console.log("deviceUpdateDetail.headerDate", deviceUpdateDetail.headerDate)
        deviceUpdateDetail.data = dataArr 

        getSwVersion(param).then( data => {     
          var list = data.list
          var dataArr = []
          for (var object of list){
            var obj = renmeObjectKey(object);
            dataArr.push(obj);
          }   
          //계속 상세보기 누르면 이상함
          console.log("dataArr1", dataArr)

          deviceUpdateDetail.fileInfo = dataArr[0]
          deviceUpdateDetail.modal = true
        })
      })
    };

    async function getSwVersion(param) {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = param + "&van_id="+ vanId    
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get( '/api' +  '/swoprmg/upgrade/list?' + param,
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

    async function getDetail(param) {
       var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = param + "&van_id="+ vanId + "&gubun_code=FA"
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get( '/api' +  '/swoprmg/up/moniter/default?' + param,
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

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
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
          return {"value": n.CAT_MODEL_NM}
        })
      });
    };

    async function getTerminal(param) {
      if(isVan.value) var vanId = window.localStorage.getItem("vanId")
      else var vanId = changeForm.vanSelect

      var token = window.localStorage.getItem("token")
      var param = param + "&van_id="+ vanId + "&gubun_code=FA"
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get( '/api' +  '/swoprmg/up/moniter/default?' + param,
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
        var header = ["VAN_ID", "VAN_NM", "CAT_MODEL_ID", "CAT_SERIAL_NO", "DESCRIPTION", "GUBUN","MANAGER_NM", "SW_GROUP_ID", "SW_GROUP_NM", "SW_VERSION", "UPDATE_DT",   ]
        //_.keys(data.list[0])

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
          fileName: 'S/W 업데이트.xlsx'
        })
      })
    }
    
    function onSave() {
      swCreate.modal = false
      swCreate.data = {}
    }   

    const onReset = (event) => {
      console.log("reset")
      searchOptions.value = ""
      condition.start = new Date()
      condition.end = new Date()
      query.value = ""
      changeForm.vanSelect = ""
      changeForm.deviceNumber = ""
    };
    getTerminalVan().then( data => {
        var list = data.list
        changeForm.vanList = _.map(list, function square(n) {
          return {"key": n.VAN_ID, "value": n.VAN_NM}
        })
    })

    getTerminalMdl()
    common_query()

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
      renmeObjectKey,    
      condition,
      onReset,    
      isVan,
    };
  },
});
</script>
