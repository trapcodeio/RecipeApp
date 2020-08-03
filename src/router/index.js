import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import AllRecipes from "@/views/Recipes/AllRecipes";
import AddRecipe from "@/views/Recipes/AddRecipe";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        component: Home
    },
    {
        path: '/recipes',
        name: 'recipes',
        component: AllRecipes
    },
    {
        path: '/recipes/category/:category',
        name: 'recipes.category',
        component: AllRecipes
    },
    {
        path: '/recipes/add',
        name: 'recipe.add',
        component: AddRecipe
    },
    {
        path: '/recipe/:recipe',
        name: 'recipe.view',
        component: AddRecipe
    }
]

const router = new VueRouter({
    routes
})

export default router
