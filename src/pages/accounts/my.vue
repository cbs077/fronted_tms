<template>
  <bread-crumb text="개인정보" />
  <div
    class="mb-4 grid grid-cols-8 rounded border border-sk-gray bg-option-background p-3 pl-8 text-center"
  >
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">아이디</div>
      <div>SK TMS</div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">소속사</div>
      <div>퍼스트데이터</div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">담당자명</div>
      <div class="w-9/12">
        <el-input size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex" />
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">전화번호</div>
      <div class="w-9/12">
        <el-input size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">팩스번호</div>
      <div class="w-10/12">
        <el-input size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-8 my-3 flex">
      <div class="label-width my-auto w-1/12">주소</div>
      <div class="w-full">
        <el-input size="large" placeholder="Please Input" />
      </div>
    </div>

    <div class="col-span-8 my-3">
      <hr />
    </div>

    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">패스워드</div>
      <div class="w-9/12">
        <el-input size="large" placeholder="Please Input" />
      </div>
    </div>
    <div class="col-span-4 my-3 flex">
      <div class="label-width my-auto w-2/12">패스워드 확인</div>
      <div class="w-10/12">
        <el-input size="large" placeholder="Please Input" />
      </div>
    </div>
  </div>

  <div class="flex">
    <base-button
      text="정보 수정 및 저장"
      class="mx-auto w-4/12 bg-sk-gray text-white"
    />
  </div>
</template>
<script lang="ts">
import { Search } from "@element-plus/icons-vue";
import { defineComponent, reactive, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import { useConst } from "~/hooks/const.hooks";
import { useDevice } from "~/hooks/devices.hooks";

export default defineComponent({
  name: "DeviceRegistrations",
  components: {
    BaseButton,
  },
  setup() {
    const { registrationHeaders: headers, devices } = useDevice();
    const { searchOptions } = useConst();

    const deviceRegistration = reactive({
      modal: false,
    });

    const registrationResult = reactive({
      modal: false,
      items: [
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
        {
          deviceNumber: "1111",
          status: "성공",
        },
      ],
    });

    const deviceDetail = reactive({
      modal: false,
      van: {},
    });

    const selectOption = ref();

    return {
      selectOption,
      deviceDetail,
      headers,
      devices,
      searchOptions,
      deviceRegistration,
      registrationResult,
      Search,
    };
  },
});
</script>

<style scoped>
.label-width {
  min-width: 140px;
}
</style>
