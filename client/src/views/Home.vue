<template>
  <b-container class="home page-home text-center my-5">
    <img alt="Bootstrap Vue logo" src="../assets/logo.png" width="150" />
    <HelloWorld :msg="'Welcome, '+ user.name + ' 🎉'"/>
  </b-container>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import {mapState} from 'vuex'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: {
    ...mapState("auth", ["user"]),
  }
}
</script>
