import {reduce, join} from 'lodash';

const state = {};

const actions = {
  handleServiceException({ dispatch, commit }, { e, router = null }) {
    if (e.response) {
      const { data, status } = e.response;

      let errorMessages: (string|number)[] = [];
      if ([422, 500].includes(status)) {
        errorMessages = reduce(data, (localError, value, key) => {
            localError.push(value);
            return localError;
          },
          errorMessages
        );

        commit('alert/setMessage', { type: 'error', message: join(errorMessages, '\r\n') }, { root: true });
      } else if (status === 403) {
        dispatch('auth/sessionExpired', { router }, { root: true });
      }
    } else {
      dispatch('alert/error', { showType: 'toast', title: 'Error', text: e.message }, { root: true });
      throw new Error(e);
    }
  }
};

const getters = {};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};