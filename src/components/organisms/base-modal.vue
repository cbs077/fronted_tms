<template>
  <el-dialog
    v-model="isOpen"
    :title="title"
    :width="large ? '70%' : small ? '30%' : '50%'"
    :draggable="true"
    :before-close="
      (done) => {
        if (noExitGuard) {
          done();
        } else {
          handleClose(done);
        }
      }
    "
  >
    <div
      class="inline-block w-full transform overflow-hidden bg-white text-left align-middle transition-all"
    >
      <slot name="modalBody" />

      <slot v-if="noAction !== true" name="modalAction">
        <div class="mt-4 text-center">
          <base-button
            v-if="positiveText"
            class="mr-4 bg-sk-gray text-white"
            :text="positiveText"
            type="button"
            @click="$emit('click:positive')"
          />
          <base-button
            v-if="negativeText"
            class="mr-4"
            :text="negativeText"
            type="button"
            @click="$emit('click:negative')"
          />
        </div>
      </slot>
    </div>
  </el-dialog>
</template>

<script>
import { ElDialog, ElMessageBox } from "element-plus";
import { computed, defineComponent } from "vue";

import BaseButton from "~/components/atoms/base-button.vue";

export default defineComponent({
  components: {
    ElDialog,
    BaseButton,
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
    positiveText: { type: String, required: false, default: undefined },
    negativeText: { type: String, required: false, default: undefined },
    noAction: {
      type: Boolean,
      default: false,
    },
    danger: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    noExitGuard: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "click:positive", "click:negative"],

  setup(properties, { emit }) {
    const isOpen = computed({
      get: () => properties.modelValue,
      set: (value) => {
        emit("update:modelValue", value);
      },
    });

    const handleClose = (done) => {
      ElMessageBox.confirm(
        "<p class='text-center text-sk-red'>지금 나가면 내용은 저장되지 않습니다. 정말 나가시겠습니까?</p>",
        "Alert!",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "나가기",
          cancelButtonText: "취소",
        }
      )
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    };

    return {
      handleClose,
      isOpen,
      closeModal() {
        isOpen.value = false;
      },
    };
  },
});
</script>
