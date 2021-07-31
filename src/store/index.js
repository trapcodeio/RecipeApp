import Vue from "vue";
import Vuex from "vuex";
import BrowserStorage from "@trapcode/browser-storage";

Vue.use(Vuex);

const store = BrowserStorage.getSessionStore("store");

export default new Vuex.Store({
  state: {
    user: store.getObject("user", false),
    categories: store.getArray("categories", [])
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      if (user) {
        store.setObject("user", user);
      } else {
        store.setBoolean("user", false);
      }
    },

    setCategories(state, categories) {
      state.categories = categories;
      store.setArray("categories", categories);
    }
  },
  getters: {
    categories(state) {
      const categories = [];

      for (const category of state.categories) {
        categories.push(category.name);
      }

      return categories;
    }
  },
  actions: {},
  modules: {}
});
