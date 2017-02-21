'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import immutableStateInvariant from 'redux-immutable-state-invariant';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import socketMiddleware from './middlewares/socket';
import resourcesMiddleware from './middlewares/resources';
import navigationMiddleware from './middlewares/navigation';
import reducer from './reducers/index';

import Application from './components/application';
import Bootstrap from './components/bootstrap';
import View from './containers/view';

import { windowsInit } from './actions/windows';

import /*css from*/ '../app.less';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const store = createStore(
  reducer,
  applyMiddleware(navigationMiddleware, socketMiddleware, resourcesMiddleware, routerMiddleware(hashHistory), immutableStateInvariant(), thunk, createLogger())
);

const history = syncHistoryWithStore(hashHistory, store);

store.dispatch(windowsInit());

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
        <Route path="/" component={Application}>
          <IndexRoute component={Bootstrap} />
          <Route path=":window" component={View} />
        </Route>
      </Router>
  </Provider>,
  document.getElementById('content')
);
