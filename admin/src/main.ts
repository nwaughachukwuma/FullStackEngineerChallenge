import Vue from 'vue'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
import VueSweetalert2 from 'vue-sweetalert2';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.scss';


import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'


Vue.config.productionTip = false

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})
Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2, {});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
