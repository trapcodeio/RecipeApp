<template>
  <section class="section">
    <div class="is-clearfix">
      <h2 class="is-size-4 is-pulled-left">Categories <small class="has-text-grey">({{ categories.length }})</small>
      </h2>
      <button @click.prevent="toggleAddModal" class="button is-primary is-pulled-right">Add</button>
    </div>

    <div class="table-container mt-3">
      <table class="table is-bordered is-fullwidth">
        <thead>
        <tr>
          <th>Name</th>
          <th>Recipes</th>
          <th>Date Added</th>
          <th/>
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
            <td>
              <a @click.prevent="toggleAddModal(catId)" class="mr-3"><small>rename</small></a>
              <a @click.prevent="deleteCategory(catId)" class="has-text-danger"><small>delete</small></a>
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
              <LoadingButton v-if="isRenaming" :click="renameCategory" class="is-info">Rename Category</LoadingButton>
              <LoadingButton v-else :click="addCategory" class="is-primary">Add Category</LoadingButton>
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
      },

      isRenaming: false,
    }
  },

  methods: {
    mountFromServer({categories}) {
      if (categories) {
        this.categories = categories;
        this.$store.commit('setCategories', categories);
      }
    },

    toggleAddModal(rename) {
      this.isRenaming = typeof rename === "number" ? rename : false;
      this.showAddModal = !this.showAddModal;
      this.addCategoryForm.name = '';

      if (this.showAddModal && this.isRenaming !== false) {
        const category = this.categories[this.isRenaming]
        this.addCategoryForm.name = category.name;
        this.isRenaming = category._id;
      }
    },

    addCategory(btn) {
      this.$api.postTo('categories', this.addCategoryForm, {
        yes: () => {
          this.toggleAddModal()
          this.reloadFetchedData()
        },
        any: () => btn.stopLoading()
      })
    },

    renameCategory(btn) {
      this.$api.sendVia('PATCH', 'categories', {
        rename: this.isRenaming,
        name: this.addCategoryForm.name
      }, {
        yes: () => {
          this.toggleAddModal()
          this.loaded = false;
          this.reloadFetchedData()
        },
        any: () => btn.stopLoading()
      })
    },

    deleteCategory(catId) {
      const category = this.categories[catId];
      const shouldDelete = confirm(`Are you sure you want to delete (${category.name}) category?`);

      if (shouldDelete) {
        this.categories.splice(catId, 1);
        this.$api.deleteFrom('categories', {category: category._id}, {
          noOrError: () => {
            this.categories.splice(catId, 0, category);
          }
        })
      }
    }
  }
}
</script>
