<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    title="Alert!"
    negative-text="취소"
    positive-text="나가기"
  />
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";

import BaseModal from "~/components/organisms/base-modal.vue";

export default defineComponent({
  components: {
    BaseModal,
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

    return {
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
