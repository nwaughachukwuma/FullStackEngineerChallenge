import Swal from 'sweetalert2'

const state = {
  type: null,
  position: null,
  title: null,
  text: null
};

const actions = {
  success({ commit }, { showType, position, title, text }) {
    commit('success', { showType, position, title, text });
  },
  info({ commit }, { showType, position, title, text }) {
    commit('info', { showType, position, title, text });
  },
  error({ commit }, { showType, position, title, text }) {
    commit('error', { showType, position, title, text });
  },
  setMessage({ commit }, { type, message }) {
    commit('setMessage', { type, message });
  },
  clear({ commit }) {
    commit('clear');
  }
};

const getters = {
  errorMessages: state => {
    if (state.type === 'error' && state.text !== '') {
      return state.text.replace('[object Object]', '').trim();
    }
    return '';
  },
  successMessages: state => {
    if (state.type === 'success' && state.text !== '') {
      return state.text;
    }
    return '';
  }
};

const displayToast = ({ type, position, title, text }) => {

  Swal.mixin({
    toast: true,
    position: position || 'top-end', 
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  }).fire({
    icon: type,
    title,
    text,
    background: '#000',
  });
};

const mutations = {
  success(state, { showType, position, title, text }) {
    state.type = 'success';
    state.position = position;
    state.title = title;
    state.text = text;
    if (showType === 'toast') {
      displayToast({ type: state.type, position: state.position, title: state.title, text: state.text });
    }
  },
  info(state, { showType, position, title, text }) {
    state.type = 'info';
    state.position = position;
    state.title = title;
    state.text = text;
    if (showType === 'toast') {
      displayToast({ type: state.type, position: state.position, title: state.title, text: state.text });
    }
  },
  error(state, { showType, position, title, text }) {
    state.type = 'error';
    state.position = position;
    state.title = title;
    state.text = text;
    if (showType === 'toast') {
      displayToast({ type: state.type, position: state.position, title: state.title, text: state.text });
    }
  },
  clear(state) {
    state.type = null;
    state.position = null;
    state.title = null;
    state.text = null;
  },
  setMessage(state, { type, message }) {
    state.type = type;
    state.text = message;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};