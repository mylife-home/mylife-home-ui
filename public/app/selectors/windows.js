'use strict';

import Immutable from 'immutable';
import { createSelector } from 'reselect';

export const getWindows = (state) => state.windows;

export const makeGetWindowStack = () => createSelector(
  [ getWindows ],
  (windows) => {
    let parent, root;
    for(const window of windows) {
      const current = { window };
      if(!root) { root = current;}
      if(parent) { parent.popup = current; }
      parent = current;
    }
    return root;
  }
);
