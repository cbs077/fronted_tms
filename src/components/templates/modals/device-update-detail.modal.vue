<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 업데이트 상태"
    no-action
    no-exit-guard
  >
    <template #modalBody>
      <div>
        <table class="mb-4 w-full text-black">
          <tbody>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                S/W Group 코드
              </td>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                S/W Group 명
              </td>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                S/W Version
              </td>
            </tr>
            <tr>
              <td class="h-10 w-3/12 border border-sk-gray text-center">
                 {{ headerDate.swGroupCode }}
              </td>
              <td class="h-10 w-3/12 border border-sk-gray text-center">
                 {{ headerDate.swGroupNm }}
              </td>
              <td class="h-10 w-3/12 border border-sk-gray text-center">
                 {{ headerDate.swVersion }}
              </td>
            </tr>
          </tbody>
        </table>
        <table class="w-full border-collapse border border-sk-gray text-black">
          <tbody>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                Update 파일명
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                {{ fileInfo.swFileNm }}
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                파일 Size
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                 {{ fileInfo.swFileSize }}
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                등록일
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                 {{ fileInfo.regDt }}
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                등록자
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                 {{ fileInfo.regUser }}
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                업데이트 이력 (완료)
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                 {{headerDate.pass}}
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                업데이트 이력 (실패)
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                {{headerDate.fail}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-show="!admin" class="mt-3 rounded border border-sk-gray">
        <el-table :data="device" class="rounded">
          <el-table-column
            prop="swGroupCode"
            label="Group 코드"
            align="center"
          />          
          <el-table-column
            prop="deviceNumber"
            label="단말기 번호"
            align="center"
          />
          <el-table-column
            prop="swGroupNm"
            label="S/W Group 명"
            align="center"
          />
          <el-table-status
            prop="resultCode"
            label="에러코드"
            align="center"
          />
          <el-table-column prop="resultCode" label="상태" align="center" >
             <template v-slot="props">
                <div v-if="props.row.resultCode==''">
                  <span>ok</span>
                </div>
                 <div v-else="props.row.resultCode!=''">
                  <span>fail</span>
                </div>
            </template>
          </el-table-column>
          <el-table-column>
             <template v-slot="props">
                <div v-if="props.row.resultCode!=''">
                  <base-button @click="onUpdate(props.row.deviceNumber)" text="업데이트" />
                </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, onMounted } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";
import * as XLSX from 'xlsx/xlsx.mjs';

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { IDataTableHeader } from "~/interfaces/data.interface";
import { IDevice, useDevice } from "~/hooks/devices.hooks";
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
    device: {
      type: Object,
      required: true,
      default: () => {},
    },
    fileInfo: {
      type: Object,
      required: true,
      default: () => {},
    },
    headerDate: {
      type: Object,
      required: true,
      default: () => {},
    },
    admin: {
      type: Boolean,
      default: false,
      required: false,
    }

  },
  emits: ["update:modelValue"],

  setup(properties, { emit }) {
    onMounted(() => {

    });
    const isOpen = computed({
      get: () => {
        return properties.modelValue
      },
      set: (value: boolean) => {
        emit("update:modelValue", value);
      },
    });

    const header: IDataTableHeader[] = [
      { key: "deviceNumber", value: "단말기 번호" },
      { key: "status", value: "상태" },
    ];
//
    const { renmeObjectKey, renmeObjectAKey} = useDevice();

    let initialState = reactive({
      swGroupCode: "",//properties.device.swGroupCode,
      description: "",//properties.device.description,
      data: []
    })

    const changeForm = reactive({ ...initialState });

    const onUpdate = (deviceNumber) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.post( '/api' +  '/rccmd?' ,
        {
          "VAN_ID" : vanId,
          "CAT_SERIAL_NO": deviceNumber,
          "CMD": "FD",    
          'REG_DT': new Date(),
          'REG_USER': userNM,
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        console.log("tt")
      });
    };

    return {
      header,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
      changeForm,
      onUpdate
    };
  },
});
</script>
