<template>
  <button
    class="h-10 w-32 rounded border border-sk-gray p-1"
    :class="{
      'bg-sk-lightgray': disabled,
      'hover:border-sk-red hover:bg-sk-red hover:text-white': !disabled,
    }"
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>

<style scoped></style>
