<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 신규 등록"
    negative-text="초기화"
    positive-text="저장"
  >
    <template #modalBody>
      <div class="my-6 flex">
        <input
          id="device-register-normal"
          v-model="uploadMethodSelection"
          type="radio"
          value="일반등록"
          class="ml-12 translate-y-1 text-black transition"
        >
        <label
          for="device-register-normal"
          class="ml-4"
        >일반등록</label>
        <input
          id="device-register-bulk"
          v-model="uploadMethodSelection"
          type="radio"
          value="일괄등록"
          class="ml-12 translate-y-1 text-black transition"
        >
        <label
          for="device-register-bulk"
          class="ml-4"
        >일괄등록</label>
      </div>

      <!-- 일반등록 -->
      <div
        v-show="uploadMethodSelection === '일반등록'"
        class="my-3 grid h-12 grid-cols-8"
      >
        <div class="col-span-2 my-auto text-center font-bold">
          단말기 번호
        </div>
        <div class="col-span-6 flex">
          <input v-model="changeForm.CAT_SERIAL_NO" class="h-10 w-9/12 rounded border border-sk-gray">

          <base-button
            class="ml-2 w-2/12"
            text="중복확인"
          />
        </div>
      </div>

      <!-- 일괄등록 -->
      <div
        v-show="uploadMethodSelection === '일괄등록'"
        class="my-3 grid h-12 grid-cols-8"
      >
        <div class="col-span-2 my-auto text-center font-bold">
          단말기 번호
        </div>

        <div class="col-span-6 flex">
          <div class="flex w-9/12">
            <input v-model="changeForm.CAT_SERIAL_NO_COMMON" class="mr-4 h-10 w-3/12 rounded border border-sk-gray">
            <input v-model="changeForm.CAT_SERIAL_NO_FROM" class="h-10 w-4/12 rounded border border-sk-gray">
            <div class="my-auto mx-2 w-1/12 text-center">
              ~
            </div>
            <input v-model="changeForm.CAT_SERIAL_NO_TO" class="h-10 w-4/12 rounded border border-sk-gray">
          </div>
          <base-button
            class="ml-2 w-2/12"
            text="중복확인"
          />
        </div>
      </div>

      <div class="mb-3 grid grid-cols-12">
        <p class="col-span-6 col-start-4 text-sk-red">
          이미 등록된 단말기 번호입니다.
        </p>
        <p class="col-span-6 col-start-4 text-sk-teal">
          등록 가능한 번호입니다.
        </p>
      </div>

      <div class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">
          단말기 모델
        </div>
        <div class="col-span-4 my-auto">
          <el-select
            clearable
            placeholder="선택"
            v-model="changeForm.CAT_MODEL_ID"
            @change="onSelectGroupId"
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
      <div class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">
          S/W Group 명
        </div>
          <div class="col-span-4 my-auto">
            <el-select
              clearable
              placeholder="선택"
              v-model="changeForm.SW_GROUP_ID"
              @change="onSelectGroupNm"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in changeForm.swGroupCodes"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </div>  
      </div>
      <div class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">
          등록일
        </div>
        <div class="col-span-6 my-auto">
          {{changeForm.REG_DT}}
        </div>
      </div>
      <div class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">
          등록자
        </div>
        <div class="col-span-6 my-auto">
           {{changeForm.REG_USER}}
        </div>
      </div>
    </template>

    <template #modalAction>
      <div class="mt-12 text-center">
        <base-button
          class="mr-4 bg-sk-gray text-white"
          text="저장"
          type="button"
          @click="onPreSave"
        />
        <base-button
          class="mr-4"
          text="초기화"
          type="button"
          @click="$emit('click:negative')"
        />
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import  axios, { AxiosResponse } from "axios";
import { computed, defineComponent, reactive, ref } from "vue";
import * as _ from "lodash";

import { DEVICE_REGISTER_TYPE } from "~/@types/union";
import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import { useConst } from "~/hooks/const.hooks";

