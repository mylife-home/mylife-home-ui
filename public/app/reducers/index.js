import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import errors from './errors';
import online from './online';
import resources from './resources';
import windows from './windows';

export default combineReducers({
  errors,
  online,
  resources,
  windows,
  routing: routerReducer
});
