import axios from 'axios';
import configService from '@/services/configService';

export default {
  async passwordReset({ key, password }) {
    return axios
      .post(`${configService.get('apiUrl')}/user/password-reset`, {
        key,
        password
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async passwordResetRequest({ email }) {
    return axios
      .post(`${configService.get('apiUrl')}/user/password-reset-request`, {
        email
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async register({ username, email, password, firstName, lastName }) {
    return axios
      .post(`${configService.get('apiUrl')}/register`, {
        username,
        email,
        password,
        // eslint-disable-next-line
        first_name: firstName,
        // eslint-disable-next-line
        last_name: lastName
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async login(username, password) {
    console.log('api endpoint >>>', configService.get('apiUrl'))
    return axios
      .post(`${configService.get('apiUrl')}/login`, {
        email: username,
        password
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }
};