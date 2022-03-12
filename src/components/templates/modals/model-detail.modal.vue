<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 모델 신규 등록"
    no-action
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            단말기 모델 ID
          </div>
          <div class="col-span-6 my-auto">{{ device.modelCode }}</div>
        </div>

        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            단말기 모델명
          </div>
          <div class="col-span-6 my-auto">
            <el-input  v-model="device.modelName" size="large" />
          </div>
        </div>
        <div class="my-3 grid grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">설명</div>
          <div class="col-span-6 my-auto">
            <el-input size="large"  v-model="device.description" type="textarea" rows="5" />
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록일</div>
          <div class="col-span-6 my-auto">{{ changeForm.regDt }}</div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록자</div>
          <div class="col-span-6 my-auto"> {{ device.regUser }}</div>
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
import { computed, defineComponent, reactive } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";


import BaseModal from "~/components/organisms/base-modal.vue";
import { IDataTableHeader } from "~/interfaces/data.interface";
import { dateYYYYMMDD, duplicateMockData } from "~/utils/filter";

export default defineComponent({
  components: {
    BaseModal,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
    device: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  emits: ["update:modelValue", "click:positive", "click:negative"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value: boolean) => {
        Object.assign(changeForm, initialState);
        emit("update:modelValue", value);
      },
    });

    const header: IDataTableHeader[] = [
      { key: "deviceNumber", value: "단말기 번호" },
      { key: "status", value: "상태" },
    ];

    let initialState = reactive({
      CAT_MODEL_NM: "",//properties.device.swGroupNm,
      description: "",
      regDt: dateYYYYMMDD(new Date())
    })

    const changeForm = reactive({ ...initialState });

    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.put ('http://tms-test-server.p-e.kr:8081/terminal_mdl/?' ,
        {
          "VAN_ID": vanId,
          "CAT_MODEL_ID": properties.device.modelCode,
          "CAT_MODEL_NM": properties.device.modelName,
          "DESCRIPTION": properties.device.description,
          'REG_DT': new Date(),
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

    return {
      header,
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
