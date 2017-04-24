import { publishTypesInfo } from 'funong-common/lib/appConstants';

export default (key) => {
  const SLICE_NAME = `page_${publishTypesInfo[key].route}`;

  return {
    default: {
      [SLICE_NAME]: (state = {}) => state,
    },
    actions: {},
    selectors: {},
    // sagas: [],
  };
};
