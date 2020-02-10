import {map} from 'lodash';
import employeeService from '@/services/employeeService';

const state = {
  baseUrl: '/perf-reviews',
  performance_reviews: [],
  pagination: {},
  performance_review: null,
  loading: false
};

const actions = {
  list({ dispatch, commit, state }, { type = 'employees', query = {}, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    commit('setPerformanceReviews', { performance_reviews: [], pagination: {} });

    employeeService
      .list({ type, query })
      .then(response => {
        const pagination = {total_rows: response.data.length, page_size: 5, first_row_no: 1};
        commit('setPerformanceReviews', { performance_reviews: response.data, pagination});
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  getOne({ dispatch, commit }, { type = 'employees', userId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    commit('setPerformanceReview', { performance_review: {} });

    employeeService
      .getOne({ type, userId })
      .then(response => {
        commit('setPerformanceReview', { performance_review: response.data });
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  postOne({ dispatch, commit }, { type = 'create-employee', user, router, redirectUrl = '' }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    employeeService
      .postOne({ type, user })
      .then(() => {
        // response
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'New employee has been added.'
          },
          { root: true }
        );

        if (redirectUrl !== '') {
          router.push(redirectUrl);
        }
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  patchOne({ dispatch, commit }, { type = 'employees', userId, user, router, redirectUrl = '' }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    employeeService
      .patchOne({ type, userId, newUser: user })
      .then(_response => {
        _response;
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: type === 'user' ? 'User has been updated.' : 'Staff has been updated.'
          },
          { root: true }
        );

        if (redirectUrl !== '') {
          router.push(redirectUrl);
        }
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  deleteOne({ dispatch, commit }, { type = 'employees', userId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    employeeService
      .deleteOne({ type, userId })
      .then(() => {
        // _response;
        dispatch('list', { type });
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'Staff has been deleted.'
          },
          { root: true }
        );
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  }
};

const getters = {};

const mutations = {
  startRequest(state) {
    state.loading = true;
  },
  requestFailed(state) {
    state.loading = false;
  },
  setPerformanceReviews(state, { performance_reviews, pagination }) {
    let rowNum = pagination.first_row_no;
    state.performance_reviews = map(performance_reviews, performance_review => {
      const newPerformanceReview = {
        rowNum,
        id: performance_review.id,
        name: performance_review.name,
        email: performance_review.email,
        jobDefinition: performance_review.jobDefinition,
        rank: performance_review.rank,
        lastLoginAt: Date.now(), //performance_review.auth.lastLoginAt,
        role: performance_review.role,
        roleName: performance_review.role,
        permissions: performance_review.permissions,
        enabled: performance_review.status === 'active',
        enabledName: performance_review.status
      };

      rowNum += 1;
      return newPerformanceReview;
    });
    state.pagination = pagination;

    state.loading = false;
  },
  setPerformanceReview(state, { performance_review }) {
    state.performance_review = {
      id: performance_review.id,
      name: performance_review.name,
      email: performance_review.email,
      role: performance_review.role,
      roleName: performance_review.role,
      jobDefinition: performance_review.jobDefinition,
      gender: performance_review.gender,
      rank: performance_review.rank,
      permissions: performance_review.permissions,
      enabled: performance_review.status === 'active',
      enabledName: performance_review.status
    };

    state.loading = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};