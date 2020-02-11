import {pick} from 'lodash';
import axios from 'axios';
import configService from '@/services/configService';
import {toQueryStrings} from '@/utils/helpers';

export default {
  async list({ type = 'assinged-reviews', query = {} } = {}) {
    const pickedQuery = pick(query, ['page', 'page_size', 'q']);
    let url = `${configService.get('employeeUrl')}/${type}`;
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

  async getOne({ type = 'pending-reviews', reviewId }) {
    return axios
      .get(`${configService.get('employeeUrl')}/${type}/${reviewId}`, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async getPending({ type = 'pending-reviews', employeeId }) {
    return axios
      .get(`${configService.get('employeeUrl')}/${type}/${employeeId}`, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async postOne({ type = 'give-feedback', feedback = {} } = {}) {
    return axios
      .post(`${configService.get('employeeUrl')}/${type}`, feedback)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },
};