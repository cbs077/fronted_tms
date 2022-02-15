<template>
  <div class="flex h-10">
    <arrow-circle-left-icon
      :disabled="disableLeftButton"
      class="text-sk-red hover:cursor-pointer"
    />

    <base-button
      v-for="index in end"
      v-show="index >= start"
      :key="index"
      class="h-10 w-10"
      :class="{
        'mx-1': index !== end || index !== 1 || index >= start,
      }"
      :text="`${index}`"
      @click="$emit('click:pagination', index)"
    ></base-button>

    <arrow-circle-right-icon
      class="text-sk-red hover:cursor-pointer"
      :disabled="disableRightButton"
    />
  </div>
</template>

<script lang="ts">
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
} from "@heroicons/vue/outline";
import { defineComponent } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";

export default defineComponent({
  name: "SimplePagination",
  components: { ArrowCircleLeftIcon, ArrowCircleRightIcon, BaseButton },
  props: {
    text: {
      type: String,
      required: false,
      default: "",
    },
    disableLeftButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableRightButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    start: {
      type: Number,
      required: false,
      default: 1,
    },
    end: {
      type: Number,
      required: false,
      default: 10,
    },
  },
  emits: ["click:pagination"],
});
</script>
