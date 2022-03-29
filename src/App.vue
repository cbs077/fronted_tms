<template>
  <div>
    <base-nav-bar
      v-if="!isLoginPage"
      :menus="displayGnbs"
      :user-name="userName"
      @click:menu="onGnbMenuClicked"
    />

    <el-row class="tac mt-4">
      <el-col  v-if="!isLoginPage" :span="4">
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
              @click="onClickLnb(lnb)"
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
  </div>
  <!-- <login-page v-if="data.isLoginPage" @click:login="onLogin"></login-page> -->
</template>

<script lang="ts">
import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus";
import { computed, defineComponent, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import BaseNavBar from "~/components/organisms/base-nav.vue";
import LoginPage from "~/pages/login.vue";
//import Login from "~/pages/login.vue";
import { useConst } from "~/hooks/const.hooks";
import { INavMenuItem } from "~/interfaces/menu.interface";
import { useStore } from "vuex";

export default defineComponent({
  components: { BaseNavBar, ElMenu, ElMenuItem, ElSubMenu, LoginPage },
  setup() {
    const router = useRouter();
    const route = useRoute();
    let { lnbs, gnbs} = useConst();
    const userName = "SK TMS";
    const store = useStore();
    let isLoginPage = computed(() => store.state.isLoginPage); // 상태값 가져오기
    let data = reactive({
       gnbs: [],
       isVan: store.state.isVan //window.localStorage.getItem("is_van"),
    })
    store.state.isVan = eval(window.localStorage.getItem("is_van")) === true

    const displayLnbs = computed(() => {    
      data.isVan =  eval(window.localStorage.getItem("is_van")) === true

      const { path } = router.currentRoute.value;

      if (path.includes("/sw-managements-managements")) {
        return [];
      }

      if (path.includes("/devices")) {
        return lnbs(data.isVan).devices();
      }

      if (path.includes("/accounts")) {
        return lnbs(data.isVan).accounts();
      }

      if (path.includes("/monitors")) {
        return lnbs(data.isVan).monitors();
      }

      if (path.includes("/sw-managements")) {
        return lnbs(data.isVan).swManagements();
      }

      if (path.includes("/vans") && !data.isVan) {
        return lnbs(data.isVan).vans();
      }
      return [];
    });

    const onClickLnb = computed((lnb) =>{
      $router.push(lnb.to || '/')
    });

    const defaultActiveMenu = computed(() => {
      checkLoginPage()
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

    function checkLoginPage(){
      store.state.isVan = eval(window.localStorage.getItem("is_van")) === true
      store.state.menuss= [...gnbs(data.isVan)]

    }

    const onGnbMenuClicked = ({ to }: INavMenuItem)  =>{
      console.log("route.path", to)
      router.push(to)
    };

    let displayGnbs = reactive<INavMenuItem[]>([...gnbs(data.isVan)]);
    checkLoginPage()

    return {
      displayGnbs,
      lnbs: displayLnbs,
      userName,
      onGnbMenuClicked,
      defaultActiveMenu,
      data,
      onClickLnb,
      isLoginPage,
    };
  },
});
</script>

