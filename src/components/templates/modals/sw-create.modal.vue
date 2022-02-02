<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="S/W Group 등록"
    positive-text="저장"
    negative-text="초기화"
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 아이디
          </div>
          <div class="col-span-4 my-auto">
            <el-select
              clearable
              placeholder="선택"
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in groupIds"
                :key="item"
                :label="item"
                :value="item"
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
              size="large"
              class="w-full"
            >
              <el-option
                v-for="item in groupNames"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Version
          </div>
          <div class="col-span-4 my-auto">
            <el-input size="large" />
          </div>
          <div class="col-span-2 my-auto text-center font-bold">
            <base-button
              text="중복확인"
              class="mr-1"
            />
          </div>
        </div>
        <div class="grid grid-cols-8">
          <div class="col-span-2" />
          <div class="col-span-6 text-sk-red">
            이미 등록된 단말기 번호입니다.
          </div>
        </div>
        <div class="my-3 grid grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W 파일 업로드
          </div>
          <div class="col-span-4 my-auto">
            <input
              size="large"
              type="file"
            >
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            등록일
          </div>
          <div class="col-span-6 my-auto">
            {{ registrationUser }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            등록자
          </div>
          <div class="col-span-6 my-auto">
            {{ registrationUser }}
          </div>
        </div>
      </div>

      <div class="mx-3 border border-sk-lightgray p-3">
        * S/W Version은 최대 10자리의 숫자로 입력해 주십시오.(문자를 입력하실 경우 10자리를 채워 주십시오.)<br>
        * S/W Version 입력 시 앞서 등록한 Version 이후 Version으로 입력해 주셔야 합니다.<br>
        * S/W 등록 시 등록 파일의 확장자가 exe와 같은 실행파일은 업로드 불가하며 최대 Upload 파일 크기는 1M입니다.
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { useConst } from "~/hooks/const.hooks";

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
  },
  props: {
    name: { type: String },
    code: { type: String },
    description: { type: String },
    registrationDate: { type: String },
    registrationUser: { type: String },
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
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

    const groupIds = ref([]);
    const groupNames = ref<{ value: string }>();

    return {
      groupIds,
      groupNames,
      deviceModels,
      swVersions,
      swGroupCodes,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
