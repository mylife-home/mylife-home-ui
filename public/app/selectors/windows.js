'use strict';

import { createSelector } from 'reselect';

import { getResources } from './resources';
import { getRepository } from './repository';

export const getWindows = (state) => state.windows;
export const getWindow = (state) => state.windows;

function prepareDisplay(resources, repository, display) {
  if(!display) { return null; }

  return resources.get(display.resource);
}

function prepareText(resources, repository, text) {
  if(!text) { return null; }

  return 'toto';
}

function prepareControl(resources, repository, window, control) {
  const { id, width, height, display, text, primaryAction } = control;

  return {
    id, width, height,
    left    : (window.width * control.x) - (width / 2),
    top     : (window.height * control.y) - (height / 2),
    display : prepareDisplay(resources, repository, display),
    text    : prepareText(resources, repository, text),
    active  : !!primaryAction
  };
}

function prepareWindow(resources, repository, window) {
  const { resource, controls, ...others } = window;
  return {
    resource : resource && resources.get(resource),
    controls : controls.toArray().map(ctrl => prepareControl(resources, repository, window, ctrl)),
    ...others
  };
}

export const makeGetWindowStack = () => createSelector(
  [ getWindows, getResources, getRepository ],
  (windows, resources, repository) => {
    let parent, root;
    for(const window of windows) {
      const current = { window : prepareWindow(resources, repository, window) };
      if(!root) { root = current;}
      if(parent) { parent.popup = current; }
      parent = current;
    }
    return root;
  }
);
