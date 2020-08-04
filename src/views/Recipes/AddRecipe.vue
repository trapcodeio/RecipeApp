<template>
  <section class="section">
    <div class="is-clearfix">
      <h4 class="is-size-4 is-pulled-left">{{ isEditing ? 'Edit' : 'Add' }} Recipe</h4>
      
      <LoadingButton v-if="isEditing" :click="deleteRecipe" class="is-pulled-right is-danger is-small"><i class="fa fa-trash" aria-hidden="true"></i></LoadingButton>
    </div>
    <div v-if="loaded" class="box has-background-light">
      <div class="columns">
        <div class="column is-narrow">
          <div class="recipe-image">
            <img :src="recipeImage" alt="">
          </div>

          <div v-if="uploadedImage" class="is-clearfix my-3">
            <small class="is-pulled-left has-text-danger">{{ uploadedImage.name }}</small>
          </div>
          <div class="file is-dark is-small">
            <label class="file-label">
              <input @change="preview_image" class="file-input" type="file" name="resume" accept="image/*">
              <span class="file-cta">
              <span class="file-icon">
                <i class="fad fa-image"></i>
              </span>
              <span class="file-label">
                {{ uploadedImage ? 'Replace Image...' : 'Change image...' }}
              </span>
            </span>
            </label>
          </div>
        </div>
        <div class="column">
          <h3 v-if="form.title" class="is-size-4 my-3 has-text-info">
            <span class="is-size-5 has-text-dark">Title:</span> {{ form.title }}
          </h3>
          <div class="columns is-multiline">
            <div class="column is-narrow">
              <div class="select">
                <select v-model="form.category">
                  <option :value="null">Select Category</option>
                  <template v-for="(cat, catId) in categories">
                    <option :key="catId" :value="cat">{{ cat }}</option>
                  </template>
                </select>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <div class="control">
                  <input v-model="form.title" type="text" class="input" placeholder="e.g Egusi Soup">
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column is-narrow">
              <div class="select">
                <select v-model="form.difficulty">
                  <option :value="null">Select Difficulty</option>
                  <template v-for="(diff, diffId) in difficulties">
                    <option :key="diffId" :value="diffId" class="is-capitalized">{{ diff }}</option>
                  </template>
                </select>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Calories:</label>
                <div class="control">
                  <input v-model="form.calories" type="number" class="input">
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Duration:</label>
                <div class="control">
                  <input v-model="form.duration" type="text" class="input" placeholder="e.g 1hr 30mins">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-12">
          <div class="is-clearfix">
            <h3 class="is-size-4 is-pulled-left">Ingredients</h3>
            <button type="button" @click.prevent="addNewServe" class="is-pulled-right">Add new serve</button>
          </div>
        </div>
      </div>
      <div class="columns is-multiline" v-if="form.ingredients.length">
        <div class="column is-6" v-for="(ing, ingId) in form.ingredients" :key="ingId">
          <div class="box pl-5 is-shadowless">
            <div class="is-clearfix mb-3">
              <h6 class="is-size-6 has-text-weight-bold has-text-info is-pulled-left">
                SERVE {{ ingId + 1 }}
              </h6>
              <div class="is-pulled-right">
                <a v-if="ing.length&&activeServe===ingId" @click.prevent="duplicateServe(ingId)"
                   class="mr-3 has-text-dark"><small>duplicate</small></a>
                <a v-if="activeServe===ingId" @click.prevent="changeActiveServe(null)"
                   class="mr-3"><small>stop editing</small></a>
                <a v-else @click.prevent="changeActiveServe(ingId)"
                   class="mr-3"><small>edit</small></a>
                <a @click.prevent="deleteServe(ingId)"><small class="has-text-danger">delete</small></a>
              </div>
            </div>

            <ul class="ml-2">
              <template v-for="(item, itemId) in ing">
                <li :key="itemId">
                  <a v-if="activeServe===ingId" @click.prevent="editIngredient(ingId, itemId)"
                     class="mr-2"><i
                      class="fas fa-pencil is-size-7 has-text-grey"></i></a>
                  {{ item }}
                  <a v-if="activeServe===ingId" @click.prevent="deleteIngredient(ingId, itemId)" class="ml-3"><i
                      class="fas fa-times is-size-7 has-text-danger"></i></a>
                  <br>
                  <form class="my-2" v-if="activeServe===ingId && editIngredientId===itemId"
                        @submit.prevent="saveIngredient(ingId)">
                    <div class="field has-addons">
                      <div class="control">
                        <input v-model="ingredientForm.edit" class="input" type="text" placeholder="">
                      </div>
                      <div class="control">
                        <button type="submit" class="button">
                          edit
                        </button>
                      </div>
                    </div>
                  </form>

                </li>
              </template>
            </ul>

            <form @submit="() => false" v-if="activeServe===ingId" class="mt-5">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input v-model="ingredientForm.item" type="text" class="input"
                         placeholder="e.g 2 grams of sugar">
                </div>
                <div class="control">
                  <button type="submit" @click.prevent="addIngredient" class="button is-info">Add Ingredient
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <template v-else>
        <h5 class="is-size-5 has-text-grey has-text-centered">No ingredients yet!</h5>
      </template>

      <h3 class="is-size-4 is-pulled-left">Preparation</h3>
      <div class="field">
        <div class="control">
          <textarea v-model="form.preparation" class="textarea" placeholder="How to prepare!"></textarea>
        </div>
      </div>


      <h3 class="is-size-4 is-pulled-left">Method</h3>
      <div class="field">
        <div class="control">
          <Editor v-model="form.method" class="textarea" :api-key="editor.key"
                  :init="editor.init"></Editor>
        </div>
      </div>

      <div v-if="isEditing" class="mt-5 is-clearfix">
        <LoadingButton :click="addRecipe" class="is-info is-pulled-left">Save
          Recipe
        </LoadingButton>

        <LoadingButton v-if="recipe.status==='published'" data="unpublish" :click="addRecipe" class="is-danger is-pulled-right">
          UnPublish
        </LoadingButton>
        <LoadingButton v-else data="publish" :click="addRecipe" class="is-primary is-pulled-right">
          Publish
        </LoadingButton>
      </div>
      <div v-else class="mt-5 has-text-centered">
        <LoadingButton :click="addRecipe" class="is-primary">Add
          Recipe
        </LoadingButton>
      </div>
    </div>
    <Busy v-else/>
  </section>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import {mapGetters} from "vuex";
