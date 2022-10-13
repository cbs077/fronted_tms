<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="VAN사 상세 조회"
    no-action
    :no-exit-guard="admin"
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">VAN사 코드</div>
          <div class="col-span-6 my-auto">
            {{ van.vanCode }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">VAN사명</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" v-model="van.van"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">담당자</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" v-model="van.manager"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">전화번호</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" v-model="van.contact"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">팩스번호</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" v-model="van.fax"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">주소</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" v-model="van.address"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록일</div>
          <div class="col-span-6 my-auto">
            {{ van.regDt }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록자</div>
          <div class="col-span-6 my-auto">
            {{ van.regUser }}
          </div>
        </div>
      </div>
      <div v-if="!admin" class="mt-12 text-center">
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
import { computed, defineComponent, PropType } from "vue";
import  axios, { AxiosResponse } from "axios";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IAdminVan } from "~/interfaces/data.interface";

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
  },
  props: {
    van: {
      type: Object,
      required: true,
      default: () => {},
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
    admin: {
      type: Boolean,
      required: false,
      default: false,
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

    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      //var vanId = window.localStorage.getItem("vanId")
      //var userNM = window.localStorage.getItem("userNm")

      axios.post( '/api' +  '/modify/van' ,
        {
          "VAN_ID": properties.van.vanCode,
          "VAN_NM": properties.van.van,
          "MANAGER_NM": properties.van.manager,
          "PHONE": properties.van.contact,
          "FAX": properties.van.fax,
          "ADDR1": properties.van.address,
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
      deviceModels,
      swVersions,
      swGroupCodes,
      onSave,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
