import { map, get } from 'lodash';
import feedbackService from '@/services/feedbackService'

const state = {
    baseUrl: '/performance-review/feedback',
    all_reviews: [],
    pending_reviews: [],
    pagination: {},
    current_review: null,
    loading: false
};

const actions = {
    list({ dispatch, commit, state }, { type = 'assinged-reviews', query = {}, router }) {
        dispatch('alert/clear', {}, { root: true });
        commit('startRequest');

        commit('setAllReviews', { all_reviews: [], pagination: {} });

        feedbackService
            .list({ type, query })
            .then(response => {
                const pagination = { total_rows: response.data.length, page_size: 5, first_row_no: 1 };
                commit('setAllReviews', { all_reviews: response.data, pagination });
            })
            .catch(e => {
                commit('requestFailed');
                dispatch('common/handleServiceException', { e, router }, { root: true });
            });
    },
    getPending({ dispatch, commit }, { type = 'pending-reviews', query={}, employeeId, router }) {
        dispatch('alert/clear', {}, { root: true });
        commit('startRequest');

        commit('setPendingReviews', { pending_reviews: [], pagination: {} });

        feedbackService
            .getPending({ type, employeeId })
            .then(response => {
                const pagination = { total_rows: response.data.length, page_size: 5, first_row_no: 1 };
                commit('setPendingReviews', { pending_reviews: response.data, pagination });
            })
            .catch(e => {
                commit('requestFailed');
                dispatch('common/handleServiceException', { e, router }, { root: true });
            });
    },
    postOne({ dispatch, commit }, { type = 'give-feedback', feedback = {}, reviewId, router, redirectUrl = '' }) {
        dispatch('alert/clear', {}, { root: true });
        commit('startRequest');

        feedbackService
            .postOne({ type, feedback, reviewId })
            .then(() => {
                // response
                dispatch(
                'alert/success',
                {
                    showType: 'toast',
                    position: 'bottom-left',
                    title: '',
                    text: 'Feedback submitted successfully'
                },
                { root: true }
                );

                if (redirectUrl !== '') {
                    router.push(redirectUrl);
                } else {
                    window.location.reload();
                }
            })
            .catch(e => {
                commit('requestFailed');
                dispatch('common/handleServiceException', { e, router }, { root: true });
            });
    }
};

const getters = {

};

const mutations = {
    startRequest(state) {
        state.loading = true;
    },
    requestFailed(state) {
        state.loading = false;
    },
    setAllReviews(state, { all_reviews, pagination }) {
        let rowNum = pagination.first_row_no;
        state.all_reviews = map(all_reviews, review => {
            const newPerformanceReview = {
                rowNum,
                id: review.id,
                performanceReviewId: review.performanceReviewId,
                feedback: review.feedback!,
                peerId: review.peerId,
                performance_review: get(review, 'performance_review', []),
            };

            rowNum += 1;
            return newPerformanceReview;
        });
        state.pagination = pagination;

        state.loading = false;
    },
    setPendingReviews(state, { pending_reviews, pagination }) {
        let rowNum = pagination.first_row_no;
        state.pending_reviews = map(pending_reviews, review => {
            const newPerformanceReview = {
                rowNum,
                id: review.id,
                performanceReviewId: review.performanceReviewId,
                feedback: review.feedback!,
                peerId: review.peerId,
                performance_review: get(review, 'performance_review', []),
            };

            rowNum += 1;
            return newPerformanceReview;
        });
        state.pagination = pagination;

        state.loading = false;
    },
    setCurrentReviews(state, { review }) {
        state.current_review = {
            id: review.id,
            performanceReviewId: review.performanceReviewId,
            feedback: review.feeeback,
            peerId: review.peerId,
            performance_review: get(review, 'performance_review', []),
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