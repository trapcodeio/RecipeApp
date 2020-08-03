<template>
  <section class="section">
    <div class="is-clearfix">
      <h2 class="is-size-4 is-pulled-left">Categories <small class="has-text-grey">({{ categories.length }})</small>
      </h2>
      <button @click="toggleAddModal" class="button is-primary is-pulled-right">Add</button>
    </div>

    <div class="table-container mt-3">
      <table class="table is-bordered is-fullwidth">
        <thead>
        <tr>
          <th>Name</th>
          <th>Recipes</th>
          <th>Date Added</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(cat, catId) in categories">
          <tr :key="catId">
            <td>
              <router-link :to="rl('recipes.category', {category: cat.name})">{{ cat.name }}</router-link>
            </td>
            <td>{{ cat.recipes }}</td>
            <td>
              <TimeAgo :date="cat.addedAt"/>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>

    <div v-if="showAddModal" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <form @submit="() => false">
            <div class="field">
              <label class="label">Category Name:</label>
              <div class="control">
                <input v-model="addCategoryForm.name" type="text" class="input" placeholder="e.g Breakfast">
              </div>
            </div>

            <div class="mt-2 has-text-centered">
              <LoadingButton :click="addCategory" class="is-primary">Add Category</LoadingButton>
            </div>
          </form>
        </div>
      </div>
      <button @click.prevent="toggleAddModal" class="modal-close is-large" aria-label="close"></button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Home',
  mixins: [
    new window.HttpRequestMixin({route: '/categories'})
  ],
  data() {
    return {
      showAddModal: false,
      categories: [],
      addCategoryForm: {
        name: ''
      }
    }
  },

  methods: {
    mountFromServer({categories}) {
      if (categories) {
        this.categories = categories;
      }
    },

    toggleAddModal() {
      this.showAddModal = !this.showAddModal;
      this.addCategoryForm.name = ''
    },

    addCategory(btn) {
      this.$api.postTo('categories', this.addCategoryForm, {
        yes: () => {
          this.toggleAddModal()
          this.reloadFetchedData()
        },
        any: () => btn.stopLoading()
      })
    }
  }
}
</script>
