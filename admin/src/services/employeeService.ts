import _ from 'lodash';
import axios from 'axios';
import configService from '@/services/configService';
import {toQueryStrings} from '@/utils/helpers';

export default {
  async list({ type = 'employees', query = {} } = {}) {
    const pickedQuery = _.pick(query, ['page', 'page_size', 'q']);
    let url = `${configService.get('apiUrl')}/${type}`;
    if (pickedQuery.length) {
      url += `?${toQueryStrings(pickedQuery)}`;
    }

    return axios
      .get(url, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async getOne({ type = 'employees', userId }) {
    return axios
      .get(`${configService.get('apiUrl')}/${type}/${userId}`, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async postOne({ type = 'create-employee', user = {} } = {}) {
    return axios
      .post(`${configService.get('apiUrl')}/${type}`, user)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async patchOne({ type = 'employees', userId, newUser }) {
    return axios
      .put(`${configService.get('apiUrl')}/${type}/${userId}`, newUser)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async deleteOne({ type = 'employees', userId }) {
    return axios
      .delete(`${configService.get('apiUrl')}/${type}/${userId}`)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }
};