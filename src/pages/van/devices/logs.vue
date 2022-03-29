<template>
  <bread-crumb text="단말기 등록 이력" />

  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex">
      <div class="my-auto mr-6 w-1/12">업데이트일</div>

      <div class="flex w-5/12">
        <div class="block">
          <el-date-picker v-model="condition.start" size="large" />
        </div>
        <p class="mx-2 translate-y-1 transition">~</p>
        <div class="block">
          <el-date-picker v-model="condition.end" size="large" />
        </div>
      </div>

      <div class="w-1-12 my-auto mr-6">모델명</div>
      <div class="my-auto w-5/12 pr-5">
        <el-select
          v-model="query"
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
    <el-table :data="changeForm.data" fit class="rounded">
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="modelName" label="단말기 모델명" align="center" />
      <el-table-column
        prop="deviceNumberFrom"
        label="단말기 번호 (From)"
        align="center"
      />
      <el-table-column
        prop="deviceNumberTo"
        label="단말기 번호 (To)"
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
</template>

<script lang="ts">
import faker from "@faker-js/faker";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import writeXlsxFile from 'write-excel-file'
import { defineComponent, reactive, ref } from "vue";

import BreadCrumb from "~/components/atoms/breadcrumb.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";
import { useStore } from "vuex";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    BreadCrumb,
    TableCommonButton,
  },
  setup() {
    let { renmeObjectKey, renmeObjectAKey } = useDevice();
    const store = useStore();
    const condition = reactive({
      start: new Date(),
      end: new Date(),
    });

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

      condition.start = new Date()
      condition.end = new Date()
      query.value = ""
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
      changeForm.data = dataArr
      //update(dataArr); 
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

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/reghist/list?' + param,
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
          fileName: '등록이력.xlsx'
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
     // items,
      condition,
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
