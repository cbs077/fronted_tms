<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 모델 등록"
  >
    <template #modalBody>
      <div>
        <div v-if="!isVan" class="my-3 flex flex-row">
          <div class="my-3 grid h-6 grid-cols-8">
            <div class="col-span-2 my-auto text-center font-bold">VAN사</div>

            <div class="my-auto">
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
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            모델 코드
          </div>
          <div class="col-span-4 my-auto">
            <el-input v-model="changeForm.CAT_MODEL_ID" maxlength='4' csize="large" />
          </div>
          <div class="col-span-2 my-auto text-center font-bold">
            <base-button @click="onIdCheck" text="중복확인" class="mr-1" />
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            모델명
          </div>
          <div class="col-span-4 my-auto">
            <el-input v-model="changeForm.CAT_MODEL_NM" size="large" />
          </div>
        </div>
        <div class="my-3 grid grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">설명</div>
          <div class="col-span-6 my-auto">
            <el-input v-model="changeForm.DESCRIPTION" size="large" type="textarea" rows="5" />
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록일</div>
          <div class="col-span-6 my-auto">{{changeForm.REG_DT}}</div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록자</div>
          <div class="col-span-6 my-auto">{{changeForm.REG_USER}}</div>
        </div>
      </div>
      <div class="mt-12 text-center">
        <base-button
          class="mr-4 border-sk-gray bg-sk-gray text-white"
          text="수정 및 저장"
          type="button"
          @click="onSave"
        />
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';
import { computed, defineComponent, reactive } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { getTerminalVan } from "~/hooks/api.hooks";
import { IDataTableHeader } from "~/interfaces/data.interface";

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  emits: ["update:modelValue", "click:positiveA"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value: boolean) => {
        emit("update:modelValue", value);
      },
    });
    let isVan = computed(() => store.state.isVan); 

    
    const header: IDataTableHeader[] = [
      { key: "deviceNumber", value: "단말기 번호" },
      { key: "status", value: "상태" },
    ];
    ///
    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    let changeForm = reactive({
      CAT_MODEL_ID:"",
      CAT_MODEL_NM: "",
      DESCRIPTION: "",
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),
      isExistId: "",
      vanList: [{ value: "-" }],
      vanSelect: ""      
    })
    
    const onSave = (param: string) => {
      if( changeForm.isExistId == "true" || changeForm.isExistId == "" ){
        alert("모델 코드 중복값을 확인해주세요.") 
        return
      } 
      if( isVan == true) var vanId = window.localStorage.getItem("vanId")
      else var vanId = changeForm.vanSelect

      var token = window.localStorage.getItem("token")
      var userNM = window.localStorage.getItem("userNm")

      axios.post( '/api' +  '/terminal_mdl?' ,
        {
          "VAN_ID" : vanId,
          "CAT_MODEL_ID": changeForm.CAT_MODEL_ID,
          "CAT_MODEL_NM": changeForm.CAT_MODEL_NM,
          "DESCRIPTION": changeForm.DESCRIPTION,
          'USE_YN': "Y",
          'REG_DT': new Date(),
          'REG_USER': userNM,
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        var list = response.data.list
        emit("click:positiveA")
      });
    };

    const onIdCheck = (param: string) => {
      var token = window.localStorage.getItem("token")
      if( isVan == true) var vanId = window.localStorage.getItem("vanId")
      else var vanId = changeForm.vanSelect
      var userNM = window.localStorage.getItem("userNm")

      if(changeForm.CAT_MODEL_ID == "" ) {alert("모델코드 is null"); return}
      if(changeForm.CAT_MODEL_ID.length > 4 ) {alert("4자리 이상입니다."); return}

      axios.get( '/api' +  '/terminal_mdl/idcheck/' + vanId + "/" + changeForm.CAT_MODEL_ID ,
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        var count = response.data.count
        if( count > 0 ) {
          alert("이미 등록된 모델 코드 입니다.")
          changeForm.isExistId = "true"
        }
        else {
          alert("등록가능한 모델 코드 입니다.")
          changeForm.isExistId = "false"
        }
      });
    };

    getTerminalVan().then( data => {
        var list = data.list
        changeForm.vanList = _.map(list, function square(n) {
          return {"key": n.VAN_ID, "value": n.VAN_NM}
        })
    })

    changeForm.userNM = window.localStorage.getItem("userNm")

    return {
      header,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
      //
      onSave,
      changeForm,
      onIdCheck,
      getTerminalVan
    };
  },
});
</script>
