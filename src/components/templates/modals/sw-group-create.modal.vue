<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="S/W Group 등록"
    no-action
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 코드
          </div>
          <div class="col-span-4 my-auto">
            <el-input v-model="changeForm.SW_GROUP_ID" size="large" />
          </div>
          <div class="col-span-2 my-auto text-center font-bold">
            <base-button
              text="중복확인"
              class="mr-1"
            />
          </div>
        </div>
        <div v-if="changeForm.isExistId=='true'" class="grid grid-cols-8">
          <div class="col-span-2" />
          <div class="col-span-6 text-sk-red">
            이미 등록된 단말기 번호입니다.
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 명
          </div>
          <div class="col-span-4 my-auto">
            <el-input  v-model="changeForm.SW_GROUP_NM" size="large" />
          </div>
        </div>
        <div class="my-3 grid grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            설명
          </div>
          <div class="col-span-6 my-auto">
            <el-input
               v-model="changeForm.DESCRIPTION"
              rows="5"
              type="textarea"
            />
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
import { computed, defineComponent, reactive } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import { useConst } from "~/hooks/const.hooks";


export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
    SelectBox,
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
      DESCRIPTION: "",
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),
      isExistId: ""
    })
    
    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.post ('http://tms-test-server.p-e.kr:8081/swgroup/?' ,
        {
          "VAN_ID" : vanId,
          "SW_GROUP_ID": changeForm.SW_GROUP_ID,
          "SW_GROUP_NM": changeForm.SW_GROUP_NM,
          "DESCRIPTION": changeForm.DESCRIPTION,
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
        //console.log("response", response)
      });
    };

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
      onSave
    };
  },
});
</script>
