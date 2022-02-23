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
            <div v-if="admin">단말기 모델</div>
            <select-box v-else v-model="form.modelCode" :items="changeForm.deviceModels" class="w-3/4" />
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 코드
          </div>
          <div class="col-span-6 my-auto">
            <div v-if="admin">S/W Group 코드</div>
            <select-box v-else :items="changeForm.swGroupCodes" class="w-3/4" />
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 명
          </div>
          <div class="col-span-6 my-auto">
            <div v-if="admin">S/W Group 명</div>
            <select-box v-else :items="changeForm.swGroupCodes" class="w-3/4" />
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
          @click="$emit('click:positive', form)"
        />
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
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

    function getswGroupCodes() {
      var token = window.localStorage.getItem("token")
      var vanId = window.localStorage.getItem("vanId")
      if(token == null) token = "" 

      let data: any[] = [];
      var param = "van_id="+ vanId
      let response = axios.get('http://tms-test-server.p-e.kr:8081/swgroup?' + param,
        {
          headers: {
              Authorization: token
          }
        }
      )
      .then(response => {
        var list = response.data.list
        
        changeForm.swGroupCodes = _.map(list, function square(n) {
          return {"value": n.SW_GROUP_ID}
        })
        console.log("getswGroupCodes", list)
        
        return response.data.total_count;
      });
      console.log("response", response)
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

        console.log("changeForm.deviceModels", changeForm.deviceModels)
      });
    };

    let changeForm = reactive({
      swGroupCodes: [{ value: "-" }],
      deviceModels: [{ value: "-" }],
      swVersions: [{ value: "-" }],
    })

    let form = reactive({
      modelCode: "",
    })
    const {/* deviceModels, swVersions, swGroupCodes*/ } = useConst();

    getswGroupCodes()
    getTerminalMdl()
    return {
      // deviceModels,
      // swVersions,
      // swGroupCodes,
      form,
      changeForm,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
