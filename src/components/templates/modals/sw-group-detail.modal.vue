<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="S/W Group 상세 조회"
    no-action
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 코드
          </div>
          <div class="col-span-6 my-auto">
            {{ device.swGroupCode }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 명
          </div>
          <div class="col-span-6 my-auto">
            <el-input v-model="changeForm.SW_GROUP_NM" />
          </div>
        </div>
        <div class="my-3 grid grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            설명
          </div>
          <div class="col-span-6 my-auto">
            <el-input
              v-model="changeForm.description"
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
            {{ device.regDt }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            등록자
          </div>
          <div class="col-span-6 my-auto">
            {{ device.regUser }}
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
import { computed, defineComponent, reactive } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";

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
    const { deviceModels, swVersions, swGroupCodes } = useConst();

    let initialState = reactive({
      SW_GROUP_NM: "",
      description: ""
    })

    const changeForm = reactive({ ...initialState });

    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.put ('http://tms-test-server.p-e.kr:8081/swgroup/?' ,
        {
          "VAN_ID": vanId,
          "SW_GROUP_ID": properties.device.swGroupCode,
          "SW_GROUP_NM": changeForm.SW_GROUP_NM,
          "DESCRIPTION": changeForm.description
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
