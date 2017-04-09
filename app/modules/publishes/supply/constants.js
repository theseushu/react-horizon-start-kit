import { catalogs, statusValues, publishTypesInfo, publishTypes } from 'appConstants';
import { actions as publishesActions } from 'api/publishes/ducks';

const type = publishTypes.supply;
const info = publishTypesInfo[type];
export const catalogGroups = catalogs.groupedFarm;

export default type;

// page for list
export const listRoute = {
  path: `/${info.plural}`,
  name: info.plural,
};

// page for single product
export const pageRoute = {
  path: `/${info.route}/:id`,
  name: info.route,
};

export const actions = publishesActions[type];

export const FORM_NAME = type;

export const EMPTY_PRODUCT = {
  category: null,
  species: null,
  name: '',
  specs: [],
  location: null,
  desc: '',
  images: [],
  labels: [],
  status: statusValues.unavailable.value,
};

export const TEST_PRODUCT = {
  category: { name: '人参果', objectId: '5859445ddc9477148f492652', catalog: { objectId: '1', name: 'aaaa', catalogType: 'adlafdjklsa' } },
  species: null,
  name: '',
  specs: [{ name: '默认', params: ['123 rfdqf'], minimum: 1, unit: '斤', price: 1 }],
  location: null,
  desc: '',
  images: [],
  labels: [],
  status: statusValues.unavailable.value,
};

