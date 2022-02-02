<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="단말기 신규 등록"
    negative-text="초기화"
    positive-text="저장"
  >
    <template #modalBody>
      <div class="my-6 flex">
        <input
          id="device-register-normal"
          v-model="uploadMethodSelection"
          type="radio"
          value="일반등록"
          class="ml-12 translate-y-1 text-black transition"
        >
        <label
          for="device-register-normal"
          class="ml-4"
        >일반등록</label>
        <input
          id="device-register-bulk"
          v-model="uploadMethodSelection"
          type="radio"
          value="일괄등록"
          class="ml-12 translate-y-1 text-black transition"
        >
        <label
          for="device-register-bulk"
          class="ml-4"
        >일괄등록</label>
      </div>

      <!-- 일반등록 -->
      <div
        v-show="uploadMethodSelection === '일반등록'"
        class="my-3 grid h-12 grid-cols-8"
      >
        <div class="col-span-2 my-auto text-center font-bold">
          단말기 번호
        </div>
        <div class="col-span-6 flex">
          <input class="h-10 w-9/12 rounded border border-sk-gray">

          <base-button
            class="ml-2 w-2/12"
            text="중복확인"
          />
        </div>
      </div>

      <!-- 일괄등록 -->
      <div
        v-show="uploadMethodSelection === '일괄등록'"
        class="my-3 grid h-12 grid-cols-8"
      >
        <div class="col-span-2 my-auto text-center font-bold">
          단말기 번호
        </div>

        <div class="col-span-6 flex">
          <div class="flex w-9/12">
            <input class="mr-4 h-10 w-3/12 rounded border border-sk-gray">
            <input class="h-10 w-4/12 rounded border border-sk-gray">
            <div class="my-auto mx-2 w-1/12 text-center">
              ~
            </div>
            <input class="h-10 w-4/12 rounded border border-sk-gray">
          </div>
          <base-button
            class="ml-2 w-2/12"
            text="중복확인"
          />
        </div>
      </div>

      <div class="mb-3 grid grid-cols-12">
        <p class="col-span-6 col-start-4 text-sk-red">
          이미 등록된 단말기 번호입니다.
        </p>
        <p class="col-span-6 col-start-4 text-sk-teal">
          등록 가능한 번호입니다.
        </p>
      </div>

      <div class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">
          단말기 모델
        </div>
        <div class="col-span-6">
          <select-box
            :items="deviceModels"
            class="w-3/4"
          />
        </div>
      </div>
      <div class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">
          S/W Group 명
        </div>
        <div class="col-span-6">
          <select-box
            :items="swVersions"
            class="w-3/4"
          />
        </div>
      </div>
      <div class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">
          등록일
        </div>
        <div class="col-span-6 my-auto">
          2020-02-02
        </div>
      </div>
      <div class="my-3 grid h-12 grid-cols-8">
        <div class="col-span-2 my-auto text-center font-bold">
          등록자
        </div>
        <div class="col-span-6 my-auto">
          SK TMS
        </div>
      </div>
    </template>

    <template #modalAction>
      <div class="mt-12 text-center">
        <base-button
          class="mr-4 bg-sk-gray text-white"
          text="저장"
          type="button"
          @click="$emit('click:positive')"
        />
        <base-button
          class="mr-4"
          text="초기화"
          type="button"
          @click="$emit('click:negative')"
        />
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import { DEVICE_REGISTER_TYPE } from "~/@types/union";
import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import { useConst } from "~/hooks/const.hooks";

export default defineComponent({
  components: {
    BaseButton,
    BaseModal,
    SelectBox,
  },
  props: {
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

    const uploadMethodSelection = ref<DEVICE_REGISTER_TYPE>("일반등록");

    const { deviceModels, swVersions } = useConst();

    return {
      uploadMethodSelection,
      deviceModels,
      swVersions,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
