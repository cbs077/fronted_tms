<template>
  <bread-crumb text="단말기 Update 이력" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
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
    />
  </div>

  <table-common-button>
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
import { defineComponent, reactive, ref } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import writeXlsxFile from 'write-excel-file'

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceUpdateDetailModal from "~/components/templates/modals/device-update-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,
    DeviceUpdateDetailModal,
  },
  setup() {
    let { registrationHeaders: headers, devices, update, renmeObjectKey } = useDevice();
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
    })

    let excelValue = "";
    function common_query(){
      console.log("searchOptions", changeForm.deviceNumber)
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
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
      pageVal.pageCount = pageCount
      common_query()
    }; 

    const onSearch = (event) => {
      common_query()
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
      changeForm.data =dataArr
      //update(dataArr); 
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
        deviceUpdateDetail.data = dataArr 
        deviceUpdateDetail.modal = true
      })

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
    };

    async function getSwVersion(param) {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = param + "&van_id="+ vanId    
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/swoprmg/upgrade/list?' + param,
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

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/swoprmg/up/moniter/default?' + param,
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
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = param + "&van_id="+ vanId + "&gubun_code=FA"
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/swoprmg/up/moniter/default?' + param,
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
        const columns = [{},{},{width: 15},{width: 15},{ width: 15 },{width: 15},{width: 15},{width: 20},{width: 20}]

        var headerData = 
          ["VAN_ID",  "CAT_SERIAL_NO", "CAT_MODEL_ID", "SW_GROUP_ID", ,"SW_VERSION", "GUBUN", "STATUS", "REG_DT", "LAST_USE_DT"]
        var headerName =
          ["VNA사명",  "단말기번호", "단말기모델코드", "S/W 그룹 코드", "S/W 버전", "구분", "상태", "등록일", "최종접속일"]
        
        var dataT = []
        var arr = []

        headerName.forEach((val)=>{
          arr.push({
            value:val,
            fontWeight: 'bold',
            backgroundColor: '#bfbfbf',
            width: 120
          })
        })
        dataT.push(arr)

        data.list.forEach((value)=>{
          var list = []
          headerData.forEach((val)=>{
            list.push({value: value[val]})
          })
          dataT.push(list)
        })


        writeXlsxFile(dataT, {
          columns,
          fileName: 'S/W 업데이트.xlsx'
        })
      })
    }
    
    function onSave() {
      swCreate.modal = false
      swCreate.data = {}
    }


    getTerminalMdl()
    getTerminal("page=1&page_count=20").then( data => {
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
      renmeObjectKey,    
      condition    
    };
  },
});
</script>
