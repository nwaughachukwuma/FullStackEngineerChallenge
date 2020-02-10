import {pick} from 'lodash';
import axios from 'axios';
import ConfigService from '@/services/configService';
import {toQueryStrings} from '@/utils/helpers';

export default {
  async list({ query = {} }: any = {}) {
    const pickedQuery = pick(query, ['page', 'page_size', 'q']);
    let url = `${ConfigService.get('apiUrl')}/permission`;
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
  userRoles: {
    'super-admin': 'super-admin',
    admin: 'admin',
    staff: 'staff',
    user: 'user'
  },
  userEnabled : {
    active: 1,
    disabled: 0
  }
};