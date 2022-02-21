<template>
  <base-nav-bar
    :menus="gnbs"
    :user-name="userName"
    @click:menu="onGnbMenuClicked"
  />

  <el-row class="tac mt-4">
    <el-col :span="4">
      <el-menu
        class="h-full"
        active-text-color="#EA002C"
        :default-active="defaultActiveMenu"
      >
        <template v-for="lnb in lnbs">
          <el-sub-menu v-if="lnb.childs" :key="lnb.text" :index="lnb.text">
            <template #title>
              <span>{{ lnb.text }}</span>
            </template>
            <el-menu-item
              v-for="sub in lnb.childs"
              :key="sub.text"
              :index="`${lnb.text}-${sub.text}`"
              @click="$router.push(sub.to)"
            >
              {{ sub.text }}
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item
            v-else
            :key="lnb.text"
            :index="lnb.text"
            @click="$router.push(lnb.to || '/')"
          >
            <span>{{ lnb.text }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <div class="w-full px-5">
        <router-view />
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
import { computed, defineComponent, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import BaseNavBar from "~/components/organisms/base-nav.vue";
import { useConst } from "~/hooks/const.hooks";
import { INavMenuItem } from "~/interfaces/menu.interface";

export default defineComponent({
  components: { BaseNavBar, ElMenu, ElMenuItem, ElSubMenu },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { lnbs, gnbs } = useConst();
    const userName = "SK TMS";

    const isVan = true;

    const displayLnbs = computed(() => {
      const { path } = router.currentRoute.value;

      if (path.includes("/sw-managements-managements")) {
        return [];
      }

      if (path.includes("/devices")) {
        return lnbs(isVan).devices();
      }

      if (path.includes("/accounts")) {
        return lnbs(isVan).accounts();
      }

      if (path.includes("/monitors")) {
        return lnbs(isVan).monitors();
      }

      if (path.includes("/sw-managements")) {
        return lnbs(isVan).swManagements();
      }

      if (path.includes("/vans") && !isVan) {
        return lnbs(isVan).vans();
      }

      return [];
    });
    const defaultActiveMenu = computed(() => {
      for (const lnb of displayLnbs.value) {
        if ("to" in lnb && lnb.to === route.path) {
          return lnb.text;
        }

        if ("childs" in lnb) {
          for (const sub of lnb.childs || []) {
            if (sub.to === route.path) {
              return `${lnb.text}-${sub.text}`;
            }
          }
        }
      }

      return displayLnbs.value[0]?.text || "";
    });

    const onGnbMenuClicked = ({ to }: INavMenuItem) => router.push(to);
    let displayGnbs = reactive<INavMenuItem[]>([...gnbs(isVan)]);

    return {
      gnbs: displayGnbs,
      lnbs: displayLnbs,
      userName,
      onGnbMenuClicked,
      defaultActiveMenu,
    };
  },
});
</script>
