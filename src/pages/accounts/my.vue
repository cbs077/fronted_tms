<template>
  <bread-crumb text="개인정보" />
  <div
    class="mb-4 grid grid-cols-8 rounded border border-sk-gray bg-option-background p-3 pl-8 text-center"
  >
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">아이디</div>
      <div>{{changeForm.USER_ID}}</div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">소속사</div>
      <div>{{changeForm.VAN_NM}}</div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">담당자명</div>
      <div class="w-9/12">
        <el-input v-model="changeForm.USER_NM" size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex" />
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

    <div class="col-span-8 my-3">
      <hr />
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
  </div>

  <div class="flex">
    <base-button
      @click="onSave"
      text="정보 수정 및 저장"
      class="mx-auto w-4/12 bg-sk-gray text-white"
    />
  </div>
</template>
<script lang="ts">
import axios, { AxiosResponse } from "axios";
import { Search } from "@element-plus/icons-vue";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    BaseButton,
  },
  setup() {
    const { registrationHeaders: headers, devices, renmeObjectKey, renmeObjectAKey} = useDevice();
    const { searchOptions } = useConst();

    const deviceRegistration = reactive({
      modal: false,
    });

    const deviceDetail = reactive({
      modal: false,
      van: {},
    });

    const selectOption = ref();
//
    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    let changeForm = reactive({
      USER_ID: window.localStorage.getItem("uesrId"),
      USER_NM: "",
      COMP_ID: "",
      PWD:"",
      PWD1:"",
      USER_RIGHTS: "",
      PHONE: "",
      FAX:"",
      ADDR1:"",      
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),
      deviceModels: [{ value: "" }],
      RIGHT: [{ value: "S"}, {value: "-"}],
      data: []
    })
    const changePassword = (param: string) => {
    
      var token = window.localStorage.getItem("token")
      var userNM = window.localStorage.getItem("userNm")

      axios.post( '/api' +  '/updatepwd?' ,
        {
            "USER_ID": changeForm.USER_ID,
            "PWD": changeForm.PWD
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        var list = response.data.list
        console.log("성공")
      });
    };

    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      var userNM = window.localStorage.getItem("userNm")

      if(changeForm.PWD !=""&& changeForm.PWD1 !=""){
          if( changeForm.PWD != changeForm.PWD1){ alert("패스워드 확인을 해주세요."); return}
          changePassword()
      }

      axios.post( '/api' + '/updateUserInfo?' ,
        {
            "USER_ID": changeForm.USER_ID,
            "USER_NM": changeForm.USER_NM,
            "COMP_ID": changeForm.COMP_ID,
            "PWD": changeForm.PWD,
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
        console.log("response.data.list",response)
        if(response.data.status == 400){
          alert("실패하였습니다.")
        }
        alert("정보가 변경되었습니다.")

      });
    };

    async function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      var userId = window.localStorage.getItem("userId")
 
      if(token == null) token = "" 

      let data: any[] = [];

      let response = await axios.get( '/api' +  '/getUserInfo/' + userId,
              {
                headers: {
                    Authorization: token
                }
              }
            )
            .then(response => {
              changeForm.USER_ID = userId
              changeForm.VAN_NM = response.data[0].user_rights_nm
              changeForm.USER_NM = response.data[0].USER_NM
              changeForm.FAX = response.data[0].FAX
              changeForm.PHONE = response.data[0].PHONE
              changeForm.ADDR1 = response.data[0].ADDR1

              return response.data;   
            });
            return response;    
    };
    getTerminalMdl()

    return {
      selectOption,
      deviceDetail,
      headers,
      devices,
      searchOptions,
      deviceRegistration,
      Search,
      //
      changeForm,
      onSave
    };
  },
});
</script>

<style scoped>
.label-width {
  min-width: 140px;
}
</style>
