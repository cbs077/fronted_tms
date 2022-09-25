<template>
  <bread-crumb text="단말기 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div v-if="!isVan" class="my-3 flex flex-row">
      <div class="my-auto mr-6 w-1/12">VAN사</div>

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

    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6 w-1/12">상태</div>
      <!--<div class="my-auto w-5/12 pr-5">-->
      <div class="w-80 w-5/12">
        <el-select
          v-model="statusSelectOption"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
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
      <!--<el-table-column v-if="tableHeader.status==true" prop="status" label="상태" align="center" />-->
      <el-table-column v-if="tableHeader.statusA==true" prop="statusA" label="상태" align="center" />
      <el-table-column v-if="tableHeader.applicationDate==true" prop="applicationDate" label="등록일" align="center" />
      <el-table-column
        v-if="tableHeader.lastAccessDate==true"
        prop="lastUseDt"
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
import * as _ from "lodash";
import writeXlsxFile from 'write-excel-file'
import { Search } from "@element-plus/icons-vue";
import { ElTable, ElTableColumn, ElPagination } from "element-plus";
import Pagination from '@/components/Pagination'

import { defineComponent, reactive, computed, ref } from "vue";
import BaseButton from "~/components/atoms/base-button.vue";

import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceDetailModal from "~/components/templates/modals/device-detail.modal.vue";
import DeviceRegisterModal from "~/components/templates/modals/device-register.modal.vue";
import ResultModal from "~/components/templates/modals/result.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { getTerminalVan } from "~/hooks/api.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";
import { useStore } from "vuex";

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
  mounted() {
    console.log("Aa", this.foo); // bar
  },
  setup() {
    //console.log("Aa", this.foo); // bar
    const { registrationHeaders_a: headers, devices, update, renmeObjectKey} = useDevice();
    const { searchOptions, statusOptions } = useConst();
    const store = useStore();
    
    let isVan = computed(() => store.state.isVan); 
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
      pageCount: 20,
      total: 20
    })

    let changeForm = reactive({
      vanList: [{ value: "-" }],
      vanSelect: ""
    })

    let initialState = reactive({
      van: true,
      modelCode: true,
      deviceNumber: true,
      swGroupCode: true,
      swVersion: true,
      status: true,
      statusA: true,
      applicationDate: true,
      lastAccessDate: true,
      checkAll: []
    })
    const tableHeader = reactive({ ...initialState });

    const registrationResult = reactive({
      modal: false,
      items: [
      ],
    });

    const onRegistration = (value) => {
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

    const onSelect = (event) => {
      searchKey = event
    };

    const onSearch = (event) => {
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      if(statusSelectOption.value != undefined) param = param + "&status=" + statusSelectOption.value

      excelValue = param //엑셀 다운로드에서 필요함.
      getTerminal(param).then( data => {
        setValue(data)
      })
    };

    const paginate = (page) => {
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      if(statusSelectOption.value != undefined) param = param + "&status=" + statusSelectOption.value

      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 

    const onTake = (pageCount) => {
      store.commit("pageCount", pageCount);
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      if(statusSelectOption.value != undefined) param = param + "&status=" + statusSelectOption.value

      getTerminal(param).then( data => {
        setValue(data)
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
    }

    const onCheckbox = (name, tst) => {
      tableHeader[name] = tst
    }

    async function getTerminal(param) {
      if(isVan.value) var vanId = window.localStorage.getItem("vanId")
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

    function s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }

    const onSaveExcel = () => {   
      var data = getTerminal("page=1&page_count=1000"+ excelValue).then( data => {
        var headerData = 
          ["VAN_ID", "CAT_MODEL_ID", "CAT_SERIAL_NO", "SW_GROUP_ID", "SW_VERSION", "STATUS", "REG_DT", "LAST_USE_DT"]
        var headerName =
          ["VNA사명", "단말기모델코드", "단말기번호", "S/W 그룹 코드", "S/W 버전", "상태", "등록일", "최종접속일"]
        
        var dataa = []
        var arr = []

        headerName.forEach((val)=>{
          arr.push({
            value:val,
            fontWeight: 'bold',
            backgroundColor: '#bfbfbf',
            width: 120
          })
        })
        dataa.push(arr)

        data.list.forEach((value)=>{
          var list = []
          headerData.forEach((val)=>{
            list.push({value: value[val]})
          })
          dataa.push(list)
        })


        writeXlsxFile(dataa, {
          fileName: '단말기.xlsx'
        })
      })
    }

    const onSaveDetail = ( val : any) => {
      deviceDetail.modal = false

      getTerminal("page=1&page_count="+store.state.pageCount).then( data => {
        setValue(data)
        defaultCheckbox()
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
      tableHeader.checkAll["modelCode"] = true
      tableHeader.checkAll["deviceNumber"] = true
      tableHeader.checkAll["swGroupCode"] = true
      tableHeader.checkAll["swVersion"] = true
      tableHeader.checkAll["status"] = true
      tableHeader.checkAll["statusA"] = true
      tableHeader.checkAll["applicationDate"] = true
      tableHeader.checkAll["lastAccessDate"] = true
    }
    const selectOption = ref();
    const statusSelectOption = ref();

    getTerminalVan().then( data => {
        var list = data.list
        changeForm.vanList = _.map(list, function square(n) {
          return {"key": n.VAN_ID, "value": n.VAN_NM}
        })
    })

    getTerminal("page=1&page_count=" + store.state.pageCount ).then( data => {
      setValue(data)
      defaultCheckbox()
    })

    return {
      selectOption,
      statusSelectOption,
      onRowClicked,
      onRegistration,
      deviceDetail,
      tableHeader,
      headers,
      query,
      devices,
      update,
      searchOptions,
      statusOptions,
      deviceRegistration,
      registrationResult,
      Search,
      //onSelect,
      onSearch,
      paginate,
      onTake,
      onCheckbox,
      onSaveExcel,
      pageVal,
      excelValue,
      onReset,
      onSaveDetail,
      isVan,
      changeForm  
    };
  },
});
</script>
