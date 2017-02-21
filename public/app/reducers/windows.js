'use strict';

import { handleActions } from 'redux-actions';
import { actionTypes } from '../constants/index';
import Immutable from 'immutable';

function createWindow(raw) {
  console.log('createWindow', raw);
  return raw;
}

export default handleActions({

  [actionTypes.WINDOWS_POPUP] : {
    next : (state, action) => state.push(createWindow(action.payload))
  },

  [actionTypes.WINDOWS_CLOSE] : {
    next : (state/*, action*/) => state.pop()
  },

  [actionTypes.WINDOWS_CHANGE] : {
    next : (state, action) => state.clear().push(createWindow(action.payload))
  }

}, Immutable.List());
