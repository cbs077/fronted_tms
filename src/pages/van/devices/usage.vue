<template>
  <bread-crumb text="단말기 사용정보 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto mr-6">조회일</div>

      <div class="mr-12 flex">
        <div class="block">
          <el-date-picker v-model="condition.start" size="large" />
        </div>
        <p class="mx-2 translate-y-1 transition">~</p>
        <div class="block">
          <el-date-picker v-model="condition.end" size="large" />
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
      <el-table-column prop="modelCode" label="단말기 모델" align="center" />

      <el-table-column prop="deviceCount" label="단말기 수량" align="center" />
      <el-table-column
        prop="swDownload"
        label="S/W Download 건수"
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

  <device-usage-detail-modal v-model="deviceUsageDetail.modal" />
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import writeXlsxFile from 'write-excel-file'

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import DeviceUsageDetailModal from "~/components/templates/modals/device-usage-detail.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";
import { useStore } from "vuex";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    TableCommonButton,
    DeviceUsageDetailModal,
    BaseButton,
  },
  setup() {
    const { logHeaders: headers, devices, update, renmeObjectKey, renmeObjectAKey} = useDevice();
    const { deviceModels } = useConst();
    const store = useStore();

    const condition = reactive({
      start: new Date(),
      end: new Date(),
    });

    const deviceUsageDetail = reactive({
      modal: false,
    });

    const onRowClicked = (row: IDevice) => {
      deviceUsageDetail.modal = true;
    };
    //////////////// 
    const query = ref("");
    let pageVal = reactive({
      page: 1,
      pageCount: 20,
      total: 20
    })

    let changeForm = reactive({
      deviceModels: [{ value: "-" }],
      data: []
    })

    let excelValue = "";

    function common_query(){
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&search_start_dt=" + dateYYYYMMDD(condition.start) + "&search_end_dt=" + dateYYYYMMDD(condition.end)
      if(query.value != "") param = param + "&cat_model_id=" + query.value


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
    };

    const onReset = (event) => {
      console.log("reset")
      condition.start = new Date()
      condition.end = new Date()
      query.value = ""
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
      //update(dataArr); 
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

      let responset = await axios.get( '/api' +  '/terminal/stat/list?' + param,
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
          fileName: '단말기 사용정보.xlsx'
        })
      })
    }

    function onSave(event) {
      modelCreate.modal = false
      modelCreate.data = {}
    }

    getTerminalMdl()
    getTerminal("page=1&page_count="+store.state.pageCount).then( data => {
      setValue(data)
    })

    return {
      deviceUsageDetail,
      onRowClicked,
      headers,
      condition,
      devices,
      deviceModels,
      //
      query,
      pageVal, 
      changeForm,
      onSearch,
      onReset,
      excelValue,
      onSaveExcel,
      paginate,
      onTake,
      onSave     
    };
  },
});
</script>
