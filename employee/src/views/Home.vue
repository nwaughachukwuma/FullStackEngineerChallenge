<template>
  <b-container class="home page-home text-center my-5">
    <img alt="Bootstrap Vue logo" src="../assets/logo.png" width="150" />
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </b-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
