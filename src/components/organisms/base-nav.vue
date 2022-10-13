<template>
  <nav
    class="relative mx-auto flex h-20 w-full items-center bg-white px-8 text-black shadow"
  >
    <!-- logo -->
    <div class="top_logo">
      <a class="_o6689fn" href="/">

      </a>
    </div>
    <!-- end logo -->

    <div class="mx-auto flex">
      <base-button
        v-for="menu in menuss"
        :key="menu.text"
        class="mx-1 border-transparent"
        :class="{
          'bg-sk-red text-white': menu.to === currentPath,
        }"
        :text="menu.text"
        @click="$emit('click:menu', menu)"
      />
    </div>

    <!-- menus -->
    <div class="ml-auto flex">
      <div class="relative flex items-center justify-end">
        <p class="mr-4">{{ userName }} 님</p>
        <button @click="onUserProfile" class="aa">  
          <user-circle-icon class="mx-1 h-10" />
        </button>
        <button @click="onLogout" class="aa">
          <logout-icon class="mx-1 h-10" />
        </button>
        <!-- mobile drawer -->
        <div class="block">
          <div class="relative inline" />
        </div>
      </div>
    </div>
    <!-- end login -->
  </nav>
</template>

<script lang="ts">
import { LogoutIcon, UserCircleIcon } from "@heroicons/vue/outline";
import { computed, defineComponent, PropType } from "vue";
import { useRouter } from "vue-router";

import BaseButton from "~/components/atoms/base-button.vue";
import { INavMenuItem } from "~/interfaces/menu.interface";
import { isNavMenu } from "~/utils/type-guard";
//import { islogin } from "~/App.vue";
import { useStore } from "vuex";
  
export default defineComponent({
  name: "BaseNavBar",
  components: { UserCircleIcon, LogoutIcon, BaseButton },
  props: {
    menus: {
      type: Array as PropType<Array<INavMenuItem>>,
      required: true,
      default: () => [],
      validator: function (menus) {
        return Array.isArray(menus) && menus.every((menu) => isNavMenu(menu));
      },
    },
    
    // userName: {
    //   type: String,
    //   required: true,
    //   default: "SK TMS",
    // },
  },
  emits: ["click:menu", "click:logout"],
  setup(properties, { emit }) {
    const store = useStore();
    const router = useRouter();
    let userName = window.localStorage.getItem("userNm")

    const currentPath = computed(() => {      
      const { path } = router.currentRoute.value;
      return path;
    });

    const menuss = computed({
      get: () => store.state.menuss
    });


    function onClickMenu(menu){
      //this.$router.push('/van/accounts/users/my')
      ////console.log("onUserProfile")
      //emit('click:menu', menu)
    }

    function onUserProfile(){
      this.$router.push('/van/accounts/users/my')
    }

    function onLogout(){
      window.localStorage.removeItem("token")
      window.localStorage.setItem("islogin", false)
      
      //store.commit("setisLoginPage", true);
      this.$router.push('/login')
      store.state.isLoginPage = true

    }    

    return { currentPath, onUserProfile, onLogout, userName, menuss };
  },
});
</script>
<style>
  .top_logo{
    background-image: url(top_logo.jpg);
    background-size: 100%;
    width: 150px;
    height: 60px;
    background-repeat: no-repeat;
  }
</style>


