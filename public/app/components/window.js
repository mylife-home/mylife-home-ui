'use strict';

import React from 'react';

import WindowContent from './window-content';

const Window = ({ stack, onActionPrimary, onActionSecondary, onWindowClose }) => (
  stack ? (
    <WindowContent window={stack.window} onActionPrimary={onActionPrimary} onActionSecondary={onActionSecondary} />
  ) : (
    <div className="mylife-overlay">
      <img src="images/spinner.gif" />
    </div>
  )
);

Window.propTypes = {
  stack             : React.PropTypes.object,
  onActionPrimary   : React.PropTypes.func.isRequired,
  onActionSecondary : React.PropTypes.func.isRequired,
  onWindowClose     : React.PropTypes.func.isRequired,
};

export default Window;

// TODO: children (stack.popup)