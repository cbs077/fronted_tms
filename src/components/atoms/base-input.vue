<template>
  <div class="flex justify-between rounded border border-sk-gray ring-sk-red focus-within:border-sk-red">
    <input
      v-model="query"
      class="m-1 h-8 flex-1 appearance-none border-none px-2 py-0 focus:outline-none focus:ring-0"
    >
    <button
      class="m-1 flex h-8 w-full w-8 transform items-center justify-center rounded-md p-2 p-0 text-sk-gray transition-colors duration-200 hover:text-sk-red focus:outline-none"
      @click="$emit('click:cancel')"
    >
      <x-icon class="h-4" />
    </button>
  </div>
</template>

<script lang="ts">
import { XIcon } from "@heroicons/vue/outline";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "BaseInput",
  components: { XIcon },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["click:cancel", "update:modelValue"],
  setup(properties, { emit }) {
    const query = computed({
      get: () => {
        console.log("properties.modelValue", properties.modelValue) 
        return properties.modelValue
      },
      set: (value) => {
        console.log("query_set", value)
        //return value
        emit("update:modelValue", value);
        return value;
      },
    });
    return { query };
  },
});
</script>
