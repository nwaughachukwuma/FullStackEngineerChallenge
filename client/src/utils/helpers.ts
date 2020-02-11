import {isEmpty} from 'lodash';
import moment from 'moment';

export const toQueryStrings = params => {
  return Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');
};

export const validateDateTime = async value => {
  if (isEmpty(value)) {
    return true;
  }

  return moment.parseZone(value).isValid();
};

export default {
  toQueryStrings,
  validateDateTime
};