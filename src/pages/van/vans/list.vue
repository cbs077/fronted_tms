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
      @click:reset="onReset"
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
import { useStore } from "vuex";

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
    const store = useStore();
    const filter = reactive({
      available: [{ value: "test" }],
      select: undefined,
    });

    const vanDetail = reactive({
      modal: false,
      data: [],
    });

    const onRowClicked = (row: IAdminVan) => {
      vanDetail.data = row;
      vanDetail.modal = true;
    };
   
    ////
    const vanList = reactive({
      data: [],
    });

    const paginate = (page) => {
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&van_io" + selectOption.value //+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      store.state.pageCount = pageCount
      store.commit("pageCount", pageCount);
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 

    let pageVal = reactive({
      page: 1,
      pageCount: 20,
      total: 20
    })

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "" }],
      swVersions: [{ value: "-" }],
    })

    let excelValue = "";

    const onSearch = () => {
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      
      if(selectOption.value != "") param = param + "&van_id=" + selectOption.value 

      excelValue = param //엑셀 다운로드에서 필요함.
      getTerminal(param).then( data => {
        setValue(data)
      })
    };

    const seTtotalCount = (pageCount) => {
      pageVal.total = pageCount
    }

    const onReset = (event) => {
      selectOption.value = ""
    };

    function setValue(data) {
      var list = data.list
      var dataArr = []
      for (var object of list){
        var obj = renmeObjectKey(object);
        dataArr.push(obj);
      }   
      seTtotalCount(data.total_count)
      vanList.data = dataArr

    }

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      var param //= "van_id="+ vanId      
      if(token == null) token = "" 

      let data: any[] = [];

      let response = axios.get( '/api' +  '/van/list?' + param,
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

      });
    };


    async function getTerminal(param) {
      var token = window.localStorage.getItem("token")
      var param = param //+ "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get( '/api' +   '/van/list?' + param,
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

    getTerminalMdl()
    getTerminal("page=1&page_count="+store.state.pageCount).then( data => {
      setValue(data)
    })

    return { 
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
      selectOption,
      onReset 
      };
  },
});
</script>
