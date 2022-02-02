<template>
  <p class="mb-6 text-2xl font-bold">
    {{ text }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BreadCrumb",
  props: {
    text: { type: String, default: "" },
  },
});
</script>
