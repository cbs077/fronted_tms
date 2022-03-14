<template>
  <div class="mb-4 flex">
    <slot name="body">
      <div class="grow" />
    </slot>
    <el-select
      v-if="!noTake"
      v-model="take.select"
      placeholder="선택"
      size="large"
      class="ml-2 w-1/12"
    >
      <el-option
        v-for="item in take.available"
        :key="item.value"
        :label="item.value"
        :value="item.key"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";

import { useConst } from "~/hooks/const.hooks";

export default defineComponent({
  props: { noTake: { type: Boolean, default: false } },
  emits: ["update:take"],
  setup(properties, { emit }) {
    const { take } = useConst();
    watch(
      () => take.select,
      (newValue) => {
        emit("update:take", newValue)
      }
    );

    return { take };
  },
});
</script>
