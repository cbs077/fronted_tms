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
                 {{ device[0].swGroupCode }}
              </td>
              <td class="h-10 w-3/12 border border-sk-gray text-center">
                 {{ device[0].swGroupNm }}
              </td>
              <td class="h-10 w-3/12 border border-sk-gray text-center">
                 {{ device[0].swVersion }}
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
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                파일 Size
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                등록일
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                등록자
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                업데이트 이력 (완료)
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
            <tr>
              <td
                class="h-10 w-3/12 border border-sk-gray bg-sk-lightgray text-center"
              >
                업데이트 이력 (실패)
              </td>
              <td class="border border-sk-gray text-center" colspan="2">
                TEST
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-show="!admin" class="mt-3 rounded border border-sk-gray">
        <el-table :data="device" fit class="rounded">
          <el-table-column
            prop="swGroupCode"
            label="S/W Group 코드"
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
            prop="status"
            label="에러코드"
            align="center"
          />
          <el-table-column prop="responseCode" label="상태" align="center" />
          <el-table-column
            prop="responseCode"
            label="업그레이드"
            align="center"
          >
            <template #default>
              <div><base-button text="업데이트" /></div>
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
    admin: {
      type: Boolean,
      default: false,
      required: false,
    }

  },
  emits: ["update:modelValue"],

  setup(properties, { emit }) {
    onMounted(() => {
      // console.log("onmount")
      // var swGroupCode = properties.device.swGroupCode
      // var swVersion = properties.device.swVersion
      // getTerminal("page=1&page_count=10").then( data => {
      //   setValue(data)
      // })
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

    const { renmeObjectKey } = useDevice();

    let initialState = reactive({
      swGroupCode: properties.device.swGroupCode,
      //SW_GROUP_NM: properties.device.swGroupNm ,
      description: properties.device.description,
      data: []
    })

    const changeForm = reactive({ ...initialState });

    async function getTerminal(param) {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")

      var param = param + "&van_id="+ vanId + "&gubun_code=FA" 
      if(token == null) token = "" 

      let data: any[] = [];

      let responset = await axios.get('http://tms-test-server.p-e.kr:8081/swoprmg/up/moniter?' + param,
          {
            headers: {
                Authorization: token
            }
          }
        )
        .then(response => {
          console.log("response11", response)
          return response.data;
        });
      
      return responset
    };

    function setValue(data) {
      var list = data.list
      var dataArr = []
      for (var object of list){
        var obj = renmeObjectKey(object);
        dataArr.push(obj);
      }   
      console.log("dataArr", dataArr)
      changeForm.data = dataArr
    }

    getTerminal("page=1&page_count=10").then( data => {
      setValue(data)
    })   
    return {
      header,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
      changeForm,
      //setValue,
      
    };
  },
});
</script>
