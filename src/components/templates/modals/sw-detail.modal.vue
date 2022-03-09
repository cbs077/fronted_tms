<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    :title="title"
    no-action
    no-exit-guard
  >
    <template #modalBody>
      <div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 코드
          </div>
          <div class="col-span-6 my-auto">
            {{ device.swGroupCode }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W Group 명
          </div>
          <div class="col-span-6 my-auto">
            {{ device.swGroupNm }}
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
          <div class="col-span-2 my-auto text-center font-bold">
            Upload 파일명
          </div>
          <div class="col-span-6 my-auto">
            {{ device.swFileNm }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">파일 Size</div>
          <div class="col-span-6 my-auto">
            {{ device.swFileSize }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">
            S/W버전 업데이트 이력
          </div>
          <div class="col-span-6 my-auto">
            {{ device.status }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록일</div>
          <div class="col-span-6 my-auto">
            {{ device.regDt }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록자</div>
          <div class="col-span-6 my-auto">
            {{ device.regUser }}
          </div>
        </div>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";

import BaseModal from "~/components/organisms/base-modal.vue";
import { useConst } from "~/hooks/const.hooks";

export default defineComponent({
  components: {
    BaseModal,
  },
  props: {
    // name: { type: String },
    // code: { type: String },
    // description: { type: String },
    // registrationDate: { type: String },
    // registrationUser: { type: String },
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
    sandboxes: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    device: {
      type: Object,
      required: true,
      default: () => {},
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

    const title = `${properties.sandboxes ? "테스트" : "운영"} S/W 상세내용`;
    return {
      title,
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
