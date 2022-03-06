<template>
  <bread-crumb text="Transaction 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3">
      <div class="my-3 flex">
        <div class="my-auto w-1/12">조회일</div>

        <div class="flex w-5/12">
          <div class="block">
            <el-date-picker v-model="condition.start" size="large" />
          </div>
          <p class="mx-2 translate-y-1 transition">~</p>
          <div class="block">
            <el-date-picker v-model="condition.end" size="large" />
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
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="my-auto w-1/12 text-center">검색어</div>
        <div class="flex w-4/12">
          <el-input size="large" v-model="query" placeholder="Please Input" />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">응답상태</div>
        <div class="mr-12 flex">
          <div class="mr-12 flex">
            <el-radio-group>
              <el-radio label="일반" />
              <el-radio label="오류" />
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">단말기 번호</div>
        <div class="flex w-4/12">
          <el-input size="large" placeholder="Please Input" />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">서버</div>
        <div class="mr-12 flex">
          <el-radio-group>
            <el-radio label="운영서버" />
            <el-radio label="테스트서버" />
          </el-radio-group>
        </div>
      </div>
    </div>
    <options-search-button />
  </div>

  <table-common-button
    @update:take="onTake"
  >
    <template #body>
      <base-button class="mr-1" text="사용 중지" />
      <base-button class="ml-1" text="사용 재개" />
      <div class="grow" />
      <excel-button  @click:excel="onSaveExcel" class="mr-1" />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="changeForm.data" fit class="rounded">
      <el-table-column
        type="selection"
        primary-text
        class="text-black"
        align="center"
      />
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="modelCode" label="S/W Group명" align="center" />
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

  <confirm-modal
    v-model="deviceUnRegistration.modal"
    title="Confirm"
    positive-text="삭제"
    negative-text="취소"
    :text="deviceUnRegistration.text"
  />
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import ConfirmModal from "~/components/templates/modals/confirm.modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    BaseButton,
    TableCommonButton,
    ConfirmModal,
  },
  setup() {
    let { registrationHeaders: headers, devices, update, renmeObjectKey } = useDevice();
    //const { searchOptions } = useConst();
    const searchOptions = [
      { id: 1, key: "sw_group_id", value: "S/W Group 코드" },
      { id: 2, key: "sw_version", value: "S/W Version" },
    ];

    //const query = ref("");
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

    const deviceUnRegistration = reactive({
      modal: false,
      text: "선택한 항목을 삭제 하시겠습니까?",
    });

    const condition = reactive({
      available: searchOptions,
      select: undefined,
      start: new Date(),
      end: new Date(),
    });

////////////////
    // page
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
      pageVal.pageCount = pageCount
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
      getTerminal(param).then( data => {
        setValue(data)
      })
    }; 
    const query = ref("");
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
      console.log()
      var param = "page=" + pageVal.page + "&page_count=" + pageVal.pageCount
      param = param + "&" + selectOption.value+ "=" +query.value
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

        //console.log("changeForm.deviceModels", changeForm.deviceModels)
      });
    };


    async function getTerminal(param) {
      //console.log("getTerminal",param)
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = param + "&van_id="+ vanId
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/swoprmg/up/moniter?' + param,
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
        XLSX.writeFile(wb, 'swGroup.xlsx');
      })
    }

    function onSave() {
      swGroupCreate.modal = false
      swGroupCreate.data = {}
      //console.log("onSave")
    }

    getTerminalMdl()
    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
    })
    return {
      selectOption,
      update,
      deviceUnRegistration,
      headers,
      devices,
      searchOptions,
      displayOptions,
      condition,
      //
      query,
      pageVal, 
      changeForm,
      onSearch,
      excelValue,
      onSaveExcel,
      paginate,
      onTake,
      update,
      renmeObjectKey,
      onSave
    };
  },
});
</script>
