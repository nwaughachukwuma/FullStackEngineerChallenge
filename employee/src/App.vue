<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->

    <nav-bar />
    <b-container fluid>
      <router-view/>
      <footer-bar />
    </b-container>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterBar from '@/components/FooterBar.vue';
import ConfigService from '@/services/configService';

export default {
  metaInfo: {
    title: 'App',
    titleTemplate: '%s | Frontend',
    meta: []
  },
  components: {
    NavBar,
    FooterBar
  },
  beforeCreate() {
    ConfigService.loadConfig();
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

@import '../src/assets/css/custom.css';
</style>
