import {map, get} from 'lodash';
import perfReviewService from '@/services/perfReviewService'

const state = {
  baseUrl: '/perf-reviews',
  performance_reviews: [],
  pagination: {},
  performance_review: null,
  loading: false
};

const actions = {
  list({ dispatch, commit, state }, { type = 'pref-reviews', query = {}, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    commit('setPerformanceReviews', { performance_reviews: [], pagination: {} });

    perfReviewService
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
  getOne({ dispatch, commit }, { type = 'perf-reviews', prId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    commit('setPerformanceReview', { performance_review: {} });

    perfReviewService
      .getOne({ type, prId })
      .then(response => {
        commit('setPerformanceReview', { performance_review: response.data });
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  postOne({ dispatch, commit }, { type = 'create-perf-review', performance_review, router, redirectUrl = '' }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    perfReviewService
      .postOne({ type, performance_review })
      .then(() => {
        // response
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'New Performance review has been added.'
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
  patchOne({ dispatch, commit }, { type = 'perf-reviews', prId, performance_review, router, redirectUrl = '' }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    perfReviewService
      .patchOne({ type, prId, newPR: performance_review })
      .then(_response => {
        _response;
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'Performance review has been updated.'
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
  deleteOne({ dispatch, commit }, { type = 'perf-reviews', prId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    perfReviewService
      .deleteOne({ type, prId })
      .then(() => {
        // _response;
        dispatch('list', { type });
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'Performance review has been deleted.'
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
        name: get(performance_review, 'employee.name', null),
        email: get(performance_review, 'employee.email', null),
        remark: performance_review.remark,
        evaluation: performance_review.evaluation,
        month: performance_review.month,
        year: performance_review.year,
        isReviewed: performance_review.isReviewed,
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
      name: get(performance_review, 'employee.name', null),
      email: get(performance_review, 'employee.email', null),
      remark: performance_review.remark,
      evaluation: performance_review.evaluation,
      month: performance_review.month,
      year: performance_review.year,
      isReviewed: performance_review.isReviewed,
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