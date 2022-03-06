<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 상세 조회"
    no-action
    :no-exit-guard="admin"
  >
    <template #modalBody>
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
          <div class="col-span-6 my-auto">
          <div class="col-span-4 my-auto">
            <el-select
              clearable
              placeholder="선택"
              v-model="changeForm.CAT_MODEL_ID"
              @change="onSelectGroupId"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in changeForm.deviceModels"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </div>
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
              v-model="changeForm.SW_GROUP_ID"
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
              v-model="changeForm.SW_GROUP_NM"
              @change="onSelectGroupNm"
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
            S/W Version
          </div>
          <div class="col-span-6 my-auto">
            {{ device.swVersion }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">상태</div>
          <div class="col-span-6 my-auto">
            {{ device.status }}
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
import BaseModal from "~/components/organisms/base-modal.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import { useConst } from "~/hooks/const.hooks";
import { defineComponent, reactive, ref } from "vue";

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
      SW_GROUP_ID: "",
      SW_GROUP_NM: "",
      CAT_MODEL_ID: "",
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "-" }],
      swVersions: [{ value: "-" }],
    })

    function getswGroupCodes() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
      let response = axios.get('http://tms-test-server.p-e.kr:8081/swgroup/list?' + param,
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
        //console.log("getswGroupCodes", list)
        
        return response.data.total_count;
      });
      //console.log("response", response)
      return response
    };

    function getTerminalMdl() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
      let response = axios.get('http://tms-test-server.p-e.kr:8081/terminal_mdl?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.deviceModels = _.map(list, function square(n) {
          return {"value": n.CAT_MODEL_NM}
        })

        ////console.log("changeForm.deviceModels", changeForm.deviceModels)
      });
    };

    const onSave = (param: string) => {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      var userNM = window.localStorage.getItem("userNm")

      axios.put ('http://tms-test-server.p-e.kr:8081/terminal/?' ,
        {
          "VAN_ID": vanId,
          "CAT_MODEL_ID": changeForm.CAT_MODEL_ID,
          "SW_GROUP_ID": changeForm.SW_GROUP_ID,
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
      //console.log("onSelectGroupId", event)
      var groupRename = _.find(changeForm.swGroupCodes, function(data) {
        return data.value == event }
      );
      //console.log("groupRename1", groupRename)
      changeForm.SW_GROUP_ID = groupRename.value
      changeForm.SW_GROUP_NM = groupRename.key     
    }

    function onSelectGroupNm(event){
      //console.log("onSelectGroupNm", event)
      var groupRename = _.find(changeForm.swGroupCodes, function(data) {
        return data.value == event }
      );
      //console.log("onSelectGroupNm", groupRename)
      changeForm.SW_GROUP_ID = groupRename.value
      changeForm.SW_GROUP_NM = groupRename.key
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
      onSave
    };
  },
});
</script>
