<template>
  <base-nav-bar :menus="gnbs" :user-name="userName"></base-nav-bar>

  <div class="mt-6 flex">
    <base-sidebar
      class="w-fit min-w-sidebar lg:w-60"
      :menus="lnbs"
    ></base-sidebar>
    <div class="w-full px-6">
      <router-view class="max-w-full" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BaseNavBar from "~/components/organisms/base-nav.vue";
import BaseSidebar from "~/components/organisms/base-sidebar.vue";
import { useConst } from "~/hooks/const.hooks";

export default defineComponent({
  components: { BaseSidebar, BaseNavBar },
  setup() {
    const { lnbs, gnbs } = useConst();
    const userName = "SK TMS";
    return { gnbs, lnbs: lnbs(true), userName };
  },
});
</script>
