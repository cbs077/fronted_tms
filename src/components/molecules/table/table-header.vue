<template>
  <thead>
    <tr>
      <th
        v-for="({ align, value, key }, index) of headers"
        :key="index"
        class="whitespace-nowrap px-6 py-3 text-left align-middle text-xs font-semibold uppercase"
        :class="{
          'text-center': align === 'center',
          'text-right': align === 'right',
          'text-left': align === 'left',
          'rounded-tl': index === 0,
          'rounded-tr': index === headers.length - 1,
        }"
      >
        {{ value || key }}
      </th>
    </tr>
  </thead>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { IDataTableHeader } from "~/interfaces/data-table.interface";

export default defineComponent({
  name: "DataTableHeader",
  props: {
    headers: {
      type: Array as PropType<IDataTableHeader[]>,
      required: true,
      default: () => [],
    },
  },
});
</script>