import BrowserStorage from "@trapcode/browser-storage";
import editor from "@/components/editor-config";

const editorStore = BrowserStorage.getLocalStore('store');

export default {
  name: 'AddRecipe',
  components: {Editor},
  mixins: [
    new window.HttpRequestMixin((self) => {
      if (self.isEditing) {
        return {
          route: '/recipe/' + self.$route.params.recipe
        }
      }
    })
  ],
  data() {
    return {
      loaded: false,
      recipe: null,
      editor,
      form: {
        title: null,
        category: null,
        difficulty: null,
        calories: 0,
        duration: null,
        ingredients: [],
        preparation: null,
        method: null
      },

      activeServe: null,
      editIngredientId: null,

      ingredientForm: {
        item: null,
        edit: null
      },

      recipeImage: '/images/food.png',
      uploadedImage: null,
      difficulties: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard'
      }
    }
  },

  computed: {
    ...mapGetters(['categories']),
    isEditing() {
      return this.$route.name === 'recipe.view'
    }
  },

  watch: {
    activeServe() {
      this.saveProgress();
    },
    form: {
      deep: true,
      handler() {
        this.saveProgress()
      }
    }
  },

  mounted() {
    if (!this.isEditing) {
      this.loaded = true;
      if (editorStore.has('editor')) {
        const cache = editorStore.getObject('editor');
        this.form = cache.form;
        this.activeServe = cache.activeServe;
      }
    }

  },

  methods: {
    mountFromServer({recipe}) {
      if (recipe) {
        this.recipe = recipe;

        this.form = {
          title: recipe.title,
          category: recipe.category,
          difficulty: recipe.difficulty,
          calories: recipe.calories,
          duration: recipe.duration,
          ingredients: recipe.ingredients,
          preparation: recipe.preparation,
          method: recipe.method
        }

        this.recipeImage = '/storage' + recipe.image;
      }

      this.loaded = true
    },

    saveProgress() {
      if (!this.isEditing) {
        editorStore.setObject('editor', {
          form: this.form,
          activeServe: this.activeServe,
          updated: new Date()
        })
      }
    },
    preview_image(event) {
      const reader = new FileReader();
      const image = event.target.files[0];
      reader.onload = () => {
        this.recipeImage = reader.result;
        this.uploadedImage = image;
      }
      reader.readAsDataURL(image);
    },

    addNewServe() {
      this.form.ingredients.push([])
      this.changeActiveServe(this.form.ingredients.length - 1);
    },

    deleteServe(index) {
      const canDelete = confirm(`Are you sure you want to delete (SERVE ${index + 1}) and its ingredients?`)
      if (canDelete) {
        delete this.form.ingredients.splice(index, 1);
      }
    },

    changeActiveServe(serveId) {
      this.activeServe = serveId;
      this.closeIngredientEditor();
    },

    closeIngredientEditor() {
      this.ingredientForm.edit = null
      this.editIngredientId = null;
    },

    editIngredient(serveId, itemId) {
      if (this.editIngredientId === itemId) {
        this.closeIngredientEditor()
      } else {
        this.ingredientForm.edit = this.form.ingredients[serveId][itemId];
        this.editIngredientId = itemId;
      }
    },

    saveIngredient(serveId) {
      console.log(serveId);
      if (!this.ingredientForm.edit)
        return this.$toast.info('New name of ingredient is empty!');

      this.form.ingredients[serveId][this.editIngredientId] = this.ingredientForm.edit;
      this.closeIngredientEditor();
      this.saveProgress();
      return false;
    },

    deleteIngredient(serveId, itemId) {
      const ingredient = this.form.ingredients[serveId][itemId];
      const canDelete = confirm(`Are you sure you want to delete ingredient: (${ingredient})`)
      if (canDelete)
        this.form.ingredients[serveId].splice(itemId, 1);
    },

    duplicateServe(serveId) {
      const clonedIngredient = JSON.parse(JSON.stringify(this.form.ingredients[serveId]))
      const newId = this.form.ingredients.push(clonedIngredient);
      this.changeActiveServe(newId - 1);
    },

    addIngredient() {
      let item = this.ingredientForm.item;

      if (!item)
        return this.$toast.info('Name of ingredient is empty!');

      item = item.trim();
      this.form.ingredients[this.activeServe].push(item);
      this.ingredientForm.item = null;
    },

    addRecipe(btn, action) {
      const form = new FormData();
      if (this.uploadedImage)
        form.append('image', this.uploadedImage);

      for (const item in this.form) {
        const value = this.form[item];
        if (value) {
          if (item === 'ingredients') {
            form.append(item, JSON.stringify(value));
          } else {
            form.append(item, value);
          }
        }
      }

      if (action === 'publish' || action === 'unpublish') {
        form.append('status', action)
      }


      if (this.isEditing) {
        this.loaded = false;
        this.$api.postTo('recipe/' + this.recipe._id, form, {
          yes: () => {
            this.reloadFetchedData()
          },
          no: () => {
            this.loaded = true
          },
          any: () => btn.stopLoading()
        })
      } else {
        this.$api.postTo('recipes', form, {
          yes: () => {
            editorStore.remove('editor');
            this.$router.push({name: 'recipes'}).catch(e => e);
          },
          any: () => btn.stopLoading()
        })
      }

    },

    deleteRecipe(btn){
      const shouldDelete = confirm(`Are you sure you want to delete this recipe?`);
      if(!shouldDelete) return btn.stopLoading();

      this.$api.deleteFrom('recipe/' + this.recipe._id, {}, {
        yes: () => {
          this.$router.push({name: 'recipes'}).catch(e => e);
        },
        any: () => btn.stopLoading()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.recipe-image {
  max-width: 300px;

  img {
    width: 300px;
    height: 200px;
    border-radius: 5px;
  }
}
</style>