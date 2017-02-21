'use strict';

import { windowNavigationChange } from '../actions/windows';

const middleware = (/*store*/) => next => action => {
  next(action);

  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      if(action.payload.action !== 'PUSH') { return; }
      let { pathname } = action.payload;
      pathname = pathname.substr(1);
      return pathname && next(windowNavigationChange(pathname));
    }
  }
};

export default middleware;
