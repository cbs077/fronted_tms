<template>
  <button
    class="h-10 w-32 rounded border border-sk-gray bg-white p-1 hover:border-sk-red hover:bg-sk-red hover:text-white"
  >
    <slot name="button-body">
      <div>{{ text }}</div>
    </slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseButton",
  props: {
    text: {
      type: String,
      required: false,
      default: "Button",
    },
  },
});
</script>

<style scoped></style>
