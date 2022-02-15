<template>
  <div class="w-full rounded-2xl bg-white p-2">
    <template
      v-for="(menu, menuIndex) in menus"
      :key="`${menu.text}-${menuIndex}`"
    >
      <p
        v-if="menu.header === true"
        class="pl-4 text-2xl font-bold text-sk-red"
      >
        {{ menu.text }}
      </p>
      <disclosure v-else v-slot="{ open: firstOpen }">
        <disclosure-button
          class="flex w-full justify-between px-4 py-2 text-left hover:bg-sk-red hover:bg-opacity-50 hover:text-white focus:outline-none"
        >
          <span>{{ menu.text }}</span>
          <chevron-up-icon
            v-if="menu.childs"
            :class="firstOpen ? 'rotate-180 transform' : 'rotate-90'"
            class="h-5 w-5 text-sk-red transition duration-300"
          />
        </disclosure-button>
        <disclosure-panel v-if="menu.childs" class="px-4 pt-4 pb-2 text-sm">
          <ul class="ml-4">
            <li
              v-for="(subMenu, secondIndex) in menu.childs"
              :key="`${subMenu}-${secondIndex}`"
            >
              <router-link :to="subMenu.to" v-text="subMenu.text"></router-link>
            </li>
          </ul>
        </disclosure-panel>
      </disclosure>
    </template>
  </div>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/outline";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronUpIcon,
  },
  props: {
    menus: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
});
</script>
