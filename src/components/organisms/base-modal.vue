<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog class="w-2/3" as="div" @close="closeModal">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0" />
          </TransitionChild>

          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div
              class="my-8 inline-block w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              :class="{
                'max-w-3xl': !small,
                'max-w-md': small,
              }"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                <p
                  class="flex"
                  :class="{
                    'text-sk-red': danger,
                  }"
                >
                  {{ title }}
                  <x-icon
                    class="ml-auto h-6 w-6 cursor-pointer"
                    @click="closeModal"
                  ></x-icon>
                </p>
              </DialogTitle>
              <hr class="my-3" />
              <slot name="modalBody"></slot>

              <slot v-if="noAction !== true" name="modalAction">
                <div class="mt-4 text-center">
                  <base-button
                    v-if="positiveText"
                    class="mr-4"
                    :text="positiveText"
                    type="button"
                    @click="$emit('click:positive')"
                  />
                  <base-button
                    v-if="negativeText"
                    class="mr-4"
                    :text="negativeText"
                    type="button"
                    @click="$emit('click:negative')"
                  />
                </div>
              </slot>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import { computed, defineComponent } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";

export default defineComponent({
  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    BaseButton,
    XIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
    positiveText: { type: String, required: false, default: undefined },
    negativeText: { type: String, required: false, default: undefined },
    noAction: {
      type: Boolean,
      default: false,
    },
    danger: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "click:positive", "click:negative"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value) => {
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
