<template>
  <div>
    <base-nav-bar
      v-if="!isLoginPage"
      :menus="gnbs"
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
    const { lnbs, gnbs } = useConst();
    const userName = "SK TMS";
    const store = useStore();
    let isLoginPage = computed(() => store.state.isLoginPage); // 상태값 가져오기
    let data = reactive({
       isVan: store.state.userRight //window.localStorage.getItem("is_van"),
    })
    store.state.userRight = eval(window.localStorage.getItem("is_van")) === true
    //console.log("data.isVan", data.isVan)
    //store.state.userRight = window.localStorage.getItem("is_van")
    //data.isVan = store.state.userRight 

    const displayLnbs = computed(() => {    
     // data.isVan = true //window.localStorage.getItem("is_van")
      // data.isVan = true
      // displayGnbs = [...gnbs(data.isVan)]
      console.log("data.isVan1", data.isVan)
      console.log("displayLnbs", store.getters.userRight)

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
      //data.isVan = true
      //displayGnbs = [...gnbs(data.isVan)]
      store.state.userRight = eval(window.localStorage.getItem("is_van")) === true
      //displayGnbs = [...gnbs(data.isVan)]
      console.log("checkLoginPage")
      //data.isVan = eval(window.localStorage.getItem("is_van")) === true 
      // console.log("checkLoginPage", window.location.hash)
      // if(window.location.hash == "#/login"  ) {
      //   store.commit("setisLoginPage", true);
      //   store.state.isLoginPage = true
      // }
      // else{
      //   store.commit("setisLoginPage", false); 
      //   store.state.isLoginPage = false
      // }
      //console.log("store.state.userRight", store.getters.userRight)
      //console.log("checkLoginPage", store.getters.isLoginPage)
      //data.isVan = store.getters.userRight

      //return store.state.userRight   
    }

    const onGnbMenuClicked = ({ to }: INavMenuItem)  =>{
      console.log("route.path", to)
      router.push(to)
    };

    let displayGnbs = reactive<INavMenuItem[]>([...gnbs(data.isVan)]);
    checkLoginPage()

    return {
      gnbs: displayGnbs,
      lnbs: displayLnbs,
      userName,
      onGnbMenuClicked,
      defaultActiveMenu,
      data,
      onClickLnb,
      isLoginPage,
      //data.isVan
      //onLogin
      //updateVal
    };
  },
});
</script>

