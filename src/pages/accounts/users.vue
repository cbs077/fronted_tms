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
            :value="item.key"
          />
        </el-select>
      </div>
    </div>
<!--
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
    </div>-->

    <options-search-button 
      @click:search="onSearch"
      @click:reset="onReset"
    />
  </div>

  <table-common-button>
    <template #body>
      <div class="grow" />
      <excel-button @click:excel="onSaveExcel" class="mr-1" />
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
        <template functional>
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
import writeXlsxFile from 'write-excel-file'
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import UserDetailModal from "~/components/templates/modals/user-detail.modal.vue";
import { IAdminUser } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";
import { useDevice } from "~/hooks/devices.hooks";
import { useStore } from "vuex";

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
    const store = useStore();

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

    const onReset = (event) => {
      selectOption.value = ""
    };

    const paginate = (page) => {
      pageVal.page = page
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      if(selectOption != "") param = param + "&van_id=" + selectOption.value 

      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    // 10개, 20개, 30개
    const onTake = (pageCount) => {
      store.commit("pageCount", pageCount);
      var param = "page=" + pageVal.page + "&page_count=" + store.state.pageCount
      if(selectOption != "") param = param + "&van_id=" + selectOption.value 

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
      
      if(selectOption.value != undefined) param = param + "&van_id=" + selectOption.value 

      excelValue = param //엑셀 다운로드에서 필요함.
      getTerminal(param).then( data => {
        setValue(data)
      })
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
      vanList.data = dataArr
    }

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
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

      });
    };


    async function getTerminal(param) {
      var token = window.localStorage.getItem("token")
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
      return responset
    };

    const onSaveExcel = () => {   
      var data = getTerminal("page=1&page_count=1000"+ excelValue).then( data => {
        var headerData = 
          ["USER_ID", "USER_NM", "ADDR1", "COMP_ID", "PHONE", "USER_RIGHTS", "REG_USER"]
        var headerName =
          ["유저 ID", "유저 이름", "주소", "VAN사명", "전화번호", "권한", "등록자"]
        
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
          fileName: '사용자 정보.xlsx'
        })
      })
    }


    getTerminalMdl()
    getTerminal("page=1&page_count="+store.state.pageCount).then( data => {
      setValue(data)
    })
    return { 
      filter, 
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
      selectOption,
      onReset 
      };
  },
});
</script>
