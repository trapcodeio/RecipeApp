<template>
  <nav class="navbar is-light is-radiusless" role="navigation" aria-label="main navigation">
    <!--<div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
            <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
        </a>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
           data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>-->

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-end">
        <router-link :to="{name: 'index'}" class="navbar-item">
          <i class="fad fa-layer-group mr-1"></i> Categories
        </router-link>

        <a class="navbar-item">
          <i class="fad fa-hamburger mr-1"></i> Recipes
        </a>

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
          this.$store.commit('setUser', null);
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