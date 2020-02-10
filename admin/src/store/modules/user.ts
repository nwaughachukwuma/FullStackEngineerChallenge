import {map} from 'lodash';
import employeeService from '@/services/employeeService';
// import User from '../../model/user';

const state = {
  baseUrl: '/user',
  users: [],
  pagination: {},
  user: null,
  loading: false
};

const actions = {
  list({ dispatch, commit, state }, { type = 'employees', query = {}, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    commit('setUsers', { users: [], pagination: {} });

    employeeService
      .list({ type, query })
      .then(response => {
        const pagination = {total_rows: response.data.length, page_size: 5, first_row_no: 1};
        commit('setUsers', { users: response.data, pagination/*response.data.pagination*/ });
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  getOne({ dispatch, commit }, { type = 'employees', userId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    commit('setUser', { user: {} });

    employeeService
      .getOne({ type, userId })
      .then(response => {
        commit('setUser', { user: response.data });
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
  patchOne({ dispatch, commit }, { type = 'user', userId, user, router, redirectUrl = '' }) {
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
  deleteOne({ dispatch, commit }, { type = 'user', userId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    employeeService
      .deleteOne({ type, userId })
      .then(_response => {
        _response;
        dispatch('list', { type });
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: type === 'user' ? 'User has been deleted.' : 'Staff has been deleted.'
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
  setUsers(state, { users, pagination }) {
    let rowNum = pagination.first_row_no;
    state.users = map(users, user => {
      const newUser = {
        rowNum,
        id: user.id,
        name: user.name,
        email: user.email,
        jobDefinition: user.jobDefinition,
        rank: user.rank,
        lastLoginAt: Date.now(), //user.auth.lastLoginAt,
        role: user.role,
        roleName: user.role_name,
        permissions: user.permissions,
        enabled: user.status === 'active',
        enabledName: user.status
      };

      rowNum += 1;
      return newUser;
    });
    state.pagination = pagination;

    state.loading = false;
  },
  setUser(state, { user }) {
    state.user = {
      id: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      confirmedAt: user.confirmed_at,
      registrationIp: user.registration_ip,
      lastLoginAt: user.last_login_at,
      lastLoginIp: user.last_login_ip,
      blockedAt: user.blocked_at,
      role: user.role,
      roleName: user.role_name,
      permissions: user.permissions,
      enabled: user.enabled,
      enabledName: user.enabled_name
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