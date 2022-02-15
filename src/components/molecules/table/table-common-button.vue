<template>
  <div class="mb-4 flex">
    <slot name="body">
      <div class="grow"></div>
    </slot>
    <select-box
      v-if="noTake === false"
      class="ml-2 h-10 w-28"
      :items="take.available"
      @update:select="(value) => (take.select = value)"
    ></select-box>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";

import SelectBox from "~/components/organisms/select-box.vue";
import { useConst } from "~/hooks/const.hooks";

export default defineComponent({
  components: { SelectBox },
  props: { noTake: { type: Boolean, default: false } },
  emits: ["update:take"],
  setup(properties, { emit }) {
    const { take } = useConst();
    watch(
      () => take.select,
      (newValue) => emit("update:take", newValue)
    );

    return { take };
  },
});
</script>
