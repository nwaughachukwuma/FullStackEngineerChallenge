<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      This is our performance review application.<br/> 
      Help another employee today by leaving some valid feedback in their performance review  🙏🏻 👍🏻 
    </p>
    <b-link :to="{ path: '/performance-review/feedback/pending' }" >
      Browse a list of performance reviews assigned to you</b-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  methods: {
    
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
