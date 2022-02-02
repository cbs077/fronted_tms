<template>
  <div class="mb-3 mt-6 text-center">
    <base-button
      text="초기화"
      class="mr-1 bg-white"
      @click="$emit('click:reset')"
    />
    <base-button
      text="검색"
      class="ml-1 bg-sk-lightgray"
      @click="$emit('click:search')"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";

export default defineComponent({
  name:'OptionsSearchButton',
  components: { BaseButton },
  emits: ["click:reset", "click:search"],
});
</script>
