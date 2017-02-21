'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';

export const actionPrimary = () => console.log('actionPrimary');
export const actionSecondary = () => console.log('actionSecondary');
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