<template>
  <base-modal v-model="isOpen" class="w-2/3" :title="title" no-action>
    <template #modalBody>
      <div class="rounded border border-sk-gray">
        <el-table :data="items" fit class="rounded">
          <el-table-column
            prop="deviceNumber"
            label="단말기번호"
            align="center"
          />

          <el-table-column prop="status" label="상태" align="center" />
        </el-table>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import BaseModal from "~/components/organisms/base-modal.vue";
import { IDataTableHeader } from "~/interfaces/data-table.interface";

export default defineComponent({
  components: {
    BaseModal,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    modelValue: {
      type: Boolean,
      required: false,
      default: true,
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value: boolean) => {
        emit("update:modelValue", value);
      },
    });

    const header: IDataTableHeader[] = [
      { key: "deviceNumber", value: "단말기 번호" },
      { key: "status", value: "상태" },
    ];

    return {
      header,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
