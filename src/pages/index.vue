<template>
  <data-table :headers="headers" :items="devices"></data-table>
</template>
<script>
import { defineComponent } from "vue";

import DataTable from "~/components/organisms/data-table.vue";

import { useDevice } from "../hooks/devices.hooks";

export default defineComponent({
  components: { DataTable },
  setup() {
    const { headers, devices } = useDevice();

    return { headers, devices };
  },
});
</script>
