import {pick} from 'lodash';
import axios from 'axios';
import configService from '@/services/configService';
import {toQueryStrings} from '@/utils/helpers';

export default {
  async list({ type = 'perf-reviews', query = {} } = {}) {
    const pickedQuery = pick(query, ['page', 'page_size', 'q']);
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

  async getOne({ type = 'perf-reviews', prId }) {
    return axios
      .get(`${configService.get('apiUrl')}/${type}/${prId}`, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async postOne({ type = 'create-perf-review', performance_review = {} } = {}) {
    return axios
      .post(`${configService.get('apiUrl')}/${type}`, performance_review)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async patchOne({ type = 'perf-reviews', prId, newPR }) {
    return axios
      .put(`${configService.get('apiUrl')}/${type}/${prId}`, newPR)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async deleteOne({ type = 'perf-reviews', prId }) {
    return axios
      .delete(`${configService.get('apiUrl')}/${type}/${prId}`)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async postOneReviewer({ type = 'create-reviewer', reviewer = {} } = {}) {
    return axios
      .post(`${configService.get('apiUrl')}/${type}`, reviewer)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },
};