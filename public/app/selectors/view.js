'use strict';

import { getWindowDisplay } from './windows';

export const getView = (state) => state.view;

export const getViewDisplay = (state) => {
  let parent, root;
  for(const window of getView(state)) {
    const current = { window : getWindowDisplay(state, { window }) };
    if(!root) { root = current;}
    if(parent) { parent.popup = current; }
    parent = current;
  }
  return root;
};
