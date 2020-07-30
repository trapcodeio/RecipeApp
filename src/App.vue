<template>
  <section v-if="loaded">
    <template v-if="user">
      <Navbar/>
      <router-view/>
    </template>
    <template v-else>
      <div class="container">
        <div class="columns" style="margin-top: 20vh">
          <div
              class="column is-8-tablet is-6-desktop is-4-widescreen is-offset-2-tablet is-offset-3-desktop is-offset-4-widescreen">

            <form @submit.prevent="() =>false">
              <h2 class="is-size-3 has-text-centered has-text-grey has-text-weight-bold">Login</h2>
              <hr class="mt-0">
              <div class="field">
                <label class="label">Username</label>
                <div class="control">
                  <input v-model="form.username" type="text" class="input">
                </div>
              </div>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input v-model="form.password" type="password" class="input">
                </div>
              </div>
              <div class="mt-3">
                <LoadingButton :click="login" class="is-fullwidth is-primary has-text-weight-bold">LOGIN</LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>
  </section>
  <Busy v-else/>
</template>


<script>
import {mapState} from "vuex";
import Navbar from "@/components/NavBar";

export default {
  components: {Navbar},
  data() {
    return {
      loaded: false,
      form: {
        username: 'daisy',
        password: 'daisy@2020'
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },

  mounted() {
    this.getUserStatus();
  },

  methods: {
    getUserStatus() {
      this.$api.getFrom('/auth/me', {}, {
        yes: ({user}) => {
          if (user) {
            this.$store.commit('setUser', user);
          }
          this.loaded = true;
        }
      })
    },
    login(btn) {
      this.$api.postTo('/auth/login', this.form, {
        yes: () => this.getUserStatus(),
        any: () => btn.stopLoading()
      })
    }
  }
}
</script>