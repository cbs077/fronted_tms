<template>
  <base-modal
    v-model="isOpen"
    class="w-2/3"
    :title="title"
    no-action
    danger
    small
  >
    <template #modalBody>
      <div class="text-center">{{ text }}</div>
      <div class="mt-12 text-center">
        <base-button
          class="mr-4 border-sk-red bg-sk-red text-white"
          :text="positiveText"
          type="button"
          @click="$emit('click:positive')"
        />
        <base-button
          class="mr-4 border-sk-red text-sk-red"
          :text="negativeText"
          type="button"
          @click="
            () => {
              closeModal();
              $emit('click:negative');
            }
          "
        />
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";
import BaseModal from "~/components/organisms/base-modal.vue";

export default defineComponent({
  components: {
    BaseModal,
    BaseButton,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    text: {
      type: String,
      required: true,
      default: "",
    },
    positiveText: {
      type: String,
      required: true,
      default: "",
    },
    negativeText: {
      type: String,
      required: true,
      default: "",
    },
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

    return {
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
