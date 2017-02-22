'use strict';

import { createAction } from 'redux-actions';
import { actionTypes } from '../constants';
import { getWindowControl } from '../selectors/windows';
import { windowChange, windowPopup } from './windows';

const actionComponent  = createAction(actionTypes.ACTION_COMPONENT);


function dispatchAction(dispatch, action) {
  if(action.window) {
    return dispatch((action.popup ? windowPopup : windowChange)(action.window));
  }

  if(action.component) {
    return dispatch(actionComponent({
      id   : action.component,
      name : action.action
      //args :[]
    }));
  }
}

export const actionPrimary   = (window, control) => (dispatch, getState) => dispatchAction(dispatch, getWindowControl(getState(), { window, control }).primaryAction);
export const actionSecondary = (window, control) => (dispatch, getState) => dispatchAction(dispatch, getWindowControl(getState(), { window, control }).secondaryAction);
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