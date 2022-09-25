<template>
  <bread-crumb text="개인정보 등록" />
  <div
    class="mb-4 grid grid-cols-8 rounded border border-sk-gray bg-option-background p-3 pl-8 text-center"
  >
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">아이디</div>
      <div class="w-9/12">
        <el-input v-model="changeForm.USER_ID" size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">소속사</div>
      <div class="w-10/12">
        <el-select v-model="changeForm.COMP_ID" size="large" class="w-full">
          <el-option
            v-for="item in changeForm.deviceModels"
            :key="item.value"
            :label="item.value"
            :value="item.key"
          >
          </el-option>        
        </el-select>
      </div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">패스워드</div>
      <div class="w-9/12">
        <el-input type="password" v-model="changeForm.PWD" size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">패스워드 확인</div>
      <div class="w-10/12">
        <el-input type="password" v-model="changeForm.PWD1" size="large" placeholder="Please Input" />
      </div>
    </div>
    <hr class="col-span-8 my-6" />
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">담당자명</div>
      <div class="w-9/12">
        <el-input v-model="changeForm.USER_NM" size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">권한</div>
      <div class="w-10/12">
        <el-select v-model="changeForm.USER_RIGHTS" size="large" class="w-full">
          <el-option
            v-for="item in changeForm.RIGHT"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >   
          </el-option>       
        </el-select>
      </div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">전화번호</div>
      <div class="w-9/12">
        <el-input v-model="changeForm.PHONE" size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">팩스번호</div>
      <div class="w-10/12">
        <el-input v-model="changeForm.FAX" size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-8 my-3 flex">
      <div class="label-width my-auto w-1/12">주소</div>
      <div class="w-full">
        <el-input v-model="changeForm.ADDR1" size="large" placeholder="Please Input" />
      </div>
    </div>

    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">등록일</div>
      <div class="w-10/12">{{changeForm.REG_DT}}</div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">등록자</div>
      <div class="w-9/12">{{changeForm.REG_USER}}</div>
    </div>
  </div>

  <div class="flex">
    <base-button
      @click="onSave"
      text="저장"
      class="ml-auto mr-1 w-2/12 bg-sk-gray text-white"
    />
    <base-button text="초기화" class="mr-auto ml-1 w-2/12" />
  </div>
</template>
<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";
import { useStore } from "vuex";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    BaseButton,
  },
  setup() {
    const { registrationHeaders: headers, devices } = useDevice();
    const { searchOptions } = useConst();
    const store = useStore();

    const deviceRegistration = reactive({
      modal: false,
    });

    const registrationResult = reactive({
      modal: false,
      items: [
      ],
    });

    const deviceDetail = reactive({
      modal: false,
      data: {},
    });

    const onRegistration = () => {
      deviceRegistration.modal = false;
      setTimeout(() => {
        registrationResult.modal = true;
      }, 1000);
    };

    const onRowClicked = (row: IDevice) => {
      deviceDetail.data = row;
      deviceDetail.modal = true;
    };

    const selectOption = ref();
    ///
    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    let changeForm = reactive({
      USER_ID:"",
      USER_NM: "",
      COMP_ID: "",
      PWD:"",
      PWD1: "",
      USER_RIGHTS: "",
      PHONE: "",
      FAX:"",
      ADDR1:"",      
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),
      deviceModels: [{ value: "" }],
      RIGHT: [{ value: "S"}, {value: "-"}]
    })

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      //var vanId = window.localStorage.getItem("vanId")
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

    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      var userNM = window.localStorage.getItem("userNm")

      if(changeForm.USER_ID ==""){
        alert("아이디 확인을 해주세요."); return;
      }

      if(changeForm.PWD =="" || changeForm.PWD1 ==""){
        alert("패스워드 확인을 해주세요."); return;       
      }

      if( changeForm.PWD != changeForm.PWD1){ 
        alert("패스워드가 동일하지 않습니다."); return;       
      }

      if(changeForm.COMP_ID ==""){
          alert("VAN사 확인을 해주세요."); return;
      }
      
      axios.post( '/api' +  '/user?' ,
        {
            "USER_ID": changeForm.USER_ID,
            "USER_NM": changeForm.USER_NM,
            "COMP_ID": changeForm.COMP_ID,
            "PWD": changeForm.PWD,
            "USER_RIGHTS": changeForm.USER_RIGHTS,
            "PHONE": changeForm.PHONE,
            "FAX": changeForm.FAX,
            "ADDR1": changeForm.ADDR1,            
            "REG_DT": new Date(),
            "REG_USER": userNM,
            "UPDATE_DT": new Date()
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        console.log("response", response.data.status)
        if(response.data.status == 400){
          alert("실패하였습니다.")
          return
        }
        alert("등록되었습니다.")
      });
    };
    getTerminalMdl()

    changeForm.userNM = window.localStorage.getItem("userNm")
    return {
      selectOption,
      onRowClicked,
      onRegistration,
      deviceDetail,
      headers,
      devices,
      searchOptions,
      deviceRegistration,
      registrationResult,
      Search,
      //
      onSave,
      changeForm  
    };
  },
});
</script>

<style scoped>
.label-width {
  min-width: 140px;
}
</style>
