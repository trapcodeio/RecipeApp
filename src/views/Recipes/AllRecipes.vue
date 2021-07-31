<template>
  <section class="section">
    <div class="is-clearfix">
      <h2 class="is-size-4 is-pulled-left">
        Recipes <small class="has-text-grey">({{ recipes.total }})</small>
      </h2>
      <router-link :to="{ name: 'recipe.add' }" class="button is-primary is-pulled-right"
        >Add</router-link
      >
    </div>

    <div v-if="isCategory" class="message is-info mt-2">
      <div class="message-body py-3">
        Viewing recipes in <strong>{{ category }}</strong> category.

        <router-link :to="rl('recipes')" class="is-pulled-right">view all</router-link>
      </div>
    </div>

    <form @submit.prevent="runSearch" class="mt-2">
      <div class="field has-addons">
        <div class="control is-expanded">
          <input v-model="search" class="input" type="text" placeholder="Search recipe" />
        </div>
        <div class="control">
          <button :disabled="!search.length" type="submit" class="button is-info">
            Search
          </button>
        </div>
      </div>
      <h6 v-if="isSearching" class="is-size-6 has-text-centered">
        Showing search results for
        <strong class="has-text-success">{{ search }}</strong>
        <a @click.prevent="stopSearching" class="ml-2"><small>(stop search)</small></a>
      </h6>
    </form>

    <div v-if="loaded" class="columns mt-5 is-multiline">
      <template v-if="recipes.total">
        <div
          class="column is-4"
          v-for="(recipe, recipeId) in recipes.data"
          :key="recipeId"
        >
          <router-link :to="rl('recipe.edit', { recipe: recipe._id })">
            <div class="card">
              <div class="card-image">
                <figure class="image recipe-image-holder">
                  <img :src="'storage' + recipe.image" alt="Placeholder image" />
                </figure>
              </div>
              <div class="card-content">
                <div class="media mb-3">
                  <div class="media-content">
                    <p class="title is-4">
                      {{ recipe.title }}
                      <sup class="has-text-grey">({{ recipe.category }})</sup>
                    </p>
                    <!--                  <p class="subtitle is-6"></p>-->
                  </div>
                </div>

                <div class="content is-clearfix">
                  <small class="is-pulled-left">
                    <StatusTag :status="recipe.status"></StatusTag>
                  </small>
                  <small class="is-pulled-right">
                    <small class="has-text-grey">Added:</small>
                    <TimeAgo :date="recipe.addedAt" />
                  </small>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </template>
      <div v-else class="column is-12">
        <template v-if="isSearching">
          <h3 class="is-size-5 has-text-centered">
            No recipes for search query: <strong>{{ search }}</strong>
          </h3>
        </template>
        <template v-else>
          <h3 v-if="isCategory" class="is-size-5 has-text-centered">
            No recipes in this category yet!
          </h3>
          <h3 v-else class="is-size-5 has-text-centered">No recipes yet!</h3>
        </template>
      </div>
    </div>
    <Busy v-else />
  </section>
</template>

<script>
export default {
  mixins: [
    new window.HttpRequestMixin((self) => {
      const request = { route: "recipes", data: {} };

      if (self.isCategory) request.data.category = self.category;

      if (self.isSearching) request.data.search = self.search.trim();

      return request;
    })
  ],

  data() {
    return {
      loaded: false,
      recipes: {
        total: 0,
        data: []
      },
      search: "",
      isSearching: false
    };
  },

  computed: {
    isCategory() {
      return this.$route.name === "recipes.category";
    },
    category() {
      return this.$route.params.category;
    }
  },

  watch: {
    "$route.name"() {
      this.loaded = false;
      this.reloadFetchedData();
    },
    "$route.query"() {
      this.loaded = false;
      this.reloadFetchedData();
    },

    search() {
      if (!this.search) {
        this.isSearching = false;
        this.reloadFetchedData();
      }
    }
  },

  mounted() {
    const query = this.$route.query || {};
    if (query.search) this.search = query.search;
  },

  methods: {
    mountFromServer({ recipes }) {
      if (recipes) {
        this.recipes = recipes;
      }

      this.loaded = true;
    },

    runSearch() {
      if (this.search < 2) return false;

      this.isSearching = true;
      this.$router
        .push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            search: this.search
          }
        })
        .catch((e) => e);
    },

    stopSearching() {
      this.isSearching = false;
      this.search = "";

      this.$router.push({ name: this.$route.name });
    }
  }
};
</script>

<style scoped lang="scss">
.recipe-image-holder img {
  //max-height: 250px;
}
</style>
