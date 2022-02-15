<template>
  <thead>
    <tr>
      <th class="rounded-tl"></th>
      <th
        v-for="({ align, value, key }, index) of headers"
        :key="index"
        class="whitespace-nowrap px-6 py-3 text-left align-middle text-xs font-semibold uppercase"
        :class="{
          'text-center': align === 'center',
          'text-right': align === 'right',
          'text-left': align === 'left',
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
  name: "TableCheckableHeader",
  props: {
    headers: {
      type: Array as PropType<IDataTableHeader[]>,
      required: true,
      default: () => [],
    },
  },
});
</script>
