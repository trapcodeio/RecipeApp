<template>
  <section v-if="loaded" class="section">
    <h3 class="is-size-3"><small class="is-size-5 has-text-grey">Viewing Recipe:</small> {{ recipe.title }}</h3>

    <div class="box my-5 has-background-dark has-text-white" v-if="recipe.ingredients.length">
      <h4 class="is-size-4 has-text-centered has-text-success">Serve {{ activeServe + 1 }}</h4>
      <ul>
        <template v-for="(ingredient, ingId) in recipe.ingredients[activeServe]">
          <li :key="ingId">{{ ingredient }}</li>
        </template>
      </ul>

      <div class="is-clearfix mt-5">
        <div class="is-pulled-left">
          <button @click.prevent="slideToPrev" class="button">Prev</button>
        </div>
        <div class="is-pulled-right">
          <button @click.prevent="slideToNext" class="button">Next</button>
        </div>
      </div>
    </div>
    <pre class="my-5">{{ recipe }}</pre>
  </section>
  <Busy v-else/>
</template>

<script>
export default {
  mixins: [
    new window.HttpRequestMixin((self) => {
      return {
        route: '/recipe/' + self.recipeId
      }
    })
  ],
  data() {
    return {
      loaded: false,
      recipe: {},

      activeServe: 0
    }
  },

  computed: {
    recipeId() {
      return this.$route.params.recipe || false
    }
  },

  methods: {
    mountFromServer({recipe}) {
      if (recipe) {
        this.recipe = recipe;
      }

      this.loaded = true;
    },

    slideToPrev() {
      const prevPage = this.activeServe - 1;

      if (this.recipe.ingredients[prevPage]) {
        this.activeServe--;
      }
    },

    slideToNext() {
      const nextPage = this.activeServe + 1;

      if (this.recipe.ingredients[nextPage]) {
        this.activeServe++;
      }
    }
  }
}
</script>

<style scoped>

</style>