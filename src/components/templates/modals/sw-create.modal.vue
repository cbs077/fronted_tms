<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="S/W 등록"
    positive-text="저장"
    negative-text="초기화"
    @click:positive="uploadFile"
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 아이디
          </div>
          <div class="col-span-4 my-auto">
            <el-select
              clearable
              placeholder="선택"
              v-model="changeForm.SW_GROUP_ID"
              @change="onSelectGroupId"
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

        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 명
          </div>
          <div class="col-span-4 my-auto">
            <el-select
              clearable
              placeholder="선택"
              v-model="changeForm.SW_GROUP_NM"
              @change="onSelectGroupNm"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in changeForm.deviceModels"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Version
          </div>
          <div class="col-span-4 my-auto">
            <el-input v-model="changeForm.SW_VERSION" size="large" />
          </div>
          <div class="col-span-2 my-auto text-center font-bold">
            <base-button
              @click="onIdCheck"
              text="중복확인"
              class="mr-1"
            />
          </div>
        </div>
        <!--<div v-if="changeForm.isExistId=='true'" class="grid grid-cols-8">
          <div class="col-span-2" />
          <div class="col-span-6 text-sk-red">
            이미 등록된 단말기 번호입니다.
          </div>
        </div>-->
        <div class="my-3 grid grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W 파일 업로드
          </div>
          <div class="col-span-4 my-auto">
            <input
               @change="selectFile"
              size="large"
              type="file"
            >
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            등록일
          </div>
          <div class="col-span-6 my-auto">
            {{changeForm.REG_DT}}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            등록자
          </div>
          <div class="col-span-6 my-auto">
            {{changeForm.REG_USER}}
          </div>
        </div>
      </div>

      <div class="mx-3 border border-sk-lightgray p-3">
        * S/W Version은 최대 10자리의 숫자로 입력해 주십시오.(문자를 입력하실 경우 10자리를 채워 주십시오.)<br>
        * S/W Version 입력 시 앞서 등록한 Version 이후 Version으로 입력해 주셔야 합니다.<br>
        * S/W 등록 시 등록 파일의 확장자가 exe와 같은 실행파일은 업로드 불가하며 최대 Upload 파일 크기는 1M입니다.
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import  axios, { AxiosResponse } from "axios";
import { computed, defineComponent, reactive } from "vue";
import * as _ from "lodash";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { useConst } from "~/hooks/const.hooks";

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
  },
  props: {
    name: { type: String },
    code: { type: String },
    description: { type: String },
    registrationDate: { type: String },
    registrationUser: { type: String },
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["update:modelValue", "click:positive", "click:negative"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value: boolean) => {
        emit("update:modelValue", value);
      },
    });

    const { deviceModels, swVersions, swGroupCodes } = useConst();

    ///
    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    let changeForm = reactive({
      SW_GROUP_ID:"",
      SW_GROUP_NM: "",
      SW_VERSION: "",
      APPL_DT: "",
      DATA_SIZE: "",
      FILE_PATH: "",
      FILE_NM: "",      
      UPLOAD_FILE_NM: "" ,  
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),

      deviceModels: [],
      swfile: [],
      isExistId: ""
      //selectOGroupId: "",
      //selectOGroupNm: ""
    })

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var param = "van_id="+ vanId      
      if(token == null) token = "" 

      let data: any[] = [];

      let response = axios.get('http://tms-test-server.p-e.kr:8081/swgroup/list?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.deviceModels = _.map(list, function square(n) {
          return {"key": n.SW_GROUP_NM, "value": n.SW_GROUP_ID}
        })

      });
    };

    function onSelectGroupId(event){
      var groupRename = _.find(changeForm.deviceModels, function(data) {
        return data.value == event }
      );
      changeForm.SW_GROUP_ID = groupRename.value
      changeForm.SW_GROUP_NM = groupRename.key     
    }

    function onSelectGroupNm(event){
      var groupRename = _.find(changeForm.deviceModels, function(data) {
        return data.value == event }
      );

      changeForm.SW_GROUP_ID = groupRename.value
      changeForm.SW_GROUP_NM = groupRename.key
    }

    // 파일 변경 시 이벤트 핸들러
    function selectFile(event) { 
      var swfile = event.target.files[0]
      changeForm.swfile = swfile
      changeForm.DATA_SIZE = swfile.size
      changeForm.FILE_PATH = swfile.name
      changeForm.FILE_NM = swfile.name
      changeForm.UPLOAD_FILE_NM = swfile.name

    }

    async function uploadFile() {
      if( changeForm.FILE_PATH == '') {alert("파일을 선택해주세요.");return}
      if( changeForm.isExistId == "true" || changeForm.isExistId == "" ){
        alert("버전 중복값을 확인해주세요.") 
        return
      } 
      const formData = new FormData();
      formData.append("swfile", changeForm.swfile);

      try {
        const { data } = await axios.post(
          "http://tms-test-server.p-e.kr:8081/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ).then(response => {
          console.log("response.data", response.data.messages.filepath)
          onSave(response.data.messages.filepath)
        });
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }  

    async function onSave (param) {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

       
      await axios.post ('http://tms-test-server.p-e.kr:8081/swoprmg/?' ,
        {
          "VAN_ID" : vanId,
          "SW_GROUP_ID": changeForm.SW_GROUP_ID,
          "SW_VERSION": changeForm.SW_VERSION.padStart(10, '0') ,
          "APPL_DT": changeForm.APPL_DT,
          "DATA_SIZE": changeForm.DATA_SIZE,
          "FILE_PATH": param,
          "FILE_NM": changeForm.FILE_NM,  
          "UPLOAD_FILE_NM": changeForm.UPLOAD_FILE_NM,                
          'REG_DT': new Date(),
          'REG_USER': userNM,
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        var list = response.data.list
        emit("click:positive");
      });
    };

    const onIdCheck = (param: string) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      if(changeForm.SW_GROUP_ID == "" ) {alert("그룹 아이디 is null"); return}
      if(changeForm.SW_VERSION == "" ) {alert("버전 is null"); return}

      axios.get('http://tms-test-server.p-e.kr:8081/swoprmg/idcheck/' + vanId + "/" + changeForm.SW_GROUP_ID + "/" + changeForm.SW_VERSION.padStart(10, '0') ,
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        var count = response.data.count
        if( count > 0 ) {
          alert("이미 등록된 버전 입니다.")
          changeForm.isExistId = "true"
        }
        else {
          alert("등록가능한 버전 입니다.")
          changeForm.isExistId = "false"
        }
      });
    };

    getTerminalMdl()

    return {
      deviceModels,
      swVersions,
      swGroupCodes,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
      //
      changeForm,
      onSave,
      onSelectGroupId,
      onSelectGroupNm,
      selectFile,
      uploadFile,
      onIdCheck        
    };
  },
});
</script>
