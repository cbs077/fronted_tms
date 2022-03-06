<script>
import { createStore } from "vuex";

export default createStore({
  state: {
    isLoginPage: false,
    userRight: false,
    menuss: []
  },
  getters: {
    isLoginPage(state) {
      return state.isLoginPage;
    },
    userRight(state) {
      return state.userRight;
    }
  },
  mutations: {
    setisLoginPage(state, value) {
      state.isLoginPage = value;
    },
    userRight(state, value) {
      state.userRight = value;
    }
  }
});
</script> 