<template>
  <div
    class="h-10 min-w-fit rounded border border-sk-gray hover:border-sk-red hover:bg-sk-red hover:text-white focus:border-sk-red"
  >
    <listbox v-model="selectedOption" class="h-10">
      <div class="relative">
        <listbox-button
          class="relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        >
          <span class="block truncate">{{ selectedOption.value }}</span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <selector-icon class="h-5 w-5" aria-hidden="true" />
          </span>
        </listbox-button>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <listbox-options
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <listbox-option
              v-for="item in items"
              v-slot="{ active, selected }"
              :key="item.value"
              :value="item"
              as="template"
            >
              <li
                :class="[
                  active
                    ? 'bg-sk-red bg-opacity-50 text-white'
                    : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                  >{{ item.value }}</span
                >
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <CheckIcon class="h-5 w-5 text-sk-red" aria-hidden="true" />
                </span>
              </li>
            </listbox-option>
          </listbox-options>
        </transition>
      </div>
    </listbox>
  </div>
</template>

<script>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/outline";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    SelectorIcon,
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["update:select"],
  setup(properties, { emit }) {
    const selectedOption = ref(properties.items[0]);
    watch(selectedOption, (newValue) => {
      console.log("newValue", newValue)
      emit("update:select", newValue);
    });

    return {
      selectedOption,
    };
  },
});
</script>
