<template>
  <bread-crumb text="Transaction 조회" />
  <div class="mb-4 rounded border border-sk-gray bg-option-background p-3 pl-8">
    <div class="my-3">
      <div v-if="!isVan" class="my-3 flex flex-row">
        <div class="my-auto w-1/12">VAN사</div>

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
              v-for="item in SGsearchOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
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
            <el-radio-group v-model="changeForm.response">
              <el-radio value="normal" label="일반" />
              <el-radio value="error" label="오류" />
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">단말기 번호</div>
        <div class="flex w-4/12">
          <el-input v-model="changeForm.deviceNumber" size="large" placeholder="Please Input" />
        </div>
      </div>
      <div class="my-3 flex">
        <div class="my-auto w-1/12">서버</div>
        <div class="mr-12 flex">
          <el-radio-group  v-model="changeForm.server">
            <el-radio label="운영서버" />
            <!--<el-radio label="테스트서버" />-->
          </el-radio-group>
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
      <!--
      <base-button class="mr-1" text="사용 중지" @click="onStopTirminal(true)" />
      <base-button class="ml-1" text="사용 재개" @click="onStopTirminal(false)"/>
      -->
      <div class="grow" />
      <excel-button  @click:excel="onSaveExcel" class="mr-1" />
    </template>
  </table-common-button>

  <div class="rounded border border-sk-gray">
    <el-table :data="changeForm.data" fit class="rounded" @selection-change="onSelectChange">
      <!--
      <el-table-column
        type="selection"
        primary-text
        class="text-black"
        align="center"
      />
      -->
      <el-table-column prop="van" label="VAN사명" align="center" />
      <el-table-column prop="swGroupNm" label="S/W Group명" align="center" />
      <el-table-column prop="swOldVersion" label="S/W Version" align="center" />
      <el-table-column prop="deviceNumber" label="단말기번호" align="center" />
      <el-table-column prop="request" label="요청내용" align="center" />
      <el-table-column prop="regDt" label="요청일시" align="center" />
      <el-table-column prop="resultCode" label="응답코드" align="center" />
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
import { defineComponent, reactive, computed, ref } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import writeXlsxFile from 'write-excel-file'
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import ConfirmModal from "~/components/templates/modals/confirm.modal.vue";
import { useDevice } from "~/hooks/devices.hooks";
import { getTerminalVan } from "~/hooks/api.hooks";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";
import { useStore } from "vuex";

export default defineComponent({
  name: "DeviceUnRegistrations",
  components: {
    BaseButton,
    TableCommonButton,
    ConfirmModal,
  },
  setup() {
    let { registrationHeaders: headers, devices, update, renmeObjectKey, renmeObjectAKey} = useDevice();

    let isVan = computed(() => store.state.isVan); 
    const SGsearchOptions = [
      { id: 1, key: "sw_group_id", value: "S/W Group 코드" },
      { id: 2, key: "sw_version", value: "S/W Version" },
    ];
    const searchOptions = ref();
    const store = useStore();
    const displayOptions = reactive({
      all: false,
      modelCode: false,
      swGroupCode: false,
      swVersion: false,
      status: true,
      registrationDate: true,
      lastAccessDate: true,
    });
    const deviceUnRegistration = reactive({
      modal: false,
      text: "선택한 항목을 삭제 하시겠습니까?",
    });
    
    const selectOption = ref();
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

    let data = reactive({
      checkbox: 1,
    })

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "-" }],
      deviceNumber: "",
      swVersions: [{ value: "-" }], 
      response: "normal",
      server: "prod",
      data: [],
      vanList: [{ value: "-" }],
      vanSelect: ""
    })
    changeForm.server = ref("운영서버")
    changeForm.response = ref("일반")
    let excelValue = "";

    function common_query(){
      console.log("searchOptions", changeForm.deviceNumber)
      var param = "page=" + pageVal.page 
      param = param + "&search_start_dt=" + dateYYYYMMDD(condition.start) + "&search_end_dt=" + dateYYYYMMDD(condition.end)
      if(changeForm.response == "오류") param = param + "&response=fail" 
      excelValue = param // 엑셀은 페이지 카운터 제외

      param = param + "&page_count=" + store.state.pageCount
      if(query.value != "") param = param + "&" + selectOption.value+ "=" + query.value
      if(changeForm.deviceNumber != "") param = param + "&cat_serial_no=" + changeForm.deviceNumber
      
        
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
      searchOptions.value = ""
      condition.start = new Date()
      condition.end = new Date()
      query.value = ""
      changeForm.vanSelect = ""
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
          return {"value": n.CAT_MODEL_NM}
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

      let responset = await axios.get( '/api' +  '/swoprmg/up/moniter?' + param,
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

    function onStopTirminal(flag) {
      data.checkbox.forEach(function(value, index) {
        onUpdateRc(value, flag)
        console.log('array index: ' + index + ' value : ' + value);
      })
      deviceUnRegistration.modal = false
    }

    function onSelectChange(event) {
      console.log("onSelectChange", event)
      data.checkbox = _.map(event, "deviceNumber")
      console.log("onSelectChange", data.checkbox)
    }

    const onUpdateRc = (deviceNumber, flag) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.post( '/api' +  '/rccmd?' ,
        {
          "VAN_ID" : vanId,
          "CAT_SERIAL_NO": deviceNumber,
          "CMD": "DT",   
          "CMD_SUB": flag,    
          'REG_DT': new Date(),
          'REG_USER': userNM,
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        console.log("tt")
      });
    };

    const onSaveExcel = () => {   
      var data = getTerminal("page=1&page_count=100000&"+ excelValue).then( data => {
        const columns = [{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20},{width: 20}]

        if(data.list == undefined) return  
        var header = ["REG_DT", "VAN_ID", "VAN_NM", "CAT_MODEL_ID", "CAT_SERIAL_NO", "DESCRIPTION", "GUBUN", "RESULT_CODE", "OLD_SW_VERSION", "SW_GROUP_ID", "SW_GROUP_NM", ]
        //_.keys(data.list[0])

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
          fileName: 'S/W 업데이트.xlsx'
        })
      })
    }

    function onSave() {
      swGroupCreate.modal = false
      swGroupCreate.data = {}
    }

    getTerminalVan().then( data => {
        var list = data.list
        changeForm.vanList = _.map(list, function square(n) {
          return {"key": n.VAN_ID, "value": n.VAN_NM}
        })
    })

    getTerminalMdl()
    common_query()

    return {
      selectOption,
      update,
      deviceUnRegistration,
      headers,
      devices,
      //searchOptions,
      displayOptions,
      condition,
      //
      query,
      pageVal, 
      changeForm,
      onSearch,
      excelValue,
      SGsearchOptions,
      onSaveExcel,
      paginate,
      onTake,
      update,
      renmeObjectKey,
      onSave,
      common_query,
      onReset,
      onStopTirminal,
      onSelectChange,
      onUpdateRc,
      isVan,
    };
  },
});
</script>
