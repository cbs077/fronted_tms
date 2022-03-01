<template>
  <bread-crumb text="VAN사 관리 등록" />
  <div
    class="mb-4 grid grid-cols-8 rounded border border-sk-gray bg-option-background p-3 pl-8 text-center"
  >
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">VAN사 코드</div>
      <div class="w-7/12">
        <el-input v-model="changeForm.VAN_ID" size="large" placeholder="Please Input" />
      </div>
      <base-button class="ml-1" text="중복확인"></base-button>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">VAN사명</div>
      <div class="w-10/12">
        <el-input v-model="changeForm.VAN_NM" size="large" class="w-full"></el-input>
      </div>
    </div>

    <div class="col-span-4 mt-1 flex">
      <div class="label-width my-auto w-2/12"></div>
      <div class="w-7/12 text-left text-sk-red">
        이미 등록된 VAN사 코드입니다.
      </div>
    </div>
    <div class="col-span-4 my-3 flex"></div>

    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">담당자명</div>
      <div class="w-9/12">
        <el-input v-model="changeForm.MANAGER_NM" size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex"></div>
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

    <hr class="col-span-8 my-6" />

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
import  axios, { AxiosResponse } from "axios";
import { Search } from "@element-plus/icons-vue";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDevice, useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    BaseButton,
  },
  setup() {
    const { registrationHeaders: headers, devices } = useDevice();
    const { searchOptions } = useConst();

    const deviceRegistration = reactive({
      modal: false,
    });

    const registrationResult = reactive({
      modal: false,
      items: [
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
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
      VAN_ID:"",
      VAN_NM: "",
      MANAGER_NM: "",
      PHONE:"",
      FAX: "",
      ZIP_CODE: "",
      ADDR1:"",
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm")
    })
    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      var userNM = window.localStorage.getItem("userNm")

      axios.post ('http://tms-test-server.p-e.kr:8081/van?' ,
        {
            "VAN_ID": changeForm.VAN_ID,
            "VAN_NM": changeForm.VAN_NM,
            "MANAGER_NM": changeForm.MANAGER_NM,
            "PHONE": changeForm.PHONE,
            "FAX": changeForm.FAX,
            "ZIP_CODE": changeForm.ZIP_CODE,
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
        var list = response.data.list
        //console.log("response", response)
      });
    };

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
