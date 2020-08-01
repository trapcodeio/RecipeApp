<template>
  <nav class="navbar is-light is-radiusless" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" :to="{name: 'index'}">
        <h3 class="is-size-4 has-text-primary has-text-weight-bold has-text-grey-dark">Daisy's Kitchen</h3>
      </router-link>

      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
         data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-end">
        <router-link :to="{name: 'index'}" class="navbar-item">
          <i class="fad fa-layer-group mr-1"></i> Categories
        </router-link>

        <router-link :to="{name: 'recipes'}" class="navbar-item">
          <i class="fad fa-hamburger mr-1"></i> Recipes
        </router-link>

        <a @click.prevent="logout" class="navbar-item">
          <i class="fa fa-power-off mr-1" aria-hidden="true"></i> Logout
        </a>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'Navbar',

  methods: {
    logout() {
      this.$api.postTo('/auth/logout', {}, {
        yes: () => {
          this.$store.commit('setUser', false);
          this.$router.push({name: 'index'}).catch((e) => e)
        }
      })
    }
  }
}
</script>

<style>
.navbar-item {
  color: black !important;
}
</style>