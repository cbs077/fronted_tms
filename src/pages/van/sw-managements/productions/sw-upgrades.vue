<template>
  <bread-crumb text="S/W Upgrade 이력" />
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

      <div class="my-auto mr-6 w-1/12 text-center">검색어</div>

      <div class="w-5/12 pr-5">
        <el-input
          v-model="query"
          size="large"
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

  <table-common-button
    @update:take="onTake"
  >
    <template #body>
      <div class="grow" />
      <excel-button  @click:excel="onSaveExcel" class="mr-1" />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="devices" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column
        prop="swGroupCode"
        label="S/W Group 코드"
        align="center"
      />
      <el-table-column prop="swVersion" label="S/W Group 명" align="center" />
      <el-table-column prop="swVersion" label="S/W Version" align="center" />
      <el-table-column prop="regDt" label="등록일" align="center" />
      <el-table-column prop="regUser" label="등록자" align="center" />
      <el-table-column prop="lastAccessDate" label="성공여부" align="center" />
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

  <sw-upgrade-detail-modal 
    v-model="swDetail.modal" 
    :headerDate="swDetail.headerDate"
    :device="swDetail.data"
    :fileInfo="swDetail.fileInfo"
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
import SwUpgradeDetailModal from "~/components/templates/modals/sw-upgrade-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";
import { getTerminalVan } from "~/hooks/api.hooks";
import { useStore } from "vuex";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    TableCommonButton,
    ElTableColumn,
    ElTable,
    SwUpgradeDetailModal,
  },
  setup() {
    let { registrationHeaders: headers, devices, update, renmeObjectKey, renmeObjectAKey } = useDevice();
    const searchOptions = [
      { id: 1, key: "sw_group_id", value: "S/W Group 코드" },
      { id: 2, key: "sw_version", value: "S/W Version" }
    ];
    const selectOption = ref();
    const store = useStore();
    let isVan = computed(() => store.state.isVan); 

    const swDetail = reactive({
      modal: false,
      data: {},
      headerDate: {},
      fileInfo: {}
    });

    const swCreate = reactive({
      modal: false,
    });

////////////////
    const query = ref("");
    let pageVal = reactive({
      page: 1,
      pageCount: 20,
      total: 20
    })

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "-" }],
      swVersions: [{ value: "-" }],
      vanList: [{ value: "-" }],
      vanSelect: ""
    })

    let excelValue = "";

    const paginate = (page) => {
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      store.commit("pageCount", pageCount);
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 

    const onSearch = (event) => {
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      excelValue = param //엑셀 다운로드에서 필요함.
      getTerminal(param).then( data => {
        setValue(data)
      })
    };

    const onRowClicked = (row: IDevice) => {
      swDetail.headerDate = row
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

        Object.assign(swDetail.headerDate, status);
        swDetail.data = dataArr 

        getSwVersion(param).then( data => {     
          var list = data.list
          var dataArr = []
          for (var object of list){
            var obj = renmeObjectKey(object);
            dataArr.push(obj);
          }   
          swDetail.fileInfo = dataArr[0] 
          swDetail.modal = true
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
      update(dataArr); 
    }

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
          return {"key": n.CAT_MODEL_ID, "value": n.CAT_MODEL_NM}
        })

      });
    };


    async function getTerminal(param) {
      if(isVan.value) var vanId = window.localStorage.getItem("vanId")
      else var vanId = changeForm.vanSelect

      var token = window.localStorage.getItem("token")
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
          fileName: 'S/W 업그레이드 이력.xlsx'
        })
      })
    }
    
    function onSave() {
      swCreate.modal = false
      swCreate.data = {}
    }

    const onReset = (event) => {
      selectOption.value = ""
      query.value = ""
      changeForm.vanSelect =""
    };

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
    return {
      selectOption,
      onRowClicked,
      swCreate,
      swDetail,
      headers,
      devices,
      searchOptions,
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
      renmeObjectAKey,
      onReset,
      isVan,
    };
  },
});
</script>
