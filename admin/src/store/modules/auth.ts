import {get, isEmpty} from 'lodash';
import axios from 'axios';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import authService from '@/services/authService';

const authKey = window.localStorage.getItem('auth-key') || '';

const state = {
  authKey: authKey,
  loading: false,
  isLoggedIn: false,
  user: authKey ? jwtDecode(authKey) : null
};

const actions = {
  login({ dispatch, commit }, { username, password, router }) {
    dispatch('alert/clear', null, { root: true });
    commit('startRequest');

    authService
      .login(username, password)
      .then(response => {
        console.log('login response >>', response.data)
        commit('loginSuccess', { authKey: get(response, 'data.auth.accessToken', null) });
        dispatch('alert/success', { showType: 'toast', title: 'You have logged in' }, { root: true });
        router.push('/');
      })
      .catch(e => {
        commit('loginFailure');

        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  logout({ dispatch, commit }, { router, silent = false }) {
    dispatch('alert/clear', {}, { root: true });
    commit('logout');

    if (!silent) {
      dispatch('alert/success', { showType: 'toast', title: 'You are successfully logged out.' }, { root: true });

      // https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
      router.push('/').catch(_e => {console.log(_e)});
    }
  },
  sessionExpired({ dispatch, commit }, { router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('logout');

    dispatch(
      'alert/error',
      { showType: 'toast', title: 'Session expired', text: 'Please login with your account.' },
      { root: true }
    );

    router.push('/login');
  },
  handleAuthMessageKey({ dispatch: _ }, { messageKey }) {
    switch (messageKey) {
      default:
        break;
    }
  }
};

const getters = {
  isLoggedIn: state => () => {
    if (state.isLoggedIn) {
      return true;
    }

    if (isEmpty(state.authKey)) {
      return false;
    }

    let decoded = null;
    try {
      decoded = jwtDecode(state.authKey);
    } catch (e) {
      return false;
    }

    const exp = get(decoded, 'exp', undefined)
    if (!!exp && exp && moment.unix(exp).isAfter()) {
      axios.defaults.headers.common.Authorization = `Bearer ${state.authKey}`;
      return true;
    }

    return false;
  }
};

const mutations = {
  startRequest(state) {
    state.loading = true;
    state.isLoggedIn = false;
  },
  loginSuccess(state, { authKey }) {
    state.loading = false;
    state.isLoggedIn = true;
    state.authKey = authKey;
    state.user = jwtDecode(authKey);
    localStorage.setItem('auth-key', authKey);
    localStorage.setItem('accessToken', authKey);
    axios.defaults.headers.common.Authorization = `Bearer ${authKey}`;
  },
  loginFailure(state) {
    state.loading = false;
  },
  logout(state) {
    state.isLoggedIn = false;
    state.authKey = null;
    state.user = null;
    localStorage.removeItem('auth-key');
    axios.defaults.headers.common.Authorization = null;
  },
  clear(state) {
    state.loading = false;
    state.isLoggedIn = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};