import Vue from 'vue'
import VueMeta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
import VueSweetalert2 from 'vue-sweetalert2';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPortrait,
  faTrash,
  faPlus,
  faCheckSquare,
  faSquare,
  faUser,
  faTachometerAlt,
  faCog,
  faUserCircle,
  faSignOutAlt,
  faEdit,
  faTrashAlt,
  faLongArrowAltLeft,
  faSave,
  faListAlt,
  faExternalLinkAlt,
  faExternalLinkSquareAlt,
  faClipboardList,
  faClipboardCheck,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';


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

Vue.component('datetime', Datetime);
library.add(
  faPortrait,
  faTrash,
  faTrashAlt,
  faPlus,
  faCheckSquare,
  faSquare,
  faUser,
  faTachometerAlt,
  faCog,
  faUserCircle,
  faSignOutAlt,
  faEdit,
  faLongArrowAltLeft,
  faSave,
  faListAlt,
  faExternalLinkAlt,
  faExternalLinkSquareAlt,
  faClipboardList,
  faClipboardCheck,
  faPaperPlane
);
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
