<template>
  <bread-crumb text="VAN사 관리 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3 flex flex-row">
      <div class="my-auto w-1/12">VAN사</div>

      <div class="my-auto ml-5 w-4/12">
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
    <el-table :data="vanList.data" fit class="rounded" @row-click="onRowClicked">
      <el-table-column prop="vanCode" label="VAN사 코드" align="center" />
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="address" label="주소" align="center" />
      <el-table-column prop="contact" label="전화번호" align="center" />
      <el-table-column prop="manager" label="담당자" align="center" />
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

  <van-detail-modal
    v-model="vanDetail.modal"
    :van="vanDetail.data"
  ></van-detail-modal>
</template>
<script lang="ts">
import faker from "@faker-js/faker";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';
import { defineComponent, reactive, ref } from "vue";

import ExcelButton from "~/components/molecules/excel-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import VanDetailModal from "~/components/templates/modals/van-detail.modal.vue";
import { IAdminVan } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";
import { useDevice } from "~/hooks/devices.hooks";


export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    TableCommonButton,
    ExcelButton,
    VanDetailModal,
  },
  setup() {
    let {update, renmeObjectKey} = useDevice();
    const selectOption = ref();
    const filter = reactive({
      available: [{ value: "test" }],
      select: undefined,
    });


    const example: IAdminVan = [{
      fax: "",
      address: faker.lorem.word(),
      contact: faker.lorem.word(),
      manager: faker.lorem.word(),
      user: faker.lorem.word(),
      van: faker.lorem.word(),
      vanCode: faker.lorem.word(),
      date: dateYYYYMMDD(new Date()),
    }];

    const vanDetail = reactive({
      modal: false,
      data: example,
    });

    const onRowClicked = (row: IAdminVan) => {
      vanDetail.data = row;
      vanDetail.modal = true;
    };
    //const registrationHeaders: IAdminVan[] = [
    //let items = example
    //const items: IAdminVan[] = [...duplicateMockData<IAdminVan>(example)];
////////////////
    // page
    const vanList = reactive({
      data: example,
    });

    const paginate = (page) => {
      console.log("paginate", page);
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      console.log("onTake", pageCount)
      pageVal.pageCount = pageCount
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
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
      //items = example;
      //update(dataArr); 
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

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/van/list?' + param,
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
    function login() {
      let data: any[] = [];

      let response = axios.get('http://tms-test-server.p-e.kr:8081/login?user_id=cbs&password=1234')
      .then(response => {
        var list = response.data.list

        window.localStorage.setItem("token", response.data.messages.token)
        window.localStorage.setItem("vanId", response.data.messages.van_id)
        window.localStorage.setItem("userId", response.data.messages.user_id)
        window.localStorage.setItem("userNm", response.data.messages.user_name)

      });
    };
    login()
    getTerminalMdl()
    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
    })

    return { 
      //items,
      filter, vanDetail, onRowClicked,
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
