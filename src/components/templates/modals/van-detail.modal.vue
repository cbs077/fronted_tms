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
          <div class="col-span-2 my-auto text-center font-bold">VAN사 코드</div>
          <div class="col-span-6 my-auto">
            {{ van.vanCode }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">VAN사명</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" :value="van.van"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">담당자</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" :value="van.manager"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">전화번호</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" :value="van.contact"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">팩스번호</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" :value="van.fax"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">주소</div>
          <div class="col-span-6 my-auto">
            <el-input size="large" :value="van.fax"></el-input>
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록일</div>
          <div class="col-span-6 my-auto">
            {{ van.date }}
          </div>
        </div>
        <div class="my-3 grid h-10 grid-cols-8">
          <div class="col-span-2 my-auto text-center font-bold">등록자</div>
          <div class="col-span-6 my-auto">
            {{ van.user }}
          </div>
        </div>
      </div>
      <div v-if="!admin" class="mt-12 text-center">
        <base-button
          class="mr-4 border-sk-gray bg-sk-gray text-white"
          text="수정 및 저장"
          type="button"
          @click="$emit('click:positive')"
        />
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";
import { useConst } from "~/hooks/const.hooks";
import { IAdminVan } from "~/interfaces/data.interface";

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
  },
  props: {
    van: {
      type: Object as PropType<IAdminVan>,
      required: true,
      default: () => ({
        vanCode: "string",
        van: "string",
        address: "string",
        contact: "string",
        manager: "string",
        date: "string",
        user: "string",
        fax: "string",
      }),
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
    const { deviceModels, swVersions, swGroupCodes } = useConst();
    return {
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
