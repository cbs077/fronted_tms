<template>
  <base-modal
    v-model="isOpen"
    @click:exit-positive="onExit"
    class="w-2/3"
    title="S/W Group 등록"
    no-action
  >
    <template #modalBody>
      <!--
      <div v-if="!isVan" class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">VAN사</div>

        <div class="col-span-4 my-auto">
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
      -->
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 코드
          </div>
          <div class="col-span-4 my-auto">
            <el-input v-model="changeForm.SW_GROUP_ID" maxlength='4' size="large" />
          </div>
          <div class="col-span-2 my-auto text-center font-bold">
            <base-button
              @click="onIdCheck"
              text="중복확인"
              class="mr-1"
            />
          </div>
        </div>
        <!--
        <div v-if="changeForm.isExistId=='true'" class="grid grid-cols-8">
          <div class="col-span-2" />
          <div class="col-span-6 text-sk-red">
            이미 등록된 단말기 번호입니다.
          </div>
        </div>
        -->
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
import { computed, defineComponent, reactive, onMounted  } from "vue";
import * as _ from "lodash";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import { useConst } from "~/hooks/const.hooks";
import { getTerminalVan } from "~/hooks/api.hooks";

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
    }
  },
  emits: ["update:modelValue", "click:positive", "click:negative"],

  setup(properties, { emit }) {
    onMounted(() => {
      console.log('mounted in the composition api!')
      changeForm.SW_GROUP_ID = ""
    })

    let isVan = computed(() => store.state.isVan); 
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value: boolean) => {
        Object.assign(changeForm, initialState);

        emit("update:modelValue", value);
      },
    });
    const { deviceModels, swVersions, swGroupCodes } = useConst();
    ///
    function formatDate(date) { var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }

    let initialState  = reactive({
      SW_GROUP_ID:"",
      SW_GROUP_NM: "",
      DESCRIPTION: "",
      REG_DT: formatDate(new Date()),
      REG_USER: window.localStorage.getItem("userNm"),
      isExistId: "",
      vanList: [{ value: "-" }],
      vanSelect: ""   
    })
    const changeForm = reactive({ ...initialState });

    
    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      // if( isVan == true) var vanId = window.localStorage.getItem("vanId")
      // else var vanId = changeForm.vanSelect
      var vanId = "all"
      var userNM = window.localStorage.getItem("userNm")

      if( changeForm.isExistId == "true" || changeForm.isExistId == "" ){
        alert("Group 코드 중복값을 확인해주세요.") 
        return
      } 

      axios.post( '/api' +  '/swgroup?' ,
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

      });
    };

    const onIdCheck = (param: string) => {
      var token = window.localStorage.getItem("token")
      // if( isVan == true) var vanId = window.localStorage.getItem("vanId")
      // else var vanId = changeForm.vanSelect
      //var vanId = "all"
      var userNM = window.localStorage.getItem("userNm")

      console.log("changeForm.SW_GROUP_ID.length", changeForm.SW_GROUP_ID.length)
      if(changeForm.SW_GROUP_ID == "" ){ alert("그룹코드 is null"); return}
      if(changeForm.SW_GROUP_ID.length > 4 ) {alert("4자리 이상입니다."); return}

      //axios.get( '/api' +  '/swgroup/idcheck/' + vanId + "/" + changeForm.SW_GROUP_ID ,
      axios.get( '/api' +  '/swgroup/idcheck/all/' + changeForm.SW_GROUP_ID ,
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
      console.log("getTerminalVan", data)
      var list = data.list
      changeForm.vanList = _.map(list, function square(n) {
        return {"key": n.VAN_ID, "value": n.VAN_NM}
      })
    })

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
      onIdCheck,
      getTerminalVan
      //onExit
    };
  },
});
</script>
