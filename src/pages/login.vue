<template>
  <div class="main">
    <div class="left_base"></div>
    <div class="sk_logo_top"></div>
    <div class="text-sk-welcome-left">Welcome to</div>
    <div class="text-sk-welcome-right">u-CAT TMS</div>
    <div class="sk_logo_bottom"></div>
    <div class="right_base"></div>
    <div class="input-signin">Sign In</div>
    <div class="text-id">ID</div>
    <input class="input-login" placeholder="Enter your ID" v-model="changeForm.userId">
    <div class="text-password">Password</div>
    <input class="input-password" type="password" placeholder="Enter your password" v-model="changeForm.password">
    <button class="button-login" @click="login" type="submit">Login</button>  
  </div>
</template>
<script lang="ts">
  import  axios, { AxiosResponse } from "axios";
  import { defineComponent, reactive, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useStore } from "vuex";


  export default defineComponent({
    name: "Loing",
    components: {

    },
    emits: ["click:login"],
    setup(properties, { emit }) {
      const store = useStore();
      const router = useRouter();

      let changeForm = reactive({
        userId: "",
        password: ""
      })

      function login() {
        let response = axios.get('http://tms-test-server.p-e.kr:8081/login?user_id=' + changeForm.userId + '&password=' + changeForm.password)
        .then(response => {
          var list = response.data.list
          if( response.data.status == 200){
            window.localStorage.setItem("token", response.data.messages.token)
            window.localStorage.setItem("vanId", response.data.messages.van_id)
            window.localStorage.setItem("userId", response.data.messages.user_id)
            window.localStorage.setItem("userNm", response.data.messages.user_name)       
            window.localStorage.setItem("islogin", true)

            console.log("login--------!!!!!!")
            
            this.$router.push('/van/devices/registrations')
            store.commit("setisLoginPage", false);
            store.state.isLoginPage = false

            if( response.data.messages.user_right == "S" ){
              window.localStorage.setItem("is_van", false)
              store.state.userRight  = false
              store.commit("userRight", false);
            }  
            else { // van
              window.localStorage.setItem("is_van", true)
              store.state.userRight  = true  
              store.commit("userRight", true);
            } 
          }
        });
      };

      store.commit("setisLoginPage", true);
      store.state.isLoginPage = true


      return {login, changeForm};
    },
  });
</script>

<style>
  .main{
    position: absolute;
    background: #232834;
    margin-left: auto;
    margin-right: auto;
    top: 50px;
    left: 0;
    right: 0;
    text-align: center;
    width: 1440px;
    height: 917px;
  }

  .text-sk-welcome-left{
    position: absolute;
    top: 290px;
    left: 281px;
    width: 165px;
    height: 39px;
    /* UI Properties */
    font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) 30px/50px Roboto;
    text-align: center;
    font: normal normal normal 30px/50px Roboto;
    letter-spacing: -0.15px;
    color: #171717;
  }

  .text-sk-welcome-right{
    position: absolute;
    top: 290px;
    left: 448px;
    width: 163px;
    height: 39px;
        /* UI Properties */
    font: var(--unnamed-font-style-normal) normal bold 30px/50px Roboto;
    text-align: center;
    font: normal normal bold 30px/50px Roboto;
    letter-spacing: -0.15px;
    color: #171717;
  }

  .sk_logo_top{
    position: absolute;
    top: 206px;
    left: 407px;
    width: 67px;
    height: 52px;
    background: transparent url('/ci.png') 0% 0% no-repeat padding-box;
    opacity: 1;
  }

  .sk_logo_bottom{
    position: absolute;
    top: 410px;
    left: 199px;
    width: 483px;
    height: 356px;
    /* UI Properties */
    background: transparent url('/그룹 20014@2x.png') 0% 0% no-repeat padding-box;
    background-size: 100%;
    opacity: 1;
  }  

  .left_base {
    /* Layout Properties */
    position: absolute;
    top: 135px;
    left: 140px;
    width: 600px;
    height: 648px;
    /* UI Properties */
    background: #C5CAE3 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 20px #00000008;
    border-radius: 5px 0px 0px 5px;
    opacity: 1;
  }
  /* 오른쪽 */
  .right_base{
    /* Layout Properties */
    position: absolute;
    top: 135px;
    left: 740px;
    width: 560px;
    height: 648px;
    background: #FFFFFF 0% 0% no-repeat padding-box; 
    box-shadow: 0px 3px 20px #00000008;
    border-radius: 0px 5px 5px 0px;
    opacity: 1;
  }

  .input-signin{
      position: absolute;
      top: 328px;
      left: 884px;
      width: 100px;
      height: 31px;
      /* UI Properties */
      font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) var(--unnamed-font-size-28)/var(--unnamed-line-spacing-32) Arial;
      letter-spacing: var(--unnamed-character-spacing-0);
      color: var(--unnamed-color-2e384d);
      text-align: left;
      font: normal normal normal 28px/32px Arial;
      letter-spacing: 0px;
      color: #2E384D;
      opacity: 1;
  }

  .text-id{
    position: absolute;
    top: 375px;
    left: 884px;
    width: 12px;
    height: 14px;
    /* UI Properties */
    font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) var(--unnamed-font-size-12)/var(--unnamed-line-spacing-14) Arial;
    letter-spacing: var(--unnamed-character-spacing-0);
    color: var(--unnamed-color-8c98a9);
    text-align: left;
    font: normal normal normal 12px/14px Arial;
    letter-spacing: 0px;
    color: #8C98A9;
    opacity: 1;
  }

  .input-login{
    /* Layout Properties */
    position: absolute;
    top: 396px;
    left: 884px;
    width: 272px;
    height: 40px;
    /* UI Properties */
    background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
    border: 1px solid var(--unnamed-color-e0e7ff);
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border: 1px solid #E0E7FF;
    border-radius: 5px;
    opacity: 1;
  }

  .text-password{
    /* Layout Properties */
    position: absolute;
    top: 449px;
    left: 884px;
    width: 53px;
    height: 14px;
    /* UI Properties */
    font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-normal) var(--unnamed-font-size-12)/var(--unnamed-line-spacing-14) Arial;
    letter-spacing: var(--unnamed-character-spacing-0);
    color: var(--unnamed-color-8c98a9);
    text-align: left;
    font: normal normal normal 12px/14px Arial;
    letter-spacing: 0px;
    color: #8C98A9;
    text-transform: capitalize;
    opacity: 1;
  }

  .input-password{
    /* Layout Properties */
    position: absolute;
    top: 470px;
    left: 884px;
    width: 272px;
    height: 40px;
    /* UI Properties */
    background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
    border: 1px solid var(--unnamed-color-e0e7ff);
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border: 1px solid #E0E7FF;
    border-radius: 5px;
    opacity: 1;
  }

  .button-login{
    /* Layout Properties */
    position: absolute;
    top: 535px;
    left: 884px;
    width: 272px;
    height: 40px;
    /* UI Properties */
    background: transparent url('/Rectangle@2x.png') 0% 0% no-repeat padding-box;
    background-size: 100%;
    border-radius: 5px;
    opacity: 1;
  }
</style>