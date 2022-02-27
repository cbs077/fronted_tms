<template>
  <bread-crumb text="개인정보 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">소속사</div>

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
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">검색조건</div>

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
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="my-auto w-1/12 text-center">검색어</div>
      <div class="w-5/12 pr-5">
        <el-input v-model="filter.query" size="large" />
      </div>
    </div>

    <options-search-button 
      @click:search="onSearch"
    />
  </div>

  <table-common-button>
    <template #body>
      <div class="grow" />
      <excel-button class="mr-1" />
    </template>
  </table-common-button>
  <div class="rounded border border-sk-gray">
    <el-table :data="vanList.data" class="rounded" @row-click="onRowClicked">
      <el-table-column prop="userId" label="아이디" align="center" />
      <el-table-column prop="userNm" label="담당자명" align="center" />
      <el-table-column prop="squad" label="소속사" align="center" />
      <el-table-column prop="regDt" label="등록일" align="center" />
      <el-table-column prop="regUser" label="등록자" align="center" />
      <el-table-column label="패스워드 초기화" align="center">
        <template #default>
          <base-button text="초기화" @click.capture.prevent.stop
        /></template>
      </el-table-column>
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

  <user-detail-modal v-model="userDetail.modal"></user-detail-modal>
</template>

<script lang="ts">
import faker from "@faker-js/faker";
import axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import UserDetailModal from "~/components/templates/modals/user-detail.modal.vue";
import { IAdminUser } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrationLogs",
  components: {
    TableCommonButton,
    BaseButton,
    UserDetailModal,
  },
  setup() {
    let {update, renmeObjectKey} = useDevice();
    const selectOption = ref();
    //
    const filter = reactive({
      squad: {
        available: [{ value: "test" }],
        select: undefined,
      },
      condition: {
        available: [{ value: "아이디" }, { value: "담당자명" }],
        select: undefined,
      },
      query: faker.lorem.word(),
    });

    const userDetail = reactive({
      modal: false,
    });

    const onRowClicked = () => {
      userDetail.modal = true;
    };

    // page
    const vanList = reactive({
      data: []
    });

    const paginate = (page) => {
      console.log("paginate", page);
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" + filter.query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      console.log("onTake", pageCount)
      pageVal.pageCount = pageCount
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" + filter.query.value
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
      deviceModels: [{ value: "" }],
      swVersions: [{ value: "-" }],
    })

    let excelValue = "";

    const onSearch = () => {
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      
      if(selectOption.value != "") param = param + "&van_id=" + selectOption.value 

      console.log("param", param)
      excelValue = param //엑셀 다운로드에서 필요함.
      getTerminal(param).then( data => {
        setValue(data)
      })
    };

    const seTtotalCount = (pageCount) => {
      pageVal.total = pageCount
      console.log("seTtotalCount", pageVal.total)
    }

    function setValue(data) {
      var list = data.list
      var dataArr = []
      for (var object of list){
        var obj = renmeObjectKey(object);
        dataArr.push(obj);
      }   
      seTtotalCount(data.total_count)
      console.log("dataArr", dataArr)
      vanList.data = dataArr
    }

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      //var vanId = window.localStorage.getItem("vanId")
      var param //= "van_id="+ vanId      
      if(token == null) token = "" 

      let data: any[] = [];

      let response = axios.get('http://tms-test-server.p-e.kr:8081/van/list?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.deviceModels = _.map(list, function square(n) {
          return {"key": n.VAN_ID, "value": n.VAN_NM}
        })

        console.log("changeForm.deviceModels", changeForm.deviceModels)
      });
    };


    async function getTerminal(param) {
      console.log("getTerminal",param)
      var token = window.localStorage.getItem("token")
      //var vanId = window.localStorage.getItem("vanId")
      var param = param //+ "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/getUserMgList?' + param,
          {
            headers: {
                Authorization: token
            }
          }
        )
        .then(response => {
          return response.data;
        });
      console.log("response", responset)
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

    // getTerminalMdl()
    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
    })
    return { 
      filter, 
      //items, 
      userDetail, onRowClicked,
      //
      vanList,
      pageVal, 
      changeForm,
      onSearch,
      excelValue,
      onSaveExcel,
      paginate,
      onTake,
      selectOption 
      };
  },
});
</script>
