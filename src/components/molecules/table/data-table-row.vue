<template>
  <tr>
    <td
      v-for="(value, index) of item"
      :key="index"
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="value"
    >
      {{ value }}
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DataTableHeader",
  props: {
    item: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
});
</script>
