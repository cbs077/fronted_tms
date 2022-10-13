<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 상세 조회"
    no-action
    :no-exit-guard="admin"
  >
    <template #modalBody>
      <div class="my-3 grid h-1 grid-cols-8"></div>
      <table-common-button no-take>
        <template #body>
          <div class="grow" />
          <base-button v-if="device.status != 'ST'" text="거래중지" class="mr-2"  @click="onStopTirminal('ST')" />
          <base-button v-if="device.status == 'ST'" text="거래재개" class="mr-2"  @click="onStopTirminal('U')" />
        </template>
      </table-common-button>

      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            단말기 번호
          </div>
          <div class="col-span-6 my-auto">
            {{ device.deviceNumber }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            단말기 모델
          </div>

          <div class="col-span-4 my-auto">
            <el-select
              clearable
              placeholder="선택"
              v-model="device.modelCode"
              @change="onSelectGroupId"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in changeForm.deviceModels"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>

          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 코드
          </div>
          <div class="col-span-4 my-auto">
            <el-select
              clearable
              placeholder="선택"
              v-model="device.swGroupCode"
              @change="onSelectGroupId"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in changeForm.swGroupCodes"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 명
          </div>
          <div class="col-span-4 my-auto">
            <el-select
              clearable
              placeholder="선택"
              v-model="device.swGroupNm"
              @change="onSelectGroupNm"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in changeForm.swGroupCodes"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              />
            </el-select>
          </div>     
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Version
          </div>
          <div class="col-span-6 my-auto">
            {{ device.swVersion }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">상태</div>
          <div class="col-span-6 my-auto">
            {{ device.statusA }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">사업자 번호</div>
          <div v-if="device.bussRegNo==device.catBussRegNo" class="col-span-6 my-auto">
            {{ device.bussRegNo }}
          </div>
          <div v-if="device.bussRegNo!=device.catBussRegNo" class="col-span-6 my-auto">
             DB: {{ device.bussRegNo }}, 단말기: {{ device.catBussRegNo }}
          </div>         
        </div>    
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">주유소 코드</div>
          <div class="col-span-6 my-auto">
            {{ device.ssCode }}
          </div>
        </div>            
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록일</div>
          <div class="col-span-6 my-auto">
            {{ device.applicationDate }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록자</div>
          <div class="col-span-6 my-auto">
            {{ device.applicationUser }}
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
import { computed, defineComponent, reactive } from "vue";
import  axios, { AxiosResponse } from "axios";
import * as _ from "lodash";


import BaseButton from "~/components/atoms/base-button.vue";
import TableCommonButton from "~/components/molecules/table/table-common-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import { useConst } from "~/hooks/const.hooks";
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  components: {
    BaseModal,
    TableCommonButton,
    BaseButton,
    SelectBox,
  },
  props: {
    device: {
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

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "-" }],
    })

    function getswGroupCodes() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
      let response = axios.get( '/api' +  '/swgroup/list?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.swGroupCodes = _.map(list, function square(n) {
          return {"key": n.SW_GROUP_NM, "value": n.SW_GROUP_ID}
        })
        
        return response.data.total_count;
      });
      return response
    };

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      // var vanId = device.vanCode //window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ properties.device.vanCode
      let response = axios.get( '/api' +  '/terminal_mdl?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.deviceModels = _.map(list, function square(n) {
          return {"key":  n.CAT_MODEL_NM,  "value": n.CAT_MODEL_ID}
        })
      });
    };

    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      //var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.post( '/api' + '/modify/terminal?' ,
        {
          "VAN_ID": properties.device.vanCode,
          "CAT_MODEL_ID": properties.device.modelCode,
          "SW_GROUP_ID": properties.device.swGroupCode,
          "CAT_SERIAL_NO": properties.device.deviceNumber
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

    function onSelectGroupId(event){
      var groupRename = _.find(changeForm.swGroupCodes, function(data) {
        return data.value == event }
      );
      properties.device.swGroupCode = groupRename.value
      properties.device.swGroupNm = groupRename.key     
    }

    function onSelectGroupNm(event){
      var groupRename = _.find(changeForm.swGroupCodes, function(data) {
        return data.value == event }
      );
      properties.device.swGroupCode = groupRename.value
      properties.device.swGroupNm = groupRename.key
    }

    function onStopTirminal(flag) {
      var token = window.localStorage.getItem("token")
      // var vanId = window.localStorage.getItem("vanId")
      // var vanId = device.
      var userNM = window.localStorage.getItem("userNm")

      axios.post( '/api' +  '/modify/terminal?' ,
        {
          "VAN_ID" : properties.device.vanCode,
          "CAT_SERIAL_NO": this.device.deviceNumber,
          "STATUS": flag,    
        }, 
        {
          headers: { Authorization: token} // header의 속성
        },
      )
      .then(response => {
        this.device.status = flag
        console.log("tt")
      });
    }

    getswGroupCodes()
    getTerminalMdl()
    return {
      changeForm,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
      onSelectGroupId,
      onSelectGroupNm,
      onSave,
      onStopTirminal
    };
  },
});
</script>
