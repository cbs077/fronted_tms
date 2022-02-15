<template>
  <div
    class="mb-12 w-full text-ellipsis"
    :class="{
      'mb-0': noPagination,
    }"
  >
    <div class="relative mb-6 flex w-full min-w-0 flex-col break-words rounded">
      {{ tableTitle }}
      <div class="mb-4 flex">
        <slot name="tableAbove">
          <div class="grow"></div>
        </slot>
        <select-box
          v-if="noTake === false"
          class="ml-2 h-10 w-24"
          :items="take.available"
          @update:select="(value) => (take.select = value)"
        ></select-box>
      </div>
      <div class="block w-full max-w-full rounded border border-sk-gray">
        <table class="table w-full border-collapse items-center bg-transparent">
          <slot name="header" :headers="headers">
            <data-table-header
              :headers="headers"
              class="border-b border-sk-gray bg-sk-lightgray"
            />
          </slot>

          <tbody>
            <slot name="row" :items="items">
              <data-table-row
                v-for="(item, index) of displayItems"
                :key="index"
                class="text-center hover:bg-sk-red hover:bg-opacity-50 hover:text-white"
                :item="item"
                @click="onRowClick(index)"
              />
            </slot>
          </tbody>
        </table>

        <p v-show="displayItems.length === 0" class="my-3 text-center">
          검색 결과가 없습니다.
        </p>
      </div>
    </div>
  </div>

  <div v-if="noPagination === false" class="flex w-full justify-center">
    <simple-pagination class="mb-12"></simple-pagination>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, watch } from "vue";

import SimplePagination from "~/components/molecules/simple-pagination.vue";
import DataTableRow from "~/components/molecules/table/data-table-row.vue";
import DataTableHeader from "~/components/molecules/table/table-header.vue";
import SelectBox from "~/components/organisms/select-box.vue";
import { useConst } from "~/hooks/const.hooks";
import { IDataTableHeader } from "~/interfaces/data-table.interface";

export default defineComponent({
  name: "DataTable",
  components: { DataTableHeader, DataTableRow, SimplePagination, SelectBox },
  props: {
    tableTitle: { type: String, required: false, default: undefined },
    headers: {
      type: Object as PropType<IDataTableHeader[]>,
      required: true,
      default: undefined,
    },
    items: {
      type: Object as PropType<any>,
      required: true,
      default: undefined,
    },
    noPagination: {
      type: Boolean,
      required: false,
      default: false,
    },
    noTake: {
      type: Boolean,
      required: false,
      default: false,
    },
    checkable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["click:row", "update:take", "update:item"],
  setup(properties, { emit }) {
    const { take } = useConst();
    const headerOrder = computed(
      () => properties.headers?.map((header) => header.key) || []
    );

    const displayItems = computed(() =>
      properties.items.map((item: any) => {
        const data = [];

        for (const header of headerOrder.value) {
          data.push(item[header]);
        }

        return data;
      })
    );

    watch(properties.items, () => emit("update:item", properties.items));

    watch(
      () => take.select,
      (newValue) => emit("update:take", newValue)
    );

    const onRowClick = (index: number) =>
      emit("click:row", properties.items.value[index]);

    return { displayItems, onRowClick, take };
  },
});
</script>
