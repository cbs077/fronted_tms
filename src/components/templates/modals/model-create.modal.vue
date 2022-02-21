<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 모델 상세조회"
    positive-text="저장"
    negative-text="초기화"
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            단말기 번호
          </div>
          <div class="col-span-4 my-auto">
            <el-input size="large" />
          </div>
          <div class="col-span-2 my-auto text-center font-bold">
            <base-button text="중복확인" class="mr-1" />
          </div>
        </div>
        <div class="grid grid-cols-8">
          <div class="col-span-2" />
          <div class="col-span-6 text-sk-red">
            이미 등록된 단말기 번호입니다.
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            단말기 모델명
          </div>
          <div class="col-span-4 my-auto">
            <el-input size="large" />
          </div>
        </div>
        <div class="my-3 grid grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">설명</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" type="textarea" rows="5" />
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록일</div>
          <div class="col-span-6 my-auto">DFDF</div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록자</div>
          <div class="col-span-6 my-auto">DFDF</div>
        </div>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { IDataTableHeader } from "~/interfaces/data.interface";

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


    const getTerminal = (param: string) => {
      console.log("getTerminal",param)
      var token= "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJ0ZXN0IiwiaWF0IjoxNjQ1NDYwODQ0LCJleHAiOjE2NDU0NjY4NDR9.LUoksT9S08QQlAFgTM1I5nap0wdoUGOJg_qTmClxPfg"
      window.localStorage.setItem("token", token)
      token = window.localStorage.getItem(key)
      let data: any[] = [];

      axios.get('http://tms-test-server.p-e.kr:8081/terminal/list?page=1&page_count=2&' + param,
        {headers: {
          Authorization: token, // header의 속성
        }},
      )
      .then(response => {
        var list = response.data.list

        for (var object of list){
          var obj = renmeObjectKey(object);
          data.push(obj);
        }     
        update(data); 
      });
    };

    return {
      header,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
