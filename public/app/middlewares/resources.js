'use strict';

import request from 'superagent';
import { actionTypes } from '../constants/index';

import { resourceGet } from '../actions/resources';

const middleware = (/*store*/) => next => action => {
  next(action);

  switch (action.type) {
    case actionTypes.RESOURCE_QUERY:
      request
        .get(`/resources/get/${action.payload.resource}`)
        .end((err, res) => {
          if (err) {
            return next(resourceGet(new Error(JSON.parse(res.text))));
          }
          return next(resourceGet({ ...action.payload, content: JSON.parse(res.text) }));
        });
      break;
  }
};

export default middleware;
