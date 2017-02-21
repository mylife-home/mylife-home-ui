'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import immutableStateInvariant from 'redux-immutable-state-invariant'; // FIXME: remove immutableStateInvariant in production
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';

import dataService from './services/data-service';
import { getAccounts, getGroups } from './actions/common';
import { getOperations } from './actions/management';
import Application from './components/application';
import reducer from './reducers/index';

// TODO: use it where required
import css from '../app.less';


//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const store = createStore(
  reducer,
  applyMiddleware(dataService, immutableStateInvariant(), thunk, createLogger())
);

ReactDOM.render(
  <Provider store={store}>
    <Application/>
  </Provider>,
  document.getElementById('content')
);