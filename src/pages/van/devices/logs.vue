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
          v-model="condition.select"
          clearable
          placeholder="선택"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in condition.available"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <options-search-button 
      @click:search="onSearch"
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
import * as XLSX from 'xlsx/xlsx.mjs';
import { defineComponent, reactive, ref } from "vue";

import BreadCrumb from "~/components/atoms/breadcrumb.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDeviceLog } from "~/interfaces/data.interface";
import { duplicateMockData } from "~/utils/filter";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    BreadCrumb,
    TableCommonButton,
  },
  setup() {
    const { searchOptions } = useConst();
    let { renmeObjectKey} = useDevice();

    const condition = reactive({
      available: searchOptions,
      select: undefined,
      start: new Date(),
      end: new Date(),
    });

    const example: IDeviceLog = {
      createdAt: faker.lorem.word(),
      deviceNumberFrom: faker.lorem.word(),
      deviceNumberTo: faker.lorem.word(),
      model: faker.lorem.word(),
      user: faker.lorem.word(),
      van: faker.lorem.word(),
    };

    const items: IDeviceLog[] = [...duplicateMockData<IDeviceLog>(example)];

    ////////////////
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
      //param = param + "&" + selectOption.value+ "=" +query.value
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
      data: []
    })

    let excelValue = "";

    const onSearch = (event) => {
      //console.log("selectOption", selectOption)
      //console.log("query.value", query.value)
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      
      if(query.value != "") param = param + "&cat_model_nm=" + query.value
      else param = param + "&cat_model_nm=" + selectOption.value
      
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
          return {"value": n.CAT_MODEL_NM}
        })

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
      //console.log("onSave", event)
    }

    getTerminalMdl()
    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
    })
    return { 
      items,
      condition,
      //
      pageVal, 
      changeForm,
      onSearch,
      excelValue,
      onSaveExcel,
      paginate,
      onTake,
      onSave       
    };
  },
});
</script>
