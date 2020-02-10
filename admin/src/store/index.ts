import Vue from 'vue';
import Vuex from 'vuex';

import common from './modules/common';
import auth from './modules/auth';
import alert from './modules/alert';
import user from './modules/user';
import permission from './modules/permission';
// import setting from './modules/setting';
import performanceReview from './modules/performanceReview'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    auth,
    alert,
    user,
    permission,
    performance_review: performanceReview,
    // setting,
  },
  strict: true
});