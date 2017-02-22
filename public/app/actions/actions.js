'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const actionPrimary = (window, control) => console.log('actionPrimary', window, control);
export const actionSecondary = (window, control) => console.log('actionSecondary', window, control);
/*

  ACTION_COMPONENT     : null,

{
  id   : cspec.component_id,
  name : cspec.component_action
  //args :[]
}


  ACTION_WINDOW_CHANGE : null,
  ACTION_WINDOW_POPUP  : null,

*/