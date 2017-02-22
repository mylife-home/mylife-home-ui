'use strict';

import { connect } from 'react-redux';
import { makeGetWindowStack } from '../selectors/windows';
import { actionPrimary, actionSecondary } from '../actions/actions';
import { windowClose } from '../actions/windows';

import Window from '../components/window';

const mapStateToProps = () => {
  const getWindowStack = makeGetWindowStack();
  return (state, props) => ({
    stack : getWindowStack(state, props)
  });
};

const mapDispatchToProps = (dispatch) => ({
  onActionPrimary   : (window, component) => dispatch(actionPrimary(window, component)),
  onActionSecondary : (window, component) => dispatch(actionSecondary(window, component)),
  onWindowClose     : () => dispatch(windowClose())
});

const View = connect(
  mapStateToProps,
  mapDispatchToProps
)(Window);

export default View;