export default defineComponent({
  components: {
    BaseButton,
    BaseModal,
    SelectBox,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["update:modelValue", "click:positive",  "click:positiveNormal", "click:negative"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value: boolean) => {
        emit("update:modelValue", value);
      },
    });

    const uploadMethodSelection = ref<DEVICE_REGISTER_TYPE>("일반등록");

    const { deviceModels, swVersions } = useConst();
    ///
    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    let changeForm = reactive({
      CAT_SERIAL_NO: "",
      CAT_SERIAL_NO_COMMON: "",
      CAT_SERIAL_NO_FROM: "",
      CAT_SERIAL_NO_TO: "",
      CAT_SERIAL_NO_MULTI_RESULT: [],
      SW_GROUP_ID:"",
      SW_GROUP_NM: "",
      CAT_MODEL_ID: "",
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),

      deviceModels: [],
      swfile: []
    })

    function getswGroupCodes() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
      let response = axios.get('http://tms-test-server.p-e.kr:8081/swgroup/list?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.swGroupCodes = _.map(list, function square(n) {
          return {"key": n.SW_GROUP_NM, "value": n.SW_GROUP_ID}
        })
        //console.log("getswGroupCodes", list)
        
        return response.data.total_count;
      });
      //console.log("response", response)
      return response
    };

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
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
          return {"key" :  n.CAT_MODEL_NM, "value": n.CAT_MODEL_ID}
        })

        ////console.log("changeForm.deviceModels", changeForm.deviceModels)
      });
    };
    const onPreSave = () => {
      //console.log("uploadMethodSelection", uploadMethodSelection)
      changeForm.CAT_SERIAL_NO_MULTI_RESULT = []
      //console.log("changeForm.CAT_SERIAL_NO_TO", changeForm.CAT_SERIAL_NO_FROM)
      //console.log("changeForm.CAT_SERIAL_NO_TO", changeForm.CAT_SERIAL_NO_TO)
      if( uploadMethodSelection.value == '일괄등록'){
        for(var i=changeForm.CAT_SERIAL_NO_FROM; i <= changeForm.CAT_SERIAL_NO_TO ; i++){
          //console.log("onPreSave", i)
          changeForm.CAT_SERIAL_NO = changeForm.CAT_SERIAL_NO_COMMON + i
          //console.log("changeForm.CAT_SERIAL_NO", changeForm.CAT_SERIAL_NO)
          onSave(changeForm.CAT_SERIAL_NO)
        }
        emit("click:positive", { "type" : "multi", "data" : changeForm.CAT_SERIAL_NO_MULTI_RESULT }); 
        //console.log("일괄등록")
      }else{
        //console.log("일반등록")
        onSave(changeForm.CAT_SERIAL_NO)
      }
    }

    const onSave = (deviceNumber) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.post ('http://tms-test-server.p-e.kr:8081/terminal?' ,
        {
          "VAN_ID" : vanId,
          "CAT_SERIAL_NO": deviceNumber,
          "CAT_MODEL_ID": changeForm.CAT_MODEL_ID,
          "SW_GROUP_ID": changeForm.SW_GROUP_ID,
          "SW_VERSION": "",
          "STATUS": "",         
          'REG_DT': new Date(),
          'REG_USER': userNM,
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        if( uploadMethodSelection.value == '일괄등록'){
          if( response.data.status == 200){
            changeForm.CAT_SERIAL_NO_MULTI_RESULT.push({ 
              deviceNumber: deviceNumber,
              status: "성공"
            })
          }else {
             changeForm.CAT_SERIAL_NO_MULTI_RESULT.push({ 
              deviceNumber: deviceNumber,
              status: "실패"
            })           
          }
        }
        else {
          emit("click:positive", { "type" : "normal", "data" : [] });
        }
        
      });
    };

    getswGroupCodes()
    getTerminalMdl()

    return {
      uploadMethodSelection,
      deviceModels,
      swVersions,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
      //
      changeForm,
      onPreSave,
      onSave,      
    };
  },
});
</script>
