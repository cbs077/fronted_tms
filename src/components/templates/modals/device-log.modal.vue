<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 이력"
    no-action
    no-exit-guard
  >
    <template #modalBody>
      <table-common-button no-take>
        <template #body>
          <div class="grow" />
          <base-button v-if="logs.status != 'ST'" text="거래중지" class="mr-2"  @click="onStopTirminal('ST')" />
          <base-button v-if="logs.status == 'ST'" text="거래재개" class="mr-2"  @click="onStopTirminal('NR')" />
          <!--<excel-button class="mr-1" />-->
        </template>
      </table-common-button>

      <div>
        <table class="w-full border-collapse border border-slate-500">
          <tbody>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-lightgray bg-sk-lightgray text-center"
              >
                VAN사명
              </td>
              <td class="border border-sk-lightgray text-center">{{logs.van}}</td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-lightgray bg-sk-lightgray text-center"
              >
                단말기 번호1
              </td>
              <td class="border border-sk-lightgray text-center">{{logs.deviceNumber}}</td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-lightgray bg-sk-lightgray text-center"
              >
                주유소 코드(SS 코드)
              </td>
              <td class="border border-sk-lightgray text-center">{{logs.deviceNumber}}</td>
            </tr>
          </tbody>
        </table>
        ​
      </div>
      <div class="rounded border border-sk-gray">
        <el-table :data="items" fit class="rounded">
          <el-table-column
            prop="deviceNumber"
            label="요청내용"
            align="center"
          />
          <el-table-column prop="requestDate" label="요청일시" align="center" />
          <el-table-column
            prop="responseCode"
            label="응답코드"
            align="center"
          />
        </el-table>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import  axios, { AxiosResponse } from "axios";

import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { IDataTableHeader } from "~/interfaces/data.interface";

export default defineComponent({
  components: {
    BaseModal,
    TableCommonButton,
    BaseButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
    logs: {
      type: Object,
      required: true,
      default: () => {},
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
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

    const header: IDataTableHeader[] = [
      { key: "deviceNumber", value: "단말기 번호" },
      { key: "status", value: "상태" },
    ];

    function onStopTirminal(flag) {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.post( '/api' +  '/modify/terminal?' ,
        {
          "VAN_ID" : vanId,
          "CAT_SERIAL_NO": this.logs.deviceNumber,
          "STATUS": flag,    
          // 'REG_DT': new Date(),
          // 'REG_USER': userNM,
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        console.log("tt")
      });
    }

    return {
      header,
      isOpen,
      onStopTirminal,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
