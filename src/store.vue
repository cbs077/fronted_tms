<script>
import { createStore } from "vuex";

export default createStore({
  state: {
    isLoginPage: false,
    isVan: false,
    pageCount: 20,
    menuss: []
  },
  getters: {
    isLoginPage(state) {
      return state.isLoginPage;
    },
    isVan(state) {
      return state.isVan;
    },
    pageCount(state) {
      return state.pageCount;
    },   
  },
  mutations: {
    setisLoginPage(state, value) {
      state.isLoginPage = value;
    },
    isVan(state, value) {
      state.isVan = value;
    },
    pageCount(state, value) {
      state.pageCount = value;
    }
  }
});
</script> 