<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 모델 상세조회"
    positive-text="저장"
    negative-text="초기화"
    @click:positive="onSave"
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            모델 코드
          </div>
          <div class="col-span-4 my-auto">
            <el-input v-model="changeForm.CAT_MODEL_ID" csize="large" />
          </div>
          <div class="col-span-2 my-auto text-center font-bold">
            <base-button text="중복확인" class="mr-1" />
          </div>
        </div>
        <div class="grid grid-cols-8">
          <div class="col-span-2" />
          <div class="col-span-6 text-sk-red">
            이미 등록된 모델 코드 입니다.
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
  emits: ["update:modelValue"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value: boolean) => {
        emit("update:modelValue", value);
      },
    });

    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    const header: IDataTableHeader[] = [
      { key: "deviceNumber", value: "단말기 번호" },
      { key: "status", value: "상태" },
    ];
    //
    let changeForm = reactive({
      CAT_MODEL_ID:"",
      CAT_MODEL_NM: "",
      DESCRIPTION: "",
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm")
    })
    
    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.post ('http://tms-test-server.p-e.kr:8081/terminal_mdl/?' ,
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
        console.log("response", response)
      });
    };

    changeForm.userNM = window.localStorage.getItem("userNm")

    return {
      header,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
      onSave,
      changeForm
    };
  },
});
</script>
