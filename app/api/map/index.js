import combineModules from '../utils/combineModules';
import * as init from './init';
import * as center from './center';
import * as getCurrentLocation from './getCurrentLocation';
import { SLICE_NAME } from './constants';

const modules = { init, center, getCurrentLocation };

module.exports = combineModules(modules, SLICE_NAME);