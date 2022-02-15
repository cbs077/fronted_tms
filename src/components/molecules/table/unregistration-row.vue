<template>
  <tr>
    <td class="text-center">
      <input
        class="ml-6 rounded text-black"
        type="checkbox"
        :checked="item.checked"
      />
    </td>
    <td
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="item.van"
    >
      {{ item.van }}
    </td>
    <td
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="item.modelCode"
    >
      {{ item.modelCode }}
    </td>
    <td
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="item.deviceNumber"
    >
      {{ item.deviceNumber }}
    </td>
    <td
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="item.swGroupCode"
    >
      {{ item.swGroupCode }}
    </td>
    <td
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="item.swVersion"
    >
      {{ item.swVersion }}
    </td>
    <td
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="item.status"
    >
      {{ item.status }}
    </td>
    <td
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="item.applicationDate"
    >
      {{ item.applicationDate }}
    </td>
    <td
      class="truncate whitespace-nowrap border-t-0 border-l-0 border-r-0 p-4 px-6 align-middle text-xs"
      :title="item.lastAccessDate"
    >
      {{ item.lastAccessDate }}
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    item: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
});
</script>
