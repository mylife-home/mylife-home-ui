'use strict';

import { createAction } from 'redux-actions';
import { push as routerPush } from 'react-router-redux';
import { actionTypes } from '../constants';

import browser from '../utils/detect-browser.js';

import { resourceQuery } from './resources';
import { getWindows } from '../selectors/windows';

const internalWindowsPopup  = createAction(actionTypes.WINDOWS_POPUP);
const internalWindowsClose  = createAction(actionTypes.WINDOWS_CLOSE);
const internalWindowsChange = createAction(actionTypes.WINDOWS_CHANGE);

function getDefaultWindowByPath(state) {
  const routingState = state.routing.locationBeforeTransitions;
  if(!routingState) { return null; }
  let { pathname } = routingState;
  pathname = pathname.substr(1);
  return pathname;
}

function getDefaultWindowByConfig(dispatch, done) {
  return dispatch(resourceQuery({ resource: 'default_window', done: (err, data) => {
    if(err) { return done(err); } // eslint-disable-line no-console
    const windows = JSON.parse(data);
    return done(null, browser.isMobile ? windows.mobile : windows.desktop);
  }}));
}

function getDefaultWindow(dispatch, state, done) {
  let defaultWindow = getDefaultWindowByPath(state);
  if(defaultWindow) { return done(null, defaultWindow); }
  return getDefaultWindowByConfig(dispatch, done);
}

export const windowsInit = () => (dispatch, getState) => {
  const state = getState();
  return getDefaultWindow(dispatch, state, (err, defaultWindow) => {
    if(err) { return console.error(err); } // eslint-disable-line no-console

    console.log(`using default window: ${defaultWindow}`); // eslint-disable-line no-console
    dispatch(windowChange(defaultWindow));
  });
};

export const windowChange = (id) => (dispatch, getState) => {
  const pathname = `/${id}`;
  const state = getState();
  const routingState = state.routing.locationBeforeTransitions;
  if(routingState && routingState.pathname === pathname) {
    return dispatch(windowNavigationChange(id)); // cannot change to same path
  }
  dispatch(routerPush(pathname));
};

function loadWindowAndDispatch(dispatch, id, action) {
  return dispatch(resourceQuery({ resource: `window.${id}`, done: (err, data) => {
    if(err) { return console.error(err); } // eslint-disable-line no-console
    const window = JSON.parse(data);
    return dispatch(action(window));
  }}));
}

export const windowNavigationChange = (id) => (dispatch) => {
  return loadWindowAndDispatch(dispatch, id, internalWindowsChange);
};

export const windowPopup = (id) => (dispatch) => {
  return loadWindowAndDispatch(dispatch, id, internalWindowsPopup);
};

export const windowClose = () => (dispatch, getState) => {
  const state = getState();
  const windows = getWindows(state);
  if(windows.size <= 1) {
    console.error('Cannot close root window!'); // eslint-disable-line no-console
    return;
  }
  return dispatch(internalWindowsClose());
};
