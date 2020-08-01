<template>
  <section class="section">
    <div class="is-clearfix">
      <h2 class="is-size-4 is-pulled-left">Recipes <small class="has-text-grey">({{ recipes.total }})</small></h2>
      <router-link :to="{name: 'recipe.add'}" class="button is-primary is-pulled-right">Add</router-link>
    </div>


    <div v-if="loaded" class="columns mt-5 is-multiline">
      <div class="column is-4" v-for="(recipe, recipeId) in recipes.data" :key="recipeId">
        <router-link :to="rl('recipe.view', {recipe: recipe._id})">
          <div class="card">
            <div class="card-image">
              <figure class="image">
                <img :src="'storage/' +recipe.image" alt="Placeholder image">
              </figure>
            </div>
            <div class="card-content">
              <div class="media mb-3">
                <div class="media-content">
                  <p class="title is-4">{{ recipe.title }}</p>
                </div>
              </div>

              <div class="content is-clearfix">
                <small class="is-pulled-left">
                  <StatusTag :status="recipe.status"></StatusTag>
                </small>
                <small class="is-pulled-right">
                  <small class="has-text-grey">Added:</small> <TimeAgo :date="recipe.addedAt"/>
                </small>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <Busy v-else/>
  </section>
</template>

<script>

export default {
  mixins: [
    new window.HttpRequestMixin({route: 'recipes'})
  ],
  data() {
    return {
      loaded: false,
      recipes: {
        total: 0,
        data: []
      }
    }
  },

  methods: {
    mountFromServer({recipes}) {
      if (recipes) {
        this.recipes = recipes;
      }

      this.loaded = true;
    }
  }


}
</script>

<style scoped>

</style>